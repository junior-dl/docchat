import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "../db/client";
import { usageEvents } from "../db/schema";
import { limitsFor, LimitError, type KeySource } from "../lib/limits";

export const usageService = {
  record(v: { sessionId: string; kind: "embed" | "chat"; keySource: KeySource; inputTokens: number; outputTokens: number }) {
    return db.insert(usageEvents).values(v);
  },
  async summary(sessionId: string, keySource: KeySource) {
    const since = (ms: number) => new Date(Date.now() - ms);
    const agg = (from: Date) =>
      db
        .select({
          requests: sql<number>`count(*)::int`,
          input: sql<number>`coalesce(sum(${usageEvents.inputTokens}),0)::int`,
          output: sql<number>`coalesce(sum(${usageEvents.outputTokens}),0)::int`,
        })
        .from(usageEvents)
        .where(and(eq(usageEvents.sessionId, sessionId), eq(usageEvents.keySource, keySource), gte(usageEvents.createdAt, from)));
    const [[minute], [day], [total]] = await Promise.all([agg(since(60_000)), agg(since(86_400_000)), agg(new Date(0))]);
    return {
      keySource,
      limits: limitsFor(keySource),
      minute: { requests: minute.requests, tokens: minute.input + minute.output },
      day: { requests: day.requests },
      total: { inputTokens: total.input, outputTokens: total.output },
    };
  },
  // Business rule: block a request that would go over any limit.
  async assertWithinLimits(sessionId: string, keySource: KeySource, upcomingTokens = 0) {
    const s = await this.summary(sessionId, keySource);
    const l = s.limits;
    if (s.minute.requests >= l.requestsPerMinute) throw new LimitError("Requests-per-minute limit reached. Wait a moment.");
    if (s.minute.tokens + upcomingTokens > l.tokensPerMinute) throw new LimitError("Tokens-per-minute limit reached. Wait a moment.");
    if (s.day.requests >= l.requestsPerDay)
      throw new LimitError(keySource === "default" ? "Daily limit for the free key reached. Add your own Gemini key to continue." : "Daily limit reached.");
  },
};
