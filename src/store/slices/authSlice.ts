import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ResetPasswordRequestBody } from "~/mocks/handlers/authHandlers";
import {
	loginApi,
	LoginResponse,
	logoutApi,
	refreshTokenApi,
	RefreshTokenRequest,
	registerApi,
	RegisterResponse,
	resetPasswordApi,
	ResetPasswordResponse,
} from "~/services/authApi";
import {
	updateUserApi,
	UpdateUserRequest,
	UpdateUserResponse,
} from "~/services/userApi";
import { Account } from "~/types/Account";
import { AuthState } from "~/types/AuthState";
import { ErrorResponse } from "~/types/ErrorResponse";
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

export const updateUser = createAsyncThunk<
	UpdateUserResponse,
	{ userId: string; userData: UpdateUserRequest },
	{ rejectValue: string }
>("auth/updateUser", async ({ userId, userData }, { rejectWithValue }) => {
	try {
		const response = await updateUserApi(userId, userData);
		return response;
	} catch (error: unknown) {
		const err = error as { response?: { data?: { message?: string } } };
		return rejectWithValue(err.response?.data?.message ?? "Update failed");
	}
});

export const resetPassword = createAsyncThunk<
	ResetPasswordResponse,
	ResetPasswordRequestBody,
	{ rejectValue: string }
>(
	"auth/resetPassword",
	async ({ userId, oldPassword, newPassword }, { rejectWithValue }) => {
		try {
			const response = await resetPasswordApi({
				userId,
				oldPassword,
				newPassword,
			});
			return response;
		} catch (error: unknown) {
			const err = error as { response?: { data?: ErrorResponse } };
			return rejectWithValue(
				err.response?.data?.message ?? "Reset password failed",
			);
		}
	},
);

export const refreshToken = createAsyncThunk<
	LoginResponse,
	RefreshTokenRequest,
	{ rejectValue: string }
>(
	"auth/refreshToken",
	async (req: RefreshTokenRequest, { rejectWithValue }) => {
		try {
			const response = await refreshTokenApi(req);
			return response;
		} catch (error: unknown) {
			const err = error as { response?: { data?: { message?: string } } };
			return rejectWithValue(
				err.response?.data?.message ?? "Refresh token failed",
			);
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
		resetAuthState: (state) => {
			state.user = null;
			state.accessToken = null;
			state.refreshToken = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// Login
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
    
			// Register
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
    
			// Update User
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
				state.error = action.payload ?? "Update user failed";
			})

			// Reset Password
			.addCase(resetPassword.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(resetPassword.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(resetPassword.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload ?? "Reset password failed";
			})

			// Refresh Token
			.addCase(refreshToken.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(refreshToken.fulfilled, (state, action) => {
				const { accessToken, refreshToken, data } = action.payload;
				state.accessToken = accessToken;
				state.refreshToken = refreshToken;
				if (data?.user) {
					state.user = data.user;
				}
				state.isLoading = false;
			})
			.addCase(refreshToken.rejected, (state, action) => {
				state.isLoading = false;
				state.accessToken = null;
				state.refreshToken = null;
				state.user = null;
				state.error = action.payload ?? "Refresh token failed";
			})

			// Logout
			.addCase(logout.fulfilled, (state) => {
				state.accessToken = null;
				state.refreshToken = null;
				state.user = null;
				state.error = null;
			});
	},
});

export const { clearError, resetAuthState } = authSlice.actions;
export default authSlice.reducer;
