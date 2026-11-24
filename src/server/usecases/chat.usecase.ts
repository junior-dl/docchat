import { chunkService } from "../services/chunk.service";
import { usageService } from "../services/usage.service";
import { resolveKey, CHAT_MODEL, CHAT_FALLBACKS, EMBED_MODEL, EMBED_DIMS, estimateTokens, withGeminiRetry, geminiErrorMessage } from "../lib/gemini";
import { GeminiUserError } from "../lib/limits";

const SYSTEM = `You answer questions using ONLY the numbered sources provided.
Cite every claim with its source number in square brackets, e.g. [1] or [2][3].
If the sources don't contain the answer, say you couldn't find it in the uploaded documents.`;

export async function askQuestion(input: { sessionId: string; question: string; apiKey: string | null }) {
  const { keySource } = resolveKey(input.apiKey);
  try {
    return await ask(input);
  } catch (e) {
    const friendly = geminiErrorMessage(e, keySource);
    if (friendly) throw new GeminiUserError(friendly.status, friendly.message);
    throw e;
  }
}

async function ask(input: { sessionId: string; question: string; apiKey: string | null }) {
  const { client, keySource } = resolveKey(input.apiKey);
  await usageService.assertWithinLimits(input.sessionId, keySource, estimateTokens(input.question) + 3000);

  const q = await withGeminiRetry([EMBED_MODEL], (model) =>
    client.models.embedContent({ model, contents: [input.question], config: { taskType: "RETRIEVAL_QUERY", outputDimensionality: EMBED_DIMS } }),
  );
  const sources = await chunkService.search(input.sessionId, q.embeddings?.[0]?.values ?? []);
  if (!sources.length) return { answer: "Upload a PDF first, then ask a question about it.", citations: [], usage: { inputTokens: 0, outputTokens: 0 } };

  const context = sources.map((s, i) => `[${i + 1}] (${s.documentName}, p.${s.page})\n${s.content}`).join("\n\n");
  let usedModel = CHAT_MODEL;
  const res = await withGeminiRetry([CHAT_MODEL, ...CHAT_FALLBACKS], (model) => {
    usedModel = model;
    return client.models.generateContent({
      model,
      contents: `Sources:\n${context}\n\nQuestion: ${input.question}`,
      config: { systemInstruction: SYSTEM, temperature: 0.2 },
    });
  });

  const usage = {
    inputTokens: res.usageMetadata?.promptTokenCount ?? 0,
    outputTokens: res.usageMetadata?.candidatesTokenCount ?? 0,
  };
  await usageService.record({ sessionId: input.sessionId, kind: "chat", keySource, ...usage });

  return {
    answer: res.text ?? "",
    citations: sources.map((s, i) => ({ n: i + 1, document: s.documentName, page: s.page, snippet: s.content.slice(0, 280), score: Number(s.score) })),
    usage,
    model: usedModel,
  };
}
