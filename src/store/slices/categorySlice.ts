import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
	add,
	update,
	remove,
	CreateCategoryRequest,
	UpdateCategoryRequest,
	get,
} from "~/services/categoryApi";

import { Category } from "~/types/Category";

interface CategoryState {
	categories: Category[];
	isLoading: boolean;
	error: string | null;
}

const initialState: CategoryState = {
	categories: [],
	isLoading: false,
	error: null,
};

// Async thunks
export const addCategory = createAsyncThunk(
	"category/add",
	async (categoryData: CreateCategoryRequest, { rejectWithValue }) => {
		try {
			const response = await add(categoryData);
			return response.data;
		} catch (error: unknown) {
			const err = error as { response?: { data?: { message?: string } } };
			return rejectWithValue(
				err.response?.data?.message ?? "Add category failed",
			);
		}
	},
);

export const updateCategory = createAsyncThunk(
	"category/update",
	async (
		{
			categoryId,
			categoryData,
		}: { categoryId: string; categoryData: UpdateCategoryRequest },
		{ rejectWithValue },
	) => {
		try {
			const response = await update(categoryId, categoryData);
			return response.data;
		} catch (error: unknown) {
			const err = error as { response?: { data?: { message?: string } } };
			return rejectWithValue(
				err.response?.data?.message ?? "Update category failed",
			);
		}
	},
);

export const deleteCategory = createAsyncThunk(
	"category/delete",
	async (categoryId: string, { rejectWithValue }) => {
		try {
			await deleteCategoryApi(categoryId);
			return categoryId;
		} catch (error: unknown) {
			const err = error as { response?: { data?: { message?: string } } };
			return rejectWithValue(
				err.response?.data?.message ?? "Delete category failed",
			);
		}
	},
);

export const getCategories = createAsyncThunk(
	"category/getAll",
	async ({ query }: { query?: string }, { rejectWithValue }) => {
		try {
			const response = await get(query);
			return response.data;
		} catch (error: unknown) {
			const err = error as { response?: { data?: { message?: string } } };
			return rejectWithValue(
				err.response?.data?.message ?? "Không thể lấy danh sách danh mục",
			);
		}
	},
);

const categorySlice = createSlice({
	name: "category",
	initialState,
	reducers: {
		clearError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(addCategory.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(addCategory.fulfilled, (state) => {
				state.isLoading = false;
				state.error = null;
			})
			.addCase(addCategory.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})
			.addCase(updateCategory.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(updateCategory.fulfilled, (state) => {
				state.isLoading = false;
				state.error = null;
			})
			.addCase(updateCategory.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			.addCase(deleteCategory.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(deleteCategory.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(deleteCategory.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			.addCase(getCategories.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(getCategories.fulfilled, (state, action) => {
				state.isLoading = false;
				state.categories = action.payload;
				state.error = null;
			})
			.addCase(getCategories.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			});
	},
});

export const { clearError } = categorySlice.actions;
export default categorySlice.reducer;
