import { AxiosResponse } from "axios";
import axiosInstance from "~/api/axiosInstance";
import { Account } from "~/types/interface/Account";
import { RegisterUser } from "~/types/interface/RegisterUser";
import { User } from "~/types/interface/User";

export interface LoginResponse {
	accessToken: string;
	refreshToken: string;
	user: User;
	message: string;
	statusCode: number;
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

export const logoutApi = (): Promise<AxiosResponse<unknown>> => {
	const url = "/auth/logout";
	return axiosInstance.post(url);
};

export const registerApi = (
	registerUser: RegisterUser,
): Promise<RegisterResponse> => {
	const url = "/auth/register";
	return axiosInstance.post(url, registerUser);
};
