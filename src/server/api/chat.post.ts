import { z } from "zod";
import { apiKeyFrom, handle, HttpError, requireSession } from "./http";
import { askQuestion } from "../usecases/chat.usecase";
const Body = z.object({ question: z.string().trim().min(1).max(2000) });
export const POST = handle(async (req) => {
  const s = await requireSession();
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) throw new HttpError(400, "Question must be 1–2000 characters.");
  return askQuestion({ sessionId: s.id, question: parsed.data.question, apiKey: apiKeyFrom(req) });
});
