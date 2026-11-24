import { GoogleGenAI } from "@google/genai";
import type { KeySource } from "./limits";

export function resolveKey(headerKey: string | null): { client: GoogleGenAI; keySource: KeySource } {
  const own = headerKey?.trim();
  const apiKey = own || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("No Gemini API key available");
  return { client: new GoogleGenAI({ apiKey }), keySource: own ? "own" : "default" };
}

export const CHAT_MODEL = process.env.GEMINI_CHAT_MODEL ?? "gemini-2.5-flash";
export const EMBED_MODEL = process.env.GEMINI_EMBED_MODEL ?? "gemini-embedding-001";
export const EMBED_DIMS = 768;

// The embeddings API returns no token counts, so estimate them (~4 chars per token).
export const estimateTokens = (s: string) => Math.ceil(s.length / 4);
