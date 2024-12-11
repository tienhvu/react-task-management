import { authHandlers } from "./authHandlers";
import { userHandlers } from "./userHandlers";

export const handlers = [...authHandlers, ...userHandlers];
