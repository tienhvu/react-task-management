import axios from "axios";
import { baseURL } from "~/intercepter/Intercepter";
import { Account } from "~/types/interface/Account";
import { RegisterUser } from "~/types/interface/RegisterUser";

const authApi = {
	postLogin: (account: Account) => {
		const url = `${baseURL}/auth/login`;
		return axios.post(url, account);
	},
	postLogout: () => {
		const url = `${baseURL}/auth/logout`;
		return axios.post(url);
	},
	postRegister: (registerUser: RegisterUser) => {
		const url = `${baseURL}/auth/register`;
		return axios.post(url, registerUser);
	},
};

export default authApi;
