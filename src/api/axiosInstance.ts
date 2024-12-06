import axios from "axios";

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

		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
		} else {
			delete config.headers["Authorization"];
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

axiosInstance.interceptors.response.use(
	(response) => response.data,
	(error) => {
		if (error.response?.status === 401) {
			console.error("Token hết hạn hoặc không hợp lệ");
			localStorage.removeItem("auth");
			window.location.href = "/login";
		}
		return Promise.reject(error);
	},
);

export default axiosInstance;
