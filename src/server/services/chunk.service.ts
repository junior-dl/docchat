import { cosineDistance, eq, sql, asc } from "drizzle-orm";
import { db } from "../db/client";
import { chunks, documents } from "../db/schema";

export const chunkService = {
  async insertMany(rows: { documentId: string; sessionId: string; page: number; content: string; embedding: number[] }[]) {
    for (let i = 0; i < rows.length; i += 100) await db.insert(chunks).values(rows.slice(i, i + 100));
  },
  // Only searches the caller's own session.
  search(sessionId: string, embedding: number[], k = 6) {
    const distance = cosineDistance(chunks.embedding, embedding);
    return db
      .select({
        id: chunks.id,
        page: chunks.page,
        content: chunks.content,
        documentName: documents.name,
        score: sql<number>`1 - (${distance})`,
      })
      .from(chunks)
      .innerJoin(documents, eq(documents.id, chunks.documentId))
      .where(eq(chunks.sessionId, sessionId))
      .orderBy(asc(distance))
      .limit(k);
  },
};
