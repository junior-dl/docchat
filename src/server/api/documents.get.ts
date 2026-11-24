import { handle, requireSession } from "./http";
import { listDocuments } from "../usecases/document.usecase";
export const GET = handle(async () => listDocuments((await requireSession()).id));
