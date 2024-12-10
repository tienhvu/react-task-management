import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
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
import { User } from "~/types/interface/User";

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
>("auth/login", async (account, { rejectWithValue }) => {
	try {
		const response = await loginApi(account);
		return response;
	} catch (error: unknown) {
		const err = error as { response?: { data?: { message?: string } } };
		return rejectWithValue(err.response?.data?.message || "Login failed");
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
		return rejectWithValue(err.response?.data?.message || "Register failed");
	}
});

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
	"auth/logout",
	async (_, { rejectWithValue }) => {
		try {
			await logoutApi();
		} catch (error: unknown) {
			const err = error as { response?: { data?: { message?: string } } };
			return rejectWithValue(err.response?.data?.message || "Logout failed");
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
		updateUserInAuth: (state, action: PayloadAction<User>) => {
			state.user = { ...state.user, ...action.payload };
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(login.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				login.fulfilled,
				(state, action: PayloadAction<LoginResponse>) => {
					const { accessToken, refreshToken, data } = action.payload;
					state.accessToken = accessToken;
					state.refreshToken = refreshToken;
					state.user = data.user;
					state.loading = false;
				},
			)
			.addCase(login.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || "Login failed";
				state.accessToken = null;
				state.refreshToken = null;
				state.user = null;
			})
			.addCase(register.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(register.fulfilled, (state) => {
				state.loading = false;
			})
			.addCase(register.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || "Register failed";
			})
			.addCase(logout.fulfilled, (state) => {
				state.accessToken = null;
				state.refreshToken = null;
				state.user = null;
				state.error = null;
				localStorage.removeItem("auth");
			});
	},
});

export const { clearError, updateUserInAuth } = authSlice.actions;
export default authSlice.reducer;
