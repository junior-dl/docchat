import { handle, requireSession } from "./http";
import { deleteDocument } from "../usecases/document.usecase";
export const DELETE = handle(async (_req, ctx: { params: Promise<{ id: string }> }) => {
  const s = await requireSession();
  await deleteDocument(s.id, (await ctx.params).id);
  return { ok: true };
});
