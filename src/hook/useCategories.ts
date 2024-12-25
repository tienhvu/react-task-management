import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "~/store/slices/categorySlice";
import { AppDispatch, RootState } from "~/store/store";

export const useCategories = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { categories } = useSelector((state: RootState) => state.category);

	const fetchCategories = (query: string) => {
		dispatch(getCategories({ query }));
	};

	return { categories, fetchCategories };
};
