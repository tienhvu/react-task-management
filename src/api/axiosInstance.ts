import axios from "axios";

export const baseURL = "https://www.task-manager.api.mvn-training.com";

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
			console.error("Token hết hạn hoặc không hợp lệ");
			localStorage.removeItem("auth");
		}
		return Promise.reject(error);
	},
);

export default axiosInstance;
