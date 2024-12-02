import axios from "axios";
import { Account } from "~/types/interface/Account";

const baseURL = "https://www.task-manager.api.mvn-training.com";

const authApi = {
	postLogin: (account: Account) => {
		const url = `${baseURL}/auth/login`;
		return axios.post(url, account);
	},
	postLogout: () => {
		const url = `${baseURL}/auth/logout`;
		return axios.post(url);
	},
};

export default authApi;
