import { authHandlers } from "./authHandlers";
import { categoryHandlers } from "./categoryHandler";
import { taskHandlers } from "./taskHandler";

export const handlers = [...authHandlers, ...categoryHandlers, ...taskHandlers];
