import { eq, lt, sql } from "drizzle-orm";
import { db } from "../db/client";
import { sessions } from "../db/schema";

export const sessionService = {
  async create() {
    const [row] = await db.insert(sessions).values({}).returning();
    return row;
  },
  async findActive(id: string) {
    const [row] = await db.select().from(sessions).where(eq(sessions.id, id));
    if (!row || row.expiresAt < new Date()) return null;
    return row;
  },
  async remove(id: string) {
    await db.delete(sessions).where(eq(sessions.id, id));
  },
  // Cascades to documents, chunks and usage_events.
  async removeExpired() {
    const rows = await db.delete(sessions).where(lt(sessions.expiresAt, sql`now()`)).returning({ id: sessions.id });
    return rows.length;
  },
};
