export interface DocumentItem { id: string; name: string; pageCount: number; chunkCount: number; createdAt: string }
export interface Citation { n: number; document: string; page: number; snippet: string; score: number }
export interface Message { id: string; role: "user" | "assistant"; content: string; citations?: Citation[]; usage?: { inputTokens: number; outputTokens: number } }
export interface Limits { maxDocuments: number; maxPagesPerDocument: number; maxFileBytes: number; requestsPerMinute: number; tokensPerMinute: number; requestsPerDay: number }
export interface Usage { keySource: "default" | "own"; limits: Limits; minute: { requests: number; tokens: number }; day: { requests: number }; total: { inputTokens: number; outputTokens: number } }
