/* eslint-disable @typescript-eslint/no-empty-object-type */
import { http, HttpResponse } from "msw";
import { baseURL } from "~/interceptor/Interceptor";
import { Category } from "~/types/interface/Category";
import { ErrorResponse } from "~/types/interface/ErrorResponse";
import { PaginatedResponse } from "~/types/interface/PaginatedResponse";

const categories: Category[] = JSON.parse(
	localStorage.getItem("categories") || "[]",
);

function updateCategoryLocalStorage() {
	localStorage.setItem("categories", JSON.stringify(categories));
}

function generateCategoryId(): string {
	return `user_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

export const categoryHandlers = [
	http.get<{}, PaginatedResponse<Category> | ErrorResponse>(
		`${baseURL}/categories`,
		async ({ request }) => {
			const url = new URL(request.url);
			const page = parseInt(url.searchParams.get("page") || "1", 10);
			const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);

			const startIndex = (page - 1) * pageSize;
			const endIndex = startIndex + pageSize;

			const paginatedCategories = categories.slice(startIndex, endIndex);

			const paginatedResponse: PaginatedResponse<Category> = {
				data: paginatedCategories,
				meta: {
					page,
					pageSize,
					totalPages: Math.ceil(categories.length / pageSize),
					totalItems: categories.length,
				},
			};

			return HttpResponse.json(paginatedResponse, { status: 200 });
		},
	),

	// Get category by ID
	http.get<{ categoryId: string }, Category | ErrorResponse>(
		`${baseURL}/categories/:categoryId`,
		async ({ params }) => {
			const { categoryId } = params;
			const category = categories.find((cat) => cat.id === categoryId);

			if (!category) {
				return HttpResponse.json(
					{
						message: "Category not found",
						statusCode: 404,
					},
					{ status: 404 },
				);
			}

			return HttpResponse.json(category, { status: 200 });
		},
	),

	// Create category
	http.post<{}, Omit<Category, "id">, Category | ErrorResponse>(
		`${baseURL}/categories`,
		async ({ request }) => {
			const categoryReq = await request.json();

			const existingCategory = categories.find(
				(category) => category.name === categoryReq.name,
			);
			if (existingCategory) {
				return HttpResponse.json(
					{
						message: "Category with this name already exists",
						statusCode: 409,
					},
					{ status: 409 },
				);
			}

			const newCategory: Category = {
				id: generateCategoryId(),
				name: categoryReq.name,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			categories.push(newCategory);
			updateCategoryLocalStorage();

			return HttpResponse.json(newCategory, { status: 201 });
		},
	),

	// Update category
	http.patch<
		{ categoryId: string },
		Partial<Category>,
		Category | ErrorResponse
	>(`${baseURL}/categories/:categoryId`, async ({ params, request }) => {
		const { categoryId } = params;
		const categoryUpdate = await request.json();

		const category = categories.find((cat) => cat.id === categoryId);
		if (!category) {
			return HttpResponse.json(
				{
					message: "Category not found",
					statusCode: 404,
				},
				{ status: 404 },
			);
		}

		category.name = categoryUpdate.name || category.name;
		category.updatedAt = new Date();
		updateCategoryLocalStorage();

		return HttpResponse.json(category, { status: 200 });
	}),

	// Delete category
	http.delete<{ categoryId: string }, {}, ErrorResponse | null>(
		`${baseURL}/categories/:categoryId`,
		({ params }) => {
			const { categoryId } = params;

			const categoryIndex = categories.findIndex(
				(cat) => cat.id === categoryId,
			);
			if (categoryIndex === -1) {
				return HttpResponse.json(
					{
						message: "Category not found",
						statusCode: 404,
					},
					{ status: 404 },
				);
			}

			categories.splice(categoryIndex, 1);
			updateCategoryLocalStorage();

			return HttpResponse.json(null, { status: 204 });
		},
	),
];
