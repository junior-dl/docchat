// Limits for the shared default key. Adjust to your own Gemini quota.
export const DEFAULT_KEY_LIMITS = {
  maxDocuments: 3,
  maxPagesPerDocument: 30,
  maxFileBytes: 5 * 1024 * 1024,
  requestsPerMinute: 5,
  tokensPerMinute: 60_000,
  requestsPerDay: 25,
} as const;

// Estimates shown to users with their own key. Check your tier in Google AI Studio.
export const OWN_KEY_LIMITS = {
  maxDocuments: 20,
  maxPagesPerDocument: 300,
  maxFileBytes: 20 * 1024 * 1024,
  requestsPerMinute: 10,
  tokensPerMinute: 250_000,
  requestsPerDay: 250,
} as const;

export type KeySource = "default" | "own";
export const limitsFor = (k: KeySource) => (k === "own" ? OWN_KEY_LIMITS : DEFAULT_KEY_LIMITS);

export class LimitError extends Error {
  status = 429;
}

export class GeminiUserError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
