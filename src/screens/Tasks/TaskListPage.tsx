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
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	const dispatch = useDispatch<AppDispatch>();
	const debouncedSearchTerm = useDebounce(searchTerm, 500);
	const { tasks, total } = useSelector((state: RootState) => state.task);
	const { categories } = useSelector((state: RootState) => state.category);

	const totalPages = Math.ceil(total / pageSize);

	useEffect(() => {
		dispatch(getCategories());
	}, [dispatch]);

	useEffect(() => {
		if (debouncedSearchTerm) {
			dispatch(
				searchTasks({
					query: debouncedSearchTerm,
					page: currentPage,
					limit: pageSize,
				}),
			);
		} else {
			dispatch(getTasks({ page: currentPage, limit: pageSize }));
		}
	}, [dispatch, debouncedSearchTerm, currentPage, pageSize]);

	const handleSearch = (query: string) => {
		setSearchTerm(query);
		setCurrentPage(1);
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handlePageSizeChange = (newPageSize: number) => {
		setPageSize(newPageSize);
		setCurrentPage(1);
	};
	return (
		<Container>
			<h1 className="my-4">Task List</h1>
			<SearchBar onSearch={handleSearch} searchType="task" />
			<>
				<TaskTable tasks={tasks} categories={categories} />
				<Pagination
					totalPages={totalPages}
					currentPage={currentPage}
					onPageChange={handlePageChange}
					totalItems={total}
					pageSize={pageSize}
					onPageSizeChange={handlePageSizeChange}
				/>
			</>
		</Container>
	);
};

export default TaskList;
