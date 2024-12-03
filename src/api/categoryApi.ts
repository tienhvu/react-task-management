import axios from "axios";
import { baseURL } from "~/interceptor/Interceptor";
import { Category } from "~/types/interface/Category";

interface PaginatedParams {
	page?: number;
	pageSize?: number;
}

const categoryApi = {
	getAll: (params?: PaginatedParams) => {
		const url = `${baseURL}/categories`;
		return axios.get(url, { params });
	},

	getById: (categoryId: string) => {
		const url = `${baseURL}/categories/${categoryId}`;
		return axios.get(url);
	},

	createCategory: (createCategory: Omit<Category, "id">) => {
		const url = `${baseURL}/categories`;
		return axios.post(url, createCategory);
	},

	updateCategory: (categoryId: string, updateData: Partial<Category>) => {
		const url = `${baseURL}/categories/${categoryId}`;
		return axios.patch(url, updateData);
	},

	deleteCategory: (categoryId: string) => {
		const url = `${baseURL}/categories/${categoryId}`;
		return axios.delete(url);
	},
};

export default categoryApi;
