import React, { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getTasks } from "~/store/slices/taskSlice";
import { AppDispatch, RootState } from "~/store/store";
import { Pagination } from "./component/Pagination";
import SearchBar from "./component/SearchBar";
import { useSearchParams } from "react-router-dom";
import { TaskItem } from "./component/TaskItem";
import { TaskForm } from "./component/TaskForm";
import { getCategories } from "~/store/slices/categorySlice";

const TaskList: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { tasks, meta } = useSelector((state: RootState) => state.task);
	const { categories } = useSelector((state: RootState) => state.category);
	const [searchParams] = useSearchParams();
	const [isAdding, setIsAdding] = useState(false);
	const [isEditing, setIsEditing] = useState(false);

	useEffect(() => {
		dispatch(getCategories({ query: "" }));
	}, [dispatch]);

	useEffect(() => {
		const query = searchParams.get("query") ?? "";
		dispatch(getTasks({ page: 1, limit: meta.limit, query }));
	}, [searchParams, dispatch, meta.limit]);

	// const handleAdd {
	// 	setIsEditing(false);
	// 	setIsAdding(true);
	// }

	const handleAdd = () => {
		setIsEditing(false);
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
						<th style={{ width: "30px" }}>#</th>
						<th style={{ width: "200px" }}>Title</th>
						<th style={{ width: "200px" }}>Category</th>
						<th style={{ width: "150px" }}>Status</th>
						<th style={{ width: "150px" }}>Created At</th>
						<th style={{ width: "150px" }}>Updated At</th>
						<th style={{ width: "100px" }}>Actions</th>
					</tr>
				</thead>
				<tbody>
					{isAdding && (
						<TaskForm
							categories={categories}
							index={1}
							onCancel={() => setIsAdding(false)}
						/>
					)}
					{tasks.map((task, index) => (
						<TaskItem
							key={task.id}
							task={task}
							categories={categories}
							index={isAdding ? index + 2 : index + 1}
							isAdding={isAdding}
							onEdit={setIsEditing}
						/>
					))}
				</tbody>
			</Table>
			<div className="d-flex justify-content-between mt-3">
				<Button variant="success" onClick={handleAdd} disabled={isEditing}>
					+ Add new task
				</Button>
			</div>
			<Pagination
				totalPages={Math.ceil(meta.total / meta.limit)}
				currentPage={meta.page}
				onPageChange={(page) => dispatch(getTasks({ page, limit: meta.limit }))}
				totalItems={meta.total}
				pageSize={meta.limit}
				onPageSizeChange={(newPageSize) =>
					dispatch(getTasks({ page: 1, limit: newPageSize }))
				}
			/>
		</Container>
	);
};
export default TaskList;