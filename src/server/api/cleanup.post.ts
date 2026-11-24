import { handle, HttpError } from "./http";
import { purgeExpiredSessions } from "../usecases/session.usecase";
// Called hourly by the n8n workflow.
export const POST = handle(async (req) => {
  if (!process.env.CRON_SECRET || req.headers.get("x-cron-secret") !== process.env.CRON_SECRET) throw new HttpError(401, "Unauthorized");
  return purgeExpiredSessions();
});
