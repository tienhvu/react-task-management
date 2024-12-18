import axios from "axios";
import { resetAuthState } from "~/store/slices/authSlice";
import { getInjectedDispatch } from "~/utils/injectDispatch";
export const baseURL = "https://www.task-manager.api.mvn-training.com";
const dispatch = getInjectedDispatch();
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
			if (dispatch) {
				dispatch(resetAuthState());
			}
		}
		return Promise.reject(error);
	},
);

export default axiosInstance;
