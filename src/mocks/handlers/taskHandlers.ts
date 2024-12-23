/* eslint-disable @typescript-eslint/no-empty-object-type */
import { http, HttpResponse } from "msw";
import { baseURL } from "~/api/axiosInstance";
import { ErrorResponse } from "~/types/ErrorResponse";
import { v4 as uuidv4 } from "uuid";
import { Category } from "~/types/Category";
import { TaskStatus } from "~/types/StatusEnum";
import { Task } from "~/types/Task";
import { Response } from "~/types/Response";
import { PaginatedResponse } from "~/types/PaginationResponse";
type CreateTaskRequest = {
	title: string;
	categories: Category[];
	status: TaskStatus;
};

type UpdateTaskRequest = {
	title?: string;
	categories?: Category[];
	status?: TaskStatus;
};

const tasks: Task[] = JSON.parse(localStorage.getItem("tasks") || "[]");

function updateTaskStorage() {
	localStorage.setItem("tasks", JSON.stringify(tasks));
}

export const taskHandlers = [
	// Add task
	http.post<{}, CreateTaskRequest, Response<Task> | ErrorResponse>(
		`${baseURL}/tasks`,
		async ({ request }) => {
			const newTask = await request.json();

			await new Promise((resolve) => setTimeout(resolve, 2000));

			if (!newTask.title || newTask.title.trim() === "") {
				return HttpResponse.json(
					{ message: "Task title is required", statusCode: 400 },
					{ status: 400 },
				);
			}

			const task: Task = {
				id: uuidv4(),
				title: newTask.title,
				categories: newTask.categories || [],
				status: newTask.status,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			tasks.push(task);
			updateTaskStorage();

			return HttpResponse.json(
				{ data: task, message: "Task added successfully" },
				{ status: 201 },
			);
		},
	),

	// Update task
	http.patch<
		{ taskId: string },
		UpdateTaskRequest,
		Response<Task> | ErrorResponse
	>(`${baseURL}/tasks/:taskId`, async ({ params, request }) => {
		const { taskId } = params;
		const taskUpdate = await request.json();

		await new Promise((resolve) => setTimeout(resolve, 2000));

		const existingTask = tasks.find((task) => task.id === taskId);
		if (!existingTask) {
			return HttpResponse.json(
				{ message: "Task not found", statusCode: 404 },
				{ status: 404 },
			);
		}

		existingTask.title = taskUpdate.title ?? existingTask.title;
		existingTask.categories = taskUpdate.categories ?? existingTask.categories;
		existingTask.status = taskUpdate.status ?? existingTask.status;
		existingTask.updatedAt = new Date();

		updateTaskStorage();

		return HttpResponse.json(
			{ data: existingTask, message: "Task updated successfully" },
			{ status: 200 },
		);
	}),

	// Delete task
	http.delete<{ taskId: string }, {}, ErrorResponse | null>(
		`${baseURL}/tasks/:taskId`,
		async ({ params }) => {
			const { taskId } = params;
			const taskIndex = tasks.findIndex((task) => task.id === taskId);
			if (taskIndex === -1) {
				return HttpResponse.json(
					{ message: "Task not found", statusCode: 404 },
					{ status: 404 },
				);
			}

			tasks.splice(taskIndex, 1);
			updateTaskStorage();

			return HttpResponse.json(undefined, { status: 204 });
		},
	),

	// Get tasks (with pagination and optional search query)
	http.get<{}, {}, PaginatedResponse<Task>>(
		`${baseURL}/tasks`,
		async ({ request }) => {
			const urlObj = new URL(request.url);
			const query = urlObj.searchParams.get("query")?.toLowerCase();
			const page = parseInt(urlObj.searchParams.get("page") || "1", 10);
			const limit = parseInt(urlObj.searchParams.get("limit") || "10", 10);

			const filteredTasks = query
				? tasks.filter((task) => task.title.toLowerCase().includes(query))
				: tasks;

			const sortedTasks = filteredTasks.sort((a, b) => {
				return (
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				);
			});

			const startIndex = (page - 1) * limit;
			const endIndex = startIndex + limit;
			const paginatedTasks = sortedTasks.slice(startIndex, endIndex);

			return HttpResponse.json(
				{
					data: {
						items: paginatedTasks,
						meta: {
							total: filteredTasks.length,
							page,
							limit,
						},
					},
					message: "Tasks retrieved successfully",
				},
				{ status: 200 },
			);
		},
	),
];
