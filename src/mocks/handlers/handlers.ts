import { authHandlers } from "./authHandlers";
import { categoryHandlers } from "./categoryHandlers";
import { userHandlers } from "./userHandlers";

export const handlers = [...authHandlers, ...userHandlers, ...categoryHandlers];
