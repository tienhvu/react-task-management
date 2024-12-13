import axiosInstance from "~/api/axiosInstance";
import { Category } from "~/types/Category";

export interface CreateCategoryRequest {
	name: string;
	description?: string;
}

export interface UpdateCategoryRequest {
	name?: string;
	description?: string;
}

export interface CategoryResponse {
	data: Category;
	message: string;
}

export interface SearchCategoryResponse {
	data: Category[];
	message: string;
}

// Add category
export const addCategoryApi = (
	categoryData: CreateCategoryRequest,
): Promise<CategoryResponse> => {
	const url = "/categories";
	return axiosInstance.post(url, categoryData);
};

// Update category
export const updateCategoryApi = (
	categoryId: string,
	categoryData: UpdateCategoryRequest,
): Promise<CategoryResponse> => {
	const url = `/categories/${categoryId}`;
	return axiosInstance.patch(url, categoryData);
};

// Delete category
export const deleteCategoryApi = (categoryId: string): Promise<void> => {
	const url = `/categories/${categoryId}`;
	return axiosInstance.delete(url);
};

// Search categories
export const searchCategoriesApi = (
	query: string,
): Promise<SearchCategoryResponse> => {
	const url = `/categories?query=${encodeURIComponent(query)}`;
	return axiosInstance.get(url);
};

export const getCategoriesApi = (): Promise<SearchCategoryResponse> => {
	const url = "/categories";
	return axiosInstance.get(url);
};
