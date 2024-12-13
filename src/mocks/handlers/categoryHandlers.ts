/* eslint-disable @typescript-eslint/no-empty-object-type */
import { http, HttpResponse } from "msw";
import { baseURL } from "~/api/axiosInstance";
import { ErrorResponse } from "~/types/ErrorResponse";
import { v4 as uuidv4 } from "uuid";
import { Category } from "~/types/Category";

type CreateCategoryRequest = {
	name: string;
	description?: string;
};

type UpdateCategoryRequest = {
	name?: string;
	description?: string;
};

type CategoryResponse = {
	data: Category;
	message: string;
};

type SearchCategoryResponse = {
	data: Category[];
	message: string;
};

const categories: Category[] = JSON.parse(
	localStorage.getItem("categories") || "[]",
);

function updateCategoryStorage() {
	localStorage.setItem("categories", JSON.stringify(categories));
}

export const categoryHandlers = [
	// Add category
	http.post<{}, CreateCategoryRequest, CategoryResponse | ErrorResponse>(
		`${baseURL}/categories`,
		async ({ request }) => {
			const newCategory = await request.json();

			await new Promise((resolve) => setTimeout(resolve, 2000));

			if (!newCategory.name || newCategory.name.trim() === "") {
				return HttpResponse.json(
					{ message: "Category name is required", statusCode: 400 },
					{ status: 400 },
				);
			}

			if (categories.some((category) => category.name === newCategory.name)) {
				return HttpResponse.json(
					{ message: "Category name already exists", statusCode: 409 },
					{ status: 409 },
				);
			}

			const category: Category = {
				id: uuidv4(),
				name: newCategory.name,
				description: newCategory.description || "",
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			categories.push(category);
			updateCategoryStorage();

			return HttpResponse.json(
				{ data: category, message: "Category added successfully" },
				{ status: 201 },
			);
		},
	),

	// Update category
	http.patch<
		{ categoryId: string },
		UpdateCategoryRequest,
		CategoryResponse | ErrorResponse
	>(`${baseURL}/categories/:categoryId`, async ({ params, request }) => {
		const { categoryId } = params;
		const categoryUpdate = await request.json();

		await new Promise((resolve) => setTimeout(resolve, 2000));

		const existingCategory = categories.find(
			(category) => category.id === categoryId,
		);
		if (!existingCategory) {
			return HttpResponse.json(
				{ message: "Category not found", statusCode: 404 },
				{ status: 404 },
			);
		}

		if (
			categoryUpdate.name &&
			categories.some(
				(category) =>
					category.name === categoryUpdate.name && category.id !== categoryId,
			)
		) {
			return HttpResponse.json(
				{ message: "Category name already exists", statusCode: 409 },
				{ status: 409 },
			);
		}

		existingCategory.name = categoryUpdate.name ?? existingCategory.name;
		existingCategory.description =
			categoryUpdate.description ?? existingCategory.description;
		existingCategory.updatedAt = new Date();

		updateCategoryStorage();

		return HttpResponse.json(
			{ data: existingCategory, message: "Category updated successfully" },
			{ status: 200 },
		);
	}),

	// Delete category
	http.delete<{ categoryId: string }, {}, ErrorResponse | null>(
		`${baseURL}/categories/:categoryId`,
		async ({ params }) => {
			const { categoryId } = params;
			const categoryIndex = categories.findIndex(
				(category) => category.id === categoryId,
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
			updateCategoryStorage();

			return HttpResponse.json(undefined, { status: 204 });
		},
	),

	// Get categories (with optional search query)
	http.get<{}, {}, SearchCategoryResponse>(
		`${baseURL}/categories`,
		async ({ request }) => {
			const urlObj = new URL(request.url);
			const query = urlObj.searchParams.get("query")?.toLowerCase();

			const filteredCategories = query
				? categories.filter((category) =>
						category.name.toLowerCase().includes(query),
					)
				: categories;

			return HttpResponse.json(
				{
					data: filteredCategories,
					message: "Categories retrieved successfully",
				},
				{ status: 200 },
			);
		},
	),
];
