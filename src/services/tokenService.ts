import { store } from "~/store/store";

export const getAuthToken = () => {
	const state = store.getState();
	return state.auth.accessToken;
};
