import { extractText, getDocumentProxy } from "unpdf";

export interface PageText { page: number; text: string }

// Parsed in memory only. The PDF itself is never stored.
export async function readPdf(bytes: Uint8Array): Promise<PageText[]> {
  const pdf = await getDocumentProxy(bytes);
  const { text } = await extractText(pdf, { mergePages: false });
  return text.map((t, i) => ({ page: i + 1, text: t.replace(/\s+/g, " ").trim() }));
}

export function chunkPages(pages: PageText[], size = 1200, overlap = 200) {
  const out: { page: number; content: string }[] = [];
  for (const p of pages) {
    for (let i = 0; i < p.text.length; i += size - overlap) {
      const content = p.text.slice(i, i + size).trim();
      if (content.length > 40) out.push({ page: p.page, content });
      if (i + size >= p.text.length) break;
    }
  }
  return out;
}
