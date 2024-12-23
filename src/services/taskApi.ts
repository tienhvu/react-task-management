import axiosInstance from "~/api/axiosInstance";
import { Task } from "~/types/Task";
import { TaskStatus } from "~/types/StatusEnum";
import { Category } from "~/types/Category";
import { Response } from "~/types/Response";
import { PaginatedResponse } from "~/types/PaginationResponse";

export interface CreateTaskRequest {
	title: string;
	categories: Category[];
	status: TaskStatus;
}

export interface UpdateTaskRequest {
	title: string;
	categories?: Category[];
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
export const remove = (taskId: string): Promise<void> => {
	const url = `/tasks/${taskId}`;
	return axiosInstance.delete(url);
};

//Get
export const get = (
	page: number,
	limit?: number,
): Promise<PaginatedResponse<Task>> => {
	const url = limit
		? `/tasks?page=${page}&limit=${limit}`
		: `/tasks?page=${page}`;
	return axiosInstance.get(url);
};

//Search
export const search = (
	query: string,
	page: number,
	limit?: number,
): Promise<PaginatedResponse<Task>> => {
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
