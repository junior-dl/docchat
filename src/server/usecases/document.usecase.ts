import { documentService } from "../services/document.service";
import { chunkService } from "../services/chunk.service";
import { usageService } from "../services/usage.service";
import { readPdf, chunkPages } from "../lib/pdf";
import { resolveKey, EMBED_MODEL, EMBED_DIMS, estimateTokens } from "../lib/gemini";
import { limitsFor, LimitError } from "../lib/limits";

export const listDocuments = (sessionId: string) => documentService.list(sessionId);
export const deleteDocument = (sessionId: string, id: string) => documentService.remove(sessionId, id);

export async function uploadDocument(input: { sessionId: string; file: File; apiKey: string | null }) {
  const { client, keySource } = resolveKey(input.apiKey);
  const limits = limitsFor(keySource);

  if (input.file.type !== "application/pdf") throw new LimitError("Only PDF files are supported.");
  if (input.file.size > limits.maxFileBytes) throw new LimitError(`File too large (max ${limits.maxFileBytes / 1024 / 1024} MB).`);
  if ((await documentService.countForSession(input.sessionId)) >= limits.maxDocuments)
    throw new LimitError(`Document limit reached (${limits.maxDocuments}).`);

  const pages = await readPdf(new Uint8Array(await input.file.arrayBuffer()));
  if (pages.length > limits.maxPagesPerDocument) throw new LimitError(`Too many pages (max ${limits.maxPagesPerDocument}).`);
  const pieces = chunkPages(pages);
  if (!pieces.length) throw new LimitError("No text found. Scanned PDFs without a text layer aren't supported.");

  const tokens = pieces.reduce((n, p) => n + estimateTokens(p.content), 0);
  await usageService.assertWithinLimits(input.sessionId, keySource, tokens);

  const vectors: number[][] = [];
  for (let i = 0; i < pieces.length; i += 100) {
    const res = await client.models.embedContent({
      model: EMBED_MODEL,
      contents: pieces.slice(i, i + 100).map((p) => p.content),
      config: { taskType: "RETRIEVAL_DOCUMENT", outputDimensionality: EMBED_DIMS },
    });
    vectors.push(...(res.embeddings ?? []).map((e) => e.values ?? []));
  }

  const doc = await documentService.create({ sessionId: input.sessionId, name: input.file.name, pageCount: pages.length, chunkCount: pieces.length });
  await chunkService.insertMany(pieces.map((p, i) => ({ ...p, documentId: doc.id, sessionId: input.sessionId, embedding: vectors[i] })));
  await usageService.record({ sessionId: input.sessionId, kind: "embed", keySource, inputTokens: tokens, outputTokens: 0 });
  return { document: doc, tokens };
}
