import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
	addCategoryApi,
	updateCategoryApi,
	deleteCategoryApi,
	searchCategoriesApi,
	CreateCategoryRequest,
	UpdateCategoryRequest,
	getCategoriesApi,
} from "~/services/categoryApi";

import { Category } from "~/types/Category";

interface CategoryState {
	categories: Category[];
	selectedCategory: Category | null;
	isLoading: boolean;
	error: string | null;
}

const initialState: CategoryState = {
	categories: [],
	selectedCategory: null,
	isLoading: false,
	error: null,
};

// Async thunks
export const addCategory = createAsyncThunk(
	"category/add",
	async (categoryData: CreateCategoryRequest, { rejectWithValue }) => {
		try {
			const response = await addCategoryApi(categoryData);
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
			const response = await updateCategoryApi(categoryId, categoryData);
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

export const searchCategories = createAsyncThunk(
	"category/search",
	async (query: string, { rejectWithValue }) => {
		try {
			const response = await searchCategoriesApi(query);
			return response.data;
		} catch (error: unknown) {
			const err = error as { response?: { data?: { message?: string } } };
			return rejectWithValue(
				err.response?.data?.message ?? "Search categories failed",
			);
		}
	},
);

export const getCategories = createAsyncThunk(
	"category/getAll",
	async (_, { rejectWithValue }) => {
		try {
			const response = await getCategoriesApi();
			return response.data;
		} catch (error: unknown) {
			const err = error as { response?: { data?: { message?: string } } };
			return rejectWithValue(
				err.response?.data?.message ?? "Get categories failed",
			);
		}
	},
);

const categorySlice = createSlice({
	name: "category",
	initialState,
	reducers: {
		selectCategory: (state, action) => {
			state.selectedCategory = action.payload;
		},
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
			.addCase(addCategory.fulfilled, (state, action) => {
				state.isLoading = false;
				state.categories.push(action.payload);
			})
			.addCase(addCategory.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})
			.addCase(updateCategory.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(updateCategory.fulfilled, (state, action) => {
				state.isLoading = false;
				const index = state.categories.findIndex(
					(category) => category.id === action.payload.id,
				);
				if (index !== -1) {
					state.categories[index] = action.payload;
				}
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

			.addCase(searchCategories.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(searchCategories.fulfilled, (state, action) => {
				state.isLoading = false;
				state.categories = action.payload;
			})
			.addCase(searchCategories.rejected, (state, action) => {
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
			})
			.addCase(getCategories.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			});
	},
});

export const { selectCategory, clearError } = categorySlice.actions;
export default categorySlice.reducer;
