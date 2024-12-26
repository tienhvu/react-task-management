import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { getCategories } from "~/store/slices/categorySlice";
import { AppDispatch } from "~/store/store";
import { useCallback } from "react";

export const useCategories = () => {
	const dispatch = useDispatch<AppDispatch>();
	const [searchParams] = useSearchParams();
	const fetchCategories = useCallback(() => {
		const query = searchParams.get("query") ?? "";
		dispatch(getCategories({ query }));
	}, [dispatch, searchParams]);

	return { fetchCategories };
};
