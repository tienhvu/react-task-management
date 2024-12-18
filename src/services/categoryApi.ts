import axiosInstance from "~/api/axiosInstance";
import { Category } from "~/types/Category";
import { Response } from "~/types/Response";

export interface CreateCategoryRequest {
	name: string;
	description?: string;
}

export interface UpdateCategoryRequest {
	name?: string;
	description?: string;
}

// Add category
export const add = (
	categoryData: CreateCategoryRequest,
): Promise<Response<Category>> => {
	const url = "/categories";
	return axiosInstance.post(url, categoryData);
};

// Update category
export const update = (
	categoryId: string,
	categoryData: UpdateCategoryRequest,
): Promise<Response<Category>> => {
	const url = `/categories/${categoryId}`;
	return axiosInstance.patch(url, categoryData);
};

// Delete category
export const deleteCategoryApi = (categoryId: string): Promise<void> => {
	const url = `/categories/${categoryId}`;
	return axiosInstance.delete(url);
};

// Search categories
export const search = (query: string): Promise<Response<Category[]>> => {
	const url = `/categories?query=${encodeURIComponent(query)}`;
	return axiosInstance.get(url);
};

export const get = (): Promise<Response<Category[]>> => {
	const url = "/categories";
	return axiosInstance.get(url);
};
