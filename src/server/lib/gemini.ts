import { GoogleGenAI } from "@google/genai";
import type { KeySource } from "./limits";

export function resolveKey(headerKey: string | null): { client: GoogleGenAI; keySource: KeySource } {
  const own = headerKey?.trim();
  const apiKey = own || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("No Gemini API key available");
  return { client: new GoogleGenAI({ apiKey }), keySource: own ? "own" : "default" };
}

export const CHAT_MODEL = process.env.GEMINI_CHAT_MODEL ?? "gemini-3.5-flash";
export const EMBED_MODEL = process.env.GEMINI_EMBED_MODEL ?? "gemini-embedding-001";
export const EMBED_DIMS = 768;

// The embeddings API returns no token counts, so estimate them (~4 chars per token).
export const estimateTokens = (s: string) => Math.ceil(s.length / 4);

// Fallback chat models, tried in order when the main model is overloaded.
export const CHAT_FALLBACKS = (process.env.GEMINI_CHAT_FALLBACKS ?? "gemini-3.5-flash-lite,gemini-3.1-flash-lite")
  .split(",").map((m) => m.trim()).filter(Boolean);

const statusOf = (e: unknown) => (e as { status?: number })?.status;
const isTransient = (e: unknown) => [429, 500, 503, 504].includes(statusOf(e) ?? 0);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Retries transient Gemini errors with backoff, then moves to the next model. */
export async function withGeminiRetry<T>(models: string[], call: (model: string) => Promise<T>, attempts = 2): Promise<T> {
  let last: unknown;
  for (const model of models) {
    for (let i = 0; i < attempts; i++) {
      try {
        return await call(model);
      } catch (e) {
        last = e;
        // Retired or unknown model: skip to the next one instead of failing.
        if (statusOf(e) === 404 && models.length > 1) break;
        if (!isTransient(e)) throw e;
        // A per-day quota error won't clear up with retries.
        if (statusOf(e) === 429 && /per.?day|daily/i.test(String((e as Error).message))) throw e;
        await sleep(800 * 2 ** i + Math.random() * 300);
      }
    }
  }
  throw last;
}

/** Turns Gemini API errors into messages users can act on. */
export function geminiErrorMessage(e: unknown, keySource: "default" | "own"): { status: number; message: string } | null {
  const status = statusOf(e);
  if (!status) return null;
  const msg = String((e as Error).message);
  if (status === 503 || status === 500 || status === 504)
    return { status: 503, message: "Gemini is busy right now. Please try again in a minute." };
  if (status === 429)
    return { status: 429, message: keySource === "own" ? "Your Gemini key hit its rate limit. Wait a bit and try again." : "The free key hit Gemini's rate limit. Try again soon, or add your own key." };
  if (status === 404) return { status: 502, message: "The configured Gemini model isn't available. Update GEMINI_CHAT_MODEL / GEMINI_CHAT_FALLBACKS." };
  if (status === 400 && /api key/i.test(msg)) return { status: 401, message: "That Gemini API key isn't valid. Check it and save again." };
  if (status === 401 || status === 403) return { status: 401, message: keySource === "own" ? "Your Gemini key was rejected. Check it in Google AI Studio." : "The default key was rejected. Add your own Gemini key." };
  return null;
}
