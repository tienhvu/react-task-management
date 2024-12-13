import { AxiosResponse } from "axios";
import axiosInstance from "~/api/axiosInstance";
import {
	AuthResponse,
	ResetPasswordRequestBody,
} from "~/mocks/handlers/authHandlers";
import { Account } from "~/types/Account";
import { ErrorResponse } from "~/types/ErrorResponse";
import { RegisterUser } from "~/types/RegisterUser";
import { User } from "~/types/User";

export interface LoginResponse {
	accessToken: string;
	refreshToken: string;
	data: {
		user: User;
	};
}

export interface ResetPasswordResponse {
	message: string;
	statusCode: number;
}

export interface RegisterResponse {
	user: User;
	message: string;
	statusCode: number;
}

export type RefreshTokenRequest = {
	refreshToken: string;
	userId: string;
};

export const loginApi = (account: Account): Promise<LoginResponse> => {
	const url = "/auth/login";
	return axiosInstance.post(url, account);
};

export const logoutApi = (): Promise<AxiosResponse<void>> => {
	const url = "/auth/logout";
	return axiosInstance.post(url);
};

export const registerApi = (
	registerUser: RegisterUser,
): Promise<RegisterResponse> => {
	const url = "/auth/register";
	return axiosInstance.post(url, registerUser);
};

export const resetPasswordApi = (
	reset: ResetPasswordRequestBody,
): Promise<ResetPasswordResponse> => {
	const url = "/auth/reset-password";
	return axiosInstance.patch(url, reset);
};

export const refreshTokenApi = (
	req: RefreshTokenRequest,
): Promise<LoginResponse> => {
	const url = "/auth/refresh-token";

	return axiosInstance.post(url, req);
};
export const deleteLoginInfoApi = (
	userId: string,
): Promise<AxiosResponse<AuthResponse | ErrorResponse>> => {
	const url = `/auth/delete`;

	return axiosInstance.delete(url, {
		data: { userId },
	});
};
