import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
	deleteUserApi,
	updateUserApi,
	UpdateUserRequest,
	UpdateUserResponse,
} from "~/services/userApi";
import { User } from "~/types/User";
import { AppDispatch } from "../store";
import { updateUserInAuth } from "./authSlice";

export interface UserState {
	user: Partial<User> | null;
	error: string | null;
	isLoading: boolean;
}

const initialState: UserState = {
	user: null,
	error: null,
	isLoading: false,
};

export const updateUser = createAsyncThunk<
	UpdateUserResponse,
	{ userId: string; userData: UpdateUserRequest },
	{ rejectValue: string; dispatch: AppDispatch }
>(
	"user/update",
	async ({ userId, userData }, { rejectWithValue, dispatch }) => {
		try {
			const response = await updateUserApi(userId, userData);
			dispatch(updateUserInAuth(response.data.user));
			return response;
		} catch (error: unknown) {
			const err = error as { response?: { data?: { message?: string } } };
			const errorMessage =
				err.response?.data?.message ?? "Cập nhật người dùng thất bại";
			return rejectWithValue(errorMessage);
		}
	},
);

export const deleteUser = createAsyncThunk<
	void,
	string,
	{ rejectValue: string }
>("user/delete", async (userId, { rejectWithValue }) => {
	try {
		await new Promise((resolve) => setTimeout(resolve, 2000));

		await deleteUserApi(userId);
	} catch (error: unknown) {
		const err = error as { response?: { data?: { message?: string } } };
		const errorMessage =
			err.response?.data?.message ?? "Xóa người dùng thất bại";
		return rejectWithValue(errorMessage);
	}
});

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		clearError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(updateUser.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(updateUser.fulfilled, (state, action) => {
				state.isLoading = false;
				state.user = action.payload.data.user;
			})
			.addCase(updateUser.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload ?? "Cập nhật người dùng thất bại";
			})

			.addCase(deleteUser.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(deleteUser.fulfilled, (state) => {
				state.isLoading = false;
				state.user = null;
			})
			.addCase(deleteUser.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload ?? "Xóa người dùng thất bại";
			});
	},
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
