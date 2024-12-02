/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { http, HttpResponse } from "msw";
import { baseURL } from "~/intercepter/intercepter";
import { ErrorResponse } from "~/types/interface/ErrorResponse";
import { Task } from "~/types/interface/Task";

type CreateTaskBody = {
	title: string;
	categoryId: number;
	status: "pending" | "completed";
};

export const taskHandlers = [
	// Lấy danh sách tasks
	http.get(`${baseURL}/tasks`, () => {
		// Trả về danh sách task với phân trang
		return HttpResponse.json(
			{
				data: [
					{
						id: 1,
						title: "Task 1",
						category: { id: 1, name: "Personal" },
						status: "pending",
						createdAt: "2023-05-01T00:00:00.000Z",
						completedAt: null,
					},
					{
						id: 2,
						title: "Task 2",
						category: { id: 2, name: "Work" },
						status: "completed",
						createdAt: "2023-05-02T00:00:00.000Z",
						completedAt: "2023-05-05T00:00:00.000Z",
					},
				],
				meta: {
					currentPage: 1,
					itemsPerPage: 10,
					totalItems: 20,
					totalPages: 2,
				},
			},
			{ status: 200 },
		);
	}),

	// Thêm task
	http.post<{}, CreateTaskBody, Task>(
		`${baseURL}/tasks`,
		async ({ request }) => {
			const { title, categoryId, status } = await request.json();
			// Thực hiện logic thêm task ở đây
			return HttpResponse.json(
				{
					id: 3,
					title,
					category: { id: categoryId, name: "Personal" },
					status,
					createdAt: "2023-05-03T00:00:00.000Z",
					completedAt: null,
				},
				{ status: 201 },
			);
		},
	),

	// Sửa task
	http.put<{ taskId: string }, CreateTaskBody, Task>(
		`${baseURL}/tasks/:taskId`,
		async ({ params, request }) => {
			const { taskId } = params;
			const { title, categoryId, status } = await request.json();
			// Thực hiện logic sửa task ở đây
			return HttpResponse.json(
				{
					id: Number(taskId),
					title,
					category: { id: categoryId, name: "Personal" },
					status,
					createdAt: "2023-05-03T00:00:00.000Z",
					completedAt: null,
				},
				{ status: 200 },
			);
		},
	),

	// Xoá task
	http.delete<{ taskId: string }>(`${baseURL}/tasks/:taskId`, ({ params }) => {
		const { taskId } = params;
		return HttpResponse.json(null, { status: 204 });
	}),
];
