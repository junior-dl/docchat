import { cookies } from "next/headers";
import { handle, requireSession, SESSION_COOKIE } from "./http";
import { endSession } from "../usecases/session.usecase";
export const DELETE = handle(async () => {
  const s = await requireSession();
  await endSession(s.id);
  (await cookies()).delete(SESSION_COOKIE);
  return { ok: true };
});
