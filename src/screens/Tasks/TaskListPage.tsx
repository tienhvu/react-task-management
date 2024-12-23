import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "~/store/slices/categorySlice";
import { getTasks, searchTasks } from "~/store/slices/taskSlice";
import { AppDispatch, RootState } from "~/store/store";
import { Pagination } from "./component/Pagination";
import SearchBar from "./component/SearchBar";
import { TaskTable } from "./component/TaskTable";

const TaskList: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { tasks, meta } = useSelector((state: RootState) => state.task);
	const { categories } = useSelector((state: RootState) => state.category);
	const totalPages = Math.ceil(meta.total / meta.limit);

	useEffect(() => {
		dispatch(getCategories());
	}, [dispatch]);

	const handleSearch = (query: string) => {
		dispatch(searchTasks({ query, page: 1, limit: meta.limit }));
	};

	const handleReset = () => {
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
			<SearchBar
				onSearch={handleSearch}
				onReset={handleReset}
				placeholder="Search task..."
			/>
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
