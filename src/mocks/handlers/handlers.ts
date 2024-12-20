import { authHandlers } from "./authHandlers";
import { userHandlers } from "./userHandlers";
import { categoryHandlers } from "./categoryHandlers";
import { taskHandlers } from "./taskHandlers";
import { userHandlers } from "./userHandlers";

export const handlers = [
	...authHandlers,
	...userHandlers,
	...categoryHandlers,
	...taskHandlers,
, ...userHandlers];
