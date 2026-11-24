import { usageService } from "../services/usage.service";
import type { KeySource } from "../lib/limits";

export const getUsage = (sessionId: string, keySource: KeySource) => usageService.summary(sessionId, keySource);
