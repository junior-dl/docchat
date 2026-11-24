import { apiKeyFrom, handle, requireSession } from "./http";
import { getUsage } from "../usecases/usage.usecase";
export const GET = handle(async (req) => getUsage((await requireSession()).id, apiKeyFrom(req) ? "own" : "default"));
