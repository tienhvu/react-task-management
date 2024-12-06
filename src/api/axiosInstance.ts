import axios, { AxiosResponse } from "axios";

export const baseURL = "https://www.task-manager.api.mvn-training.com";

const axiosInstance = axios.create({
	baseURL: baseURL,
	headers: {
		"Content-Type": "application/json",
	},
});

axiosInstance.interceptors.request.use(
	async (config) => {
		const authDataString = localStorage.getItem("auth");
		const authData = authDataString ? JSON.parse(authDataString) : null;
		const token = authData?.accessToken;
		config.headers["Authorization"] = `Bearer ${token}`;
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

axiosInstance.interceptors.response.use(
	(response: AxiosResponse) => response.data,
	(error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 404) {
			console.error("This token is invalidated");

			localStorage.removeItem("auth");

			const redirectUrl = "/auth/login";
			window.location.href = redirectUrl;
		}
		return Promise.reject(error);
	},
);

export default axiosInstance;
