import { and, count, desc, eq } from "drizzle-orm";
import { db } from "../db/client";
import { documents } from "../db/schema";

export const documentService = {
  list(sessionId: string) {
    return db.select().from(documents).where(eq(documents.sessionId, sessionId)).orderBy(desc(documents.createdAt));
  },
  async countForSession(sessionId: string) {
    const [r] = await db.select({ n: count() }).from(documents).where(eq(documents.sessionId, sessionId));
    return r.n;
  },
  async create(v: { sessionId: string; name: string; pageCount: number; chunkCount: number }) {
    const [row] = await db.insert(documents).values(v).returning();
    return row;
  },
  async remove(sessionId: string, id: string) {
    await db.delete(documents).where(and(eq(documents.id, id), eq(documents.sessionId, sessionId)));
  },
};
