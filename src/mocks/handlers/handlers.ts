import { authHandlers } from "./authHandlers";
import { userHandlers } from "./userHandlers";
import { categoryHandlers } from "./categoryHandlers";

export const handlers = [...authHandlers, ...userHandlers, ...categoryHandlers];
