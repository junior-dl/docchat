import { apiKeyFrom, handle, HttpError, requireSession } from "./http";
import { uploadDocument } from "../usecases/document.usecase";
export const POST = handle(async (req) => {
  const s = await requireSession();
  const file = (await req.formData()).get("file");
  if (!(file instanceof File)) throw new HttpError(400, "Attach a PDF as 'file'.");
  return uploadDocument({ sessionId: s.id, file, apiKey: apiKeyFrom(req) });
});
