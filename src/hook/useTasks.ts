import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { getTasks } from "~/store/slices/taskSlice";
import { AppDispatch, RootState } from "~/store/store";

export const useTasks = () => {
	const dispatch = useDispatch<AppDispatch>();
	const [searchParams] = useSearchParams();
	const { meta } = useSelector((state: RootState) => state.task);

	const fetchTasks = useCallback(() => {
		const query = searchParams.get("query") ?? "";
		dispatch(getTasks({ page: meta.page, limit: meta.limit, query }));
	}, [dispatch, meta.limit, meta.page, searchParams]);

	return { fetchTasks };
};
