import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authApi from "~/api/authApi";
import { Account } from "~/types/interface/Account";
import { AuthState } from "~/types/interface/AuthState";
import { RegisterUser } from "~/types/interface/RegisterUser";
import { User } from "~/types/interface/User";

const initialState: AuthState = {
	user: null,
	accessToken: null,
	refreshToken: null,
	error: null,
	loading: false,
};

export const login = createAsyncThunk<
	{
		accessToken: string;
		refreshToken: string;
		tokenExpires: number;
		user: User;
	},
	Account,
	{ rejectValue: string }
>("auth/login", async (account: Account, { rejectWithValue }) => {
	try {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		const response = await authApi.postLogin(account);
		console.log(response.data);
		return response.data;
	} catch (error: unknown) {
		const err = error as { response?: { data?: { message?: string } } };
		const errorMessage =
			err.response?.data?.message || "An unknown error occurred";
		return rejectWithValue(errorMessage);
	}
});

export const register = createAsyncThunk(
	"auth/register",
	async (userData: RegisterUser, { rejectWithValue }) => {
		try {
			const response = await authApi.postRegister(userData);
			return response.data;
		} catch (error: unknown) {
			const err = error as { response?: { data?: { message?: string } } };
			const errorMessage = err.response?.data?.message || "Đăng ký thất bại";
			return rejectWithValue(errorMessage);
		}
	},
);

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		logout: (state) => {
			state.accessToken = null;
			state.refreshToken = null;
			state.user = null;
			localStorage.removeItem("auth");
		},
		setAuthData: (state, action) => {
			const { accessToken, refreshToken, user } = action.payload;
			state.accessToken = accessToken;
			state.refreshToken = refreshToken;
			state.user = user;

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
			.addCase(login.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(login.fulfilled, (state, action) => {
				const { accessToken, refreshToken, user } = action.payload;
				state.accessToken = accessToken;
				state.refreshToken = refreshToken;
				state.user = user;
				state.loading = false;

				localStorage.setItem(
					"auth",
					JSON.stringify({
						accessToken: accessToken,
						refreshToken,
						user,
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

			.addCase(register.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(register.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload;
			})
			.addCase(register.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
	},
});

export const { setAuthData, logout, checkAuth } = authSlice.actions;
export default authSlice.reducer;
