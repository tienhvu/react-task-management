import { AxiosResponse } from "axios";
import axiosInstance from "~/api/axiosInstance";
import { User } from "~/types/User";

export interface UpdateUserResponse {
	data: {
		user: User;
	};
	message: string;
	statusCode: number;
}

export interface UpdateUserRequest {
	username?: string;
	email?: string;
	firstName?: string;
	lastName?: string;
	gender?: string;
}

export const updateUserApi = (
	userId: string,
	userData: UpdateUserRequest,
): Promise<UpdateUserResponse> => {
	const url = `/users/${userId}`;
	return axiosInstance.put(url, userData);
};

export const deleteUserApi = (userId: string): Promise<AxiosResponse<null>> => {
	const url = `/users/${userId}`;
	return axiosInstance.delete(url);
};
