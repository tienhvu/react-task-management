import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
	loginApi,
	LoginResponse,
	logoutApi,
	registerApi,
	RegisterResponse,
} from "~/services/authApi";
import { Account } from "~/types/interface/Account";
import { AuthState } from "~/types/interface/AuthState";
import { RegisterUser } from "~/types/interface/RegisterUser";

const initialState: AuthState = {
	user: null,
	accessToken: null,
	refreshToken: null,
	error: null,
	loading: false,
};

export const login = createAsyncThunk<
	LoginResponse,
	Account,
	{ rejectValue: string }
>("auth/login", async (account: Account, { rejectWithValue }) => {
	try {
		await new Promise((resolve) => setTimeout(resolve, 2000));
		const response = await loginApi(account);
		return response;
	} catch (error: unknown) {
		const err = error as { response?: { data?: { message?: string } } };
		const errorMessage =
			err.response?.data?.message || "An unknown error occurred";
		return rejectWithValue(errorMessage);
	}
});

export const register = createAsyncThunk<
	RegisterResponse,
	RegisterUser,
	{ rejectValue: string }
>("auth/register", async (userData: RegisterUser, { rejectWithValue }) => {
	try {
		await new Promise((resolve) => setTimeout(resolve, 2000));
		const response = await registerApi(userData);
		return response;
	} catch (error: unknown) {
		const err = error as { response?: { data?: { message?: string } } };
		const errorMessage = err.response?.data?.message || "Đăng ký thất bại";
		return rejectWithValue(errorMessage);
	}
});
export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
	"auth/logout",
	async (_, { rejectWithValue }) => {
		try {
			await logoutApi();
			localStorage.removeItem("auth");
		} catch (error: unknown) {
			const err = error as { response?: { data?: { message?: string } } };
			const errorMessage =
				err.response?.data?.message || "Logout failed, please try again.";
			return rejectWithValue(errorMessage);
		}
	},
);

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setAuthData: (state, action) => {
			const { accessToken, refreshToken, data } = action.payload;
			state.accessToken = accessToken;
			state.refreshToken = refreshToken;
			state.user = data.user;

			const user = data.user;
			localStorage.setItem(
				"auth",
				JSON.stringify({
					accessToken,
					refreshToken,
					user,
				}),
			);
		},
		checkAuth: (state) => {
			const storedAuth = localStorage.getItem("auth");
			if (storedAuth) {
				const authData = JSON.parse(storedAuth);
				state.accessToken = authData.accessToken;
				state.refreshToken = authData.refreshToken;
				state.user = authData.user;
			}
		},
		clearError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// Handling login state
			.addCase(login.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(login.fulfilled, (state, action) => {
				const { accessToken, refreshToken, data } = action.payload;
				state.accessToken = accessToken;
				state.refreshToken = refreshToken;
				state.user = data.user;
				state.loading = false;
				localStorage.setItem(
					"auth",
					JSON.stringify({
						accessToken,
						refreshToken,
						user: data.user,
					}),
				);
			})
			.addCase(login.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || "Đăng nhập thất bại";
				state.accessToken = null;
				state.refreshToken = null;
				state.user = null;
			})

			// Handling register state
			.addCase(register.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(register.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload.user;
			})
			.addCase(register.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})

			// Handling logout state
			.addCase(logout.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(logout.fulfilled, (state) => {
				state.loading = false;
				state.accessToken = null;
				state.refreshToken = null;
				state.user = null;
			})
			.addCase(logout.rejected, (state, action) => {
				state.loading = false;
				state.error =
					action.payload || "An unknown error occurred during logout.";
			});
	},
});

export const { setAuthData, checkAuth, clearError } = authSlice.actions;
export default authSlice.reducer;
