/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { http, HttpResponse } from "msw";
import { baseURL } from "~/intercepter/intercepter";
import { Category } from "~/types/interface/Category";
import { ErrorResponse } from "~/types/interface/ErrorResponse";
type CreateCategoryBody = {
	name: string;
};
export const categoryHandlers = [
	// Lấy danh sách categories
	http.get(`${baseURL}/categories`, () => {
		// Trả về danh sách category
		return HttpResponse.json(
			[
				{ id: 1, name: "Personal" },
				{ id: 2, name: "Work" },
				{ id: 3, name: "Home" },
			],
			{ status: 200 },
		);
	}),

	// Thêm category
	http.post<{}, CreateCategoryBody, Category>(
		`${baseURL}/categories`,
		async ({ request }) => {
			const { name } = await request.json();
			// Thực hiện logic thêm category ở đây
			return HttpResponse.json({ id: 4, name }, { status: 201 });
		},
	),

	// Sửa category
	http.put<{ categoryId: string }, CreateCategoryBody, Category>(
		`${baseURL}/categories/:categoryId`,
		async ({ params, request }) => {
			const { categoryId } = params;
			const { name } = await request.json();
			// Thực hiện logic sửa category ở đây
			return HttpResponse.json(
				{ id: Number(categoryId), name },
				{ status: 200 },
			);
		},
	),

	// Xoá category
	http.delete<{ categoryId: string }>(
		`${baseURL}/categories/:categoryId`,
		({ params }) => {
			const { categoryId } = params;
			// Thực hiện logic xoá category ở đây
			return HttpResponse.json(null, { status: 204 });
		},
	),
];
