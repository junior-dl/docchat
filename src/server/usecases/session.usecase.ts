import { sessionService } from "../services/session.service";

export const startSession = () => sessionService.create();
export const getSession = (id: string) => sessionService.findActive(id);
export const endSession = (id: string) => sessionService.remove(id);
export const purgeExpiredSessions = async () => ({ deleted: await sessionService.removeExpired() });
