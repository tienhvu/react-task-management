import { Category } from "./Category";
import { TaskStatus } from "./StatusEnum";

export interface Task {
	id: string;
	title: string;
	categories: Category[];
	status: TaskStatus;
	createdAt: Date;
	updatedAt: Date;
}
