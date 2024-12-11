import { AxiosResponse } from "axios";
import axiosInstance from "~/api/axiosInstance";
import { Account } from "~/types/Account";
import { RegisterUser } from "~/types/RegisterUser";
import { User } from "~/types/User";

export interface LoginResponse {
	accessToken: string;
	refreshToken: string;
	data: {
		user: User;
	};
}

export interface RegisterResponse {
	user: User;
	message: string;
	statusCode: number;
}

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
