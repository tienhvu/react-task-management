import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { SearchBar } from "./component/SearchBar";
import { TaskTable } from "./component/TaskTable";
import { Pagination } from "./component/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "~/store/store";
import useDebounce from "~/hook/useDebounce";
import { getTasks, searchTasks } from "~/store/slices/taskSlice";
import { getCategories } from "~/store/slices/categorySlice";

const TaskList: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const dispatch = useDispatch<AppDispatch>();
	const debouncedSearchTerm = useDebounce(searchTerm, 500);

	const { tasks, meta } = useSelector((state: RootState) => state.task);
	const { categories } = useSelector((state: RootState) => state.category);

	const totalPages = Math.ceil(meta.total / meta.limit);

	useEffect(() => {
		dispatch(getCategories());
	}, [dispatch]);

	useEffect(() => {
		if (debouncedSearchTerm) {
			dispatch(
				searchTasks({
					query: debouncedSearchTerm,
					page: meta.page,
					limit: meta.limit,
				}),
			);
		} else {
			dispatch(getTasks({ page: meta.page, limit: meta.limit }));
		}
	}, [dispatch, debouncedSearchTerm, meta.page, meta.limit]);

	const handleSearch = (query: string) => {
		setSearchTerm(query);
		dispatch(getTasks({ page: 1, limit: meta.limit }));
	};

	const handlePageChange = (page: number) => {
		dispatch(getTasks({ page, limit: meta.limit }));
	};

	const handlePageSizeChange = (newPageSize: number) => {
		dispatch(getTasks({ page: 1, limit: newPageSize }));
	};

	return (
		<Container>
			<h1 className="my-4">Task List</h1>
			<SearchBar onSearch={handleSearch} searchType="task" />
			<>
				<TaskTable tasks={tasks} categories={categories} currentMeta={meta} />
				<Pagination
					totalPages={totalPages}
					currentPage={meta.page}
					onPageChange={handlePageChange}
					totalItems={meta.total}
					pageSize={meta.limit}
					onPageSizeChange={handlePageSizeChange}
				/>
			</>
		</Container>
	);
};

export default TaskList;
