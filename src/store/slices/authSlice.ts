import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
	loginApi,
	LoginResponse,
	logoutApi,
	registerApi,
	RegisterResponse,
} from "~/services/authApi";
import { Account } from "~/types/Account";
import { AuthState } from "~/types/AuthState";
import { RegisterUser } from "~/types/RegisterUser";

const initialState: AuthState = {
	user: null,
	accessToken: null,
	refreshToken: null,
	error: null,
	isLoading: false,
};

export const login = createAsyncThunk<
	LoginResponse,
	Account,
	{ rejectValue: string }
>("auth/login", async (account, { rejectWithValue }) => {
	try {
		const response = await loginApi(account);
		return response;
	} catch (error: unknown) {
		const err = error as { response?: { data?: { message?: string } } };
		return rejectWithValue(err.response?.data?.message ?? "Login failed");
	}
});

export const register = createAsyncThunk<
	RegisterResponse,
	RegisterUser,
	{ rejectValue: string }
>("auth/register", async (userData, { rejectWithValue }) => {
	try {
		const response = await registerApi(userData);
		return response;
	} catch (error: unknown) {
		const err = error as { response?: { data?: { message?: string } } };
		return rejectWithValue(err.response?.data?.message ?? "Register failed");
	}
});

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
	"auth/logout",
	async (_, { rejectWithValue }) => {
		try {
			await logoutApi();
		} catch (error: unknown) {
			const err = error as { response?: { data?: { message?: string } } };
			return rejectWithValue(err.response?.data?.message ?? "Logout failed");
		}
	},
);

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		clearError: (state) => {
			state.error = null;
		},
		updateUserInAuth: (state, action) => {
			state.user = { ...state.user, ...action.payload };
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(login.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(login.fulfilled, (state, action) => {
				const { accessToken, refreshToken, data } = action.payload;
				state.accessToken = accessToken;
				state.refreshToken = refreshToken;
				state.user = data.user;
				state.isLoading = false;
			})
			.addCase(login.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload ?? "Login failed";
				state.accessToken = null;
				state.refreshToken = null;
				state.user = null;
			})
			.addCase(register.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(register.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(register.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload ?? "Register failed";
			})
			.addCase(logout.fulfilled, (state) => {
				state.accessToken = null;
				state.refreshToken = null;
				state.user = null;
				state.error = null;
			});
	},
});
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
	!!state.auth.user && !!state.auth.accessToken;
export const { clearError, updateUserInAuth } = authSlice.actions;
export default authSlice.reducer;
