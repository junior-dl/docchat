import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSession, startSession } from "../usecases/session.usecase";
import { LimitError, GeminiUserError } from "../lib/limits";

export const SESSION_COOKIE = "rag_sid";
export const apiKeyFrom = (req: Request) => req.headers.get("x-gemini-key");

export async function requireSession() {
  const id = (await cookies()).get(SESSION_COOKIE)?.value;
  const s = id ? await getSession(id) : null;
  if (!s) throw new HttpError(401, "Session expired. Refresh to start a new one.");
  return s;
}

export async function ensureSession() {
  const jar = await cookies();
  const id = jar.get(SESSION_COOKIE)?.value;
  const existing = id ? await getSession(id) : null;
  if (existing) return existing;
  const s = await startSession();
  jar.set(SESSION_COOKIE, s.id, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", expires: s.expiresAt, path: "/" });
  return s;
}

export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export function handle(fn: (req: Request, ctx: any) => Promise<unknown>) {
  return async (req: Request, ctx: any) => {
    try {
      return NextResponse.json(await fn(req, ctx));
    } catch (e) {
      const status = e instanceof HttpError || e instanceof LimitError || e instanceof GeminiUserError ? e.status : 500;
      if (status === 500) console.error(e);
      return NextResponse.json({ error: status === 500 ? "Something went wrong." : (e as Error).message }, { status });
    }
  };
}
