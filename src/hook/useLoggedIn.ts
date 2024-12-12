import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "~/store/slices/authSlice";
import { RootState } from "~/store/store";

const useLoggedIn = () => {
	return useSelector((state: RootState) => selectIsAuthenticated(state));
};

export default useLoggedIn;
