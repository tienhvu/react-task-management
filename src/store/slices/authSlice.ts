// authSlice.ts

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authApi from "~/api/authApi";
import { Account } from "~/types/interface/Account";

interface User {
	id: number;
	username: string;
	email: string;
	firstName: string;
	lastName: string;
	gender: string;
	image: string;
}

interface AuthState {
	user: User | null;
	accessToken: string | null;
	refreshToken: string | null;
	error: string | null;
	loading: boolean;
}

const initialState: AuthState = {
	user: null,
	accessToken: null,
	refreshToken: null,
	error: null,
	loading: false,
};

export const login = createAsyncThunk<
	{ token: string; refreshToken: string; tokenExpires: number; user: User },
	Account,
	{ rejectValue: string }
>("auth/login", async (account: Account, { rejectWithValue }) => {
	try {
		const response = await authApi.postLogin(account);
		return response.data;
	} catch (error: unknown) {
		if (error instanceof Error) {
			return rejectWithValue(error.message || "Đăng nhập thất bại");
		}
		return rejectWithValue("Đăng nhập thất bại");
	}
});

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
	},
	extraReducers: (builder) => {
		builder
			.addCase(login.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(login.fulfilled, (state, action) => {
				const { token, refreshToken, user } = action.payload;
				state.accessToken = token;
				state.refreshToken = refreshToken;
				state.user = user;
				state.loading = false;

				localStorage.setItem(
					"auth",
					JSON.stringify({
						accessToken: token,
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
			});
	},
});

export const { setAuthData, logout, checkAuth } = authSlice.actions;
export default authSlice.reducer;
