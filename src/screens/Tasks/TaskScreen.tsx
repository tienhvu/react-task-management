/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useTasks } from "~/hook/useTasks";
import { getCategories } from "~/store/slices/categorySlice";
import { AppDispatch, RootState } from "~/store/store";
import { Pagination } from "./components/Pagination/Pagination";
import SearchBar from "./components/SearchBar";
import { TaskFormModal } from "./components/TaskFormModal";
import { TaskItem } from "./components/TaskItem";

const TasksScreen: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { tasks, editingTaskId } = useSelector(
		(state: RootState) => state.task,
	);
	const { fetchTasks } = useTasks();
	const [searchParams] = useSearchParams();
	const [isAdding, setIsAdding] = useState(false);
	useEffect(() => {
		dispatch(getCategories({ query: "" }));
	}, [dispatch]);

	useEffect(() => {
		fetchTasks();
	}, [searchParams]);

	const handleAdd = () => {
		setIsAdding(true);
	};

	return (
		<Container>
			<h1 className="my-4">Task List</h1>
			<SearchBar placeholder="Search task..." />
			<Table
				striped
				bordered
				hover
				style={{ tableLayout: "fixed", width: "100%" }}
			>
				<thead>
					<tr>
						<th>TaskId</th>
						<th>Title</th>
						<th>Category</th>
						<th>Status</th>
						<th>Created At</th>
						<th>Updated At</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{isAdding && (
						<TaskFormModal
							isOpen={isAdding}
							onClose={() => setIsAdding(false)}
						/>
					)}
					{tasks.map((task) => (
						<TaskItem key={task.id} task={task} />
					))}
				</tbody>
			</Table>
			<div className="d-flex justify-content-between mt-3">
				<Button
					variant="success"
					onClick={handleAdd}
					disabled={Boolean(editingTaskId)}
				>
					+ Add new task
				</Button>
			</div>
			<Pagination />
		</Container>
	);
};
export default TasksScreen;
