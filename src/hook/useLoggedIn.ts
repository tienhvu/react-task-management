import { useSelector } from "react-redux";
import { RootState } from "~/store/store";

const useLoggedIn = () => {
	return useSelector(
		(state: RootState) => !!state.auth.user && !!state.auth.accessToken,
	);
};

export default useLoggedIn;
