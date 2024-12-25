import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "~/store/slices/categorySlice";
import { AppDispatch, RootState } from "~/store/store";

export const useCategories = (query: string) => {
	const dispatch = useDispatch<AppDispatch>();
	const { categories } = useSelector((state: RootState) => state.category);

	useEffect(() => {
		dispatch(getCategories({ query }));
	}, [query, dispatch]);

	return { categories };
};
