import { authHandlers } from "./authHandlers";
import { categoryHandlers } from "./categoryHandlers";

export const handlers = [...authHandlers, ...categoryHandlers];
