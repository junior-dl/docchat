import { ensureSession, handle } from "./http";
export const POST = handle(async () => {
  const s = await ensureSession();
  return { expiresAt: s.expiresAt };
});
