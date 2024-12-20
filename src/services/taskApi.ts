import axiosInstance from "~/api/axiosInstance";
import { Task } from "~/types/Task";
import { TaskStatus } from "~/types/StatusEnum";
import { Category } from "~/types/Category";
import { Response } from "~/types/Response";
import { PaginatedTasksResponse } from "~/mocks/handlers/taskHandlers";

export interface CreateTaskRequest {
	title: string;
	category: Category[];
	status: TaskStatus;
}

export interface UpdateTaskRequest {
	title?: string;
	category?: Category[];
	status?: TaskStatus;
}

// Add task
export const add = (taskData: CreateTaskRequest): Promise<Response<Task>> => {
	const url = "/tasks";
	return axiosInstance.post(url, taskData);
};

// Update task
export const update = (
	taskId: string,
	taskData: UpdateTaskRequest,
): Promise<Response<Task>> => {
	const url = `/tasks/${taskId}`;
	return axiosInstance.patch(url, taskData);
};

// Delete task
export const deleteTaskApi = (taskId: string): Promise<void> => {
	const url = `/tasks/${taskId}`;
	return axiosInstance.delete(url);
};

// Get all tasks (with pagination)
// export const get = (page: number): Promise<PaginatedTasksResponse> => {
// 	const url = `/tasks?page=${page}`;
// 	return axiosInstance.get(url);
// };

export const get = (
	page: number,
	limit?: number,
): Promise<PaginatedTasksResponse> => {
	const url = limit
		? `/tasks?page=${page}&limit=${limit}`
		: `/tasks?page=${page}`;
	return axiosInstance.get(url);
};

export const search = (
	query: string,
	page: number,
	limit?: number,
): Promise<PaginatedTasksResponse> => {
	const url = limit
		? `/tasks?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
		: `/tasks?query=${encodeURIComponent(query)}&page=${page}`;
	return axiosInstance.get(url);
};

// Get task by ID
export const getTaskById = (taskId: string): Promise<Response<Task>> => {
	const url = `/tasks/${taskId}`;
	return axiosInstance.get(url);
};
