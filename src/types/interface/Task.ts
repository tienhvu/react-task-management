import { Category } from "./Category";

export interface Task {
	id: number;
	title: string;
	category: Category;
	status: "pending" | "completed";
	createdAt: string;
	completedAt: string | null;
}
