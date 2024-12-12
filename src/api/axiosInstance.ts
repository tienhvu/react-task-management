import { UnknownAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Dispatch } from "react";
import { resetAuthState } from "~/store/slices/authSlice";

export const baseURL = "https://www.task-manager.api.mvn-training.com";

let dispatchFunction: Dispatch<UnknownAction> | null = null;

export const injectDispatch = (dispatch: Dispatch<UnknownAction>) => {
	dispatchFunction = dispatch;
};

const axiosInstance = axios.create({
	baseURL: baseURL,
	headers: {
		"Content-Type": "application/json",
	},
});

axiosInstance.interceptors.request.use(
	(config) => {
		const token = JSON.parse(localStorage.getItem("auth") ?? "{}")?.accessToken;
		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

axiosInstance.interceptors.response.use(
	(response) => {
		if (response.data) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { headers, ...responseData } = response.data;
			return responseData;
		}
		return response;
	},
	(error) => {
		if (error.response?.status === 401) {
			if (dispatchFunction) {
				dispatchFunction(resetAuthState());
			}
		}
		return Promise.reject(error);
	},
);

export default axiosInstance;
