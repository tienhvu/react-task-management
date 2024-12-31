import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { getTasks } from "~/store/slices/taskSlice";
import { AppDispatch } from "~/store/store";

export const useTasks = () => {
	const dispatch = useDispatch<AppDispatch>();
	const [searchParams] = useSearchParams();

	const fetchTasks = useCallback(() => {
		const query = searchParams.get("query") ?? "";

		const page = Number(searchParams.get("page")) || 1;
		const limit = Number(searchParams.get("limit")) || 10;

		dispatch(getTasks({ page, limit, query }));
	}, [dispatch, searchParams]);

	return { fetchTasks };
};
