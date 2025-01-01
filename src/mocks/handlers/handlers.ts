import { authHandlers } from "./authHandlers";
import { userHandlers } from "./userHandlers";
import { categoryHandlers } from "./categoryHandlers";
import { taskHandlers } from "./taskHandlers";

export const handlers = [
	...authHandlers,
	...userHandlers,
	...categoryHandlers,
	...taskHandlers,
];
