import { useEffect, useMemo, useState } from "react";
import { Table, Form, Button, InputGroup } from "react-bootstrap";
import { CategoryMultiSelect } from "./component/CategoryMultiSelect";
import { StatusDropdown } from "./component/StatusDropdown";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "~/store/store";
import { getCategories } from "~/store/slices/categorySlice";

const TaskList = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { categories, isLoading } = useSelector(
		(state: RootState) => state.category,
	);
	const [isLoadingCategories, setIsLoadingCategories] = useState(true);

	// Fetch categories only once when the component mounts
	useEffect(() => {
		dispatch(getCategories()).then(() => setIsLoadingCategories(false)); // Update loading state once categories are fetched
	}, [dispatch]);

	const [tasks, setTasks] = useState([
		{
			id: 1,
			title: "Phát triển web",
			categories: [],
			status: "Todo",
			createdAt: "2024-01-15",
			updatedAt: "2024-01-15",
			hasChanges: false,
			isNewTask: false,
		},
		{
			id: 2,
			title: "Thiết kế giao diện",
			categories: [],
			status: "In Progress",
			createdAt: "2024-01-20",
			updatedAt: "2024-01-20",
			hasChanges: false,
			isNewTask: false,
		},
		{
			id: 3,
			title: "Báo cáo dự án",
			categories: [],
			status: "Completed",
			createdAt: "2024-01-10",
			updatedAt: "2024-01-25",
			hasChanges: false,
			isNewTask: false,
		},
	]);

	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [tasksPerPage] = useState(5);

	// Update the filteredAndPaginatedTasks to show all tasks including new ones
	const filteredAndPaginatedTasks = useMemo(() => {
		const filtered = tasks.filter(
			(task) =>
				task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				task.categories.some((cat) =>
					cat.name.toLowerCase().includes(searchTerm.toLowerCase()),
				) ||
				task.status.toLowerCase().includes(searchTerm.toLowerCase()),
		);

		const indexOfLastTask = currentPage * tasksPerPage;
		const indexOfFirstTask = indexOfLastTask - tasksPerPage;
		return filtered.slice(indexOfFirstTask, indexOfLastTask);
	}, [tasks, searchTerm, currentPage, tasksPerPage]);

	const totalPages = Math.ceil(tasks.length / tasksPerPage);

	const handleAddTask = () => {
		const newTask = {
			id: tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1,
			title: "",
			categories: [],
			status: "Todo",
			createdAt: new Date().toISOString().split("T")[0],
			updatedAt: new Date().toISOString().split("T")[0],
			hasChanges: true,
			isNewTask: true,
		};
		setTasks([...tasks, newTask]);
		setCurrentPage(Math.ceil((tasks.length + 1) / tasksPerPage));
	};

	const handleDeleteTask = (taskId) => {
		const updatedTasks = tasks.filter((task) => task.id !== taskId);
		setTasks(updatedTasks);

		// Adjust current page if needed
		if (currentPage > Math.ceil(updatedTasks.length / tasksPerPage)) {
			setCurrentPage(Math.ceil(updatedTasks.length / tasksPerPage));
		}
	};

	const updateTaskChanges = (taskId, updates) => {
		const updatedTasks = tasks.map((task) =>
			task.id === taskId
				? {
						...task,
						...updates,
						updatedAt: new Date().toISOString().split("T")[0],
						hasChanges: true,
					}
				: task,
		);
		setTasks(updatedTasks);
	};

	const handleCategoriesChange = (taskId, newCategories) => {
		updateTaskChanges(taskId, { categories: newCategories });
	};

	const handleStatusChange = (taskId, newStatus) => {
		updateTaskChanges(taskId, { status: newStatus });
	};

	const handleTitleChange = (taskId, newTitle) => {
		updateTaskChanges(taskId, { title: newTitle });
	};

	const handleSaveTask = (taskId) => {
		const updatedTasks = tasks.map((task) =>
			task.id === taskId
				? {
						...task,
						hasChanges: false,
						isNewTask: false,
					}
				: task,
		);
		setTasks(updatedTasks);
	};

	const handleCancelTask = (taskId) => {
		// If it's a new task, delete it
		if (tasks.find((task) => task.id === taskId)?.isNewTask) {
			handleDeleteTask(taskId);
		} else {
			// If it's an existing task, reset changes
			const updatedTasks = tasks.map((task) =>
				task.id === taskId ? { ...task, hasChanges: false } : task,
			);
			setTasks(updatedTasks);
		}
	};

	return (
		<div className="p-4">
			<InputGroup className="mb-3">
				<Form.Control
					placeholder="Tìm kiếm tasks (theo tiêu đề, danh mục, trạng thái)"
					value={searchTerm}
					onChange={(e) => {
						setSearchTerm(e.target.value);
						setCurrentPage(1);
					}}
				/>
			</InputGroup>

			<Table striped bordered hover>
				<thead>
					<tr>
						<th>Tiêu Đề</th>
						<th>Danh Mục</th>
						<th>Trạng Thái</th>
						<th>Ngày Tạo</th>
						<th>Cập Nhật Lần Cuối</th>
						<th>Hành Động</th>
					</tr>
				</thead>
				<tbody>
					{filteredAndPaginatedTasks.map((task) => (
						<tr key={task.id}>
							<td>
								<Form.Control
									type="text"
									value={task.title}
									onChange={(e) => handleTitleChange(task.id, e.target.value)}
								/>
							</td>
							<td>
								<CategoryMultiSelect categories={categories} />
							</td>
							<td>
								<StatusDropdown
									selectedStatus={task.status}
									changeStatus={(newStatus) =>
										handleStatusChange(task.id, newStatus)
									}
								/>
							</td>
							<td>{task.createdAt}</td>
							<td>{task.updatedAt}</td>
							<td>
								{task.hasChanges && (
									<div className="d-flex">
										<Button
											variant="outline-primary"
											size="sm"
											onClick={() => handleSaveTask(task.id)}
											className="me-1"
										>
											Lưu
										</Button>
										<Button
											variant="outline-secondary"
											size="sm"
											onClick={() => handleCancelTask(task.id)}
										>
											{task.isNewTask ? "Xóa" : "Hủy"}
										</Button>
									</div>
								)}
								{task.isNewTask && !task.hasChanges && (
									<Button
										variant="outline-danger"
										size="sm"
										onClick={() => handleDeleteTask(task.id)}
									>
										Xóa
									</Button>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</Table>

			<div className="d-flex justify-content-between align-items-center">
				<Button variant="outline-success" onClick={handleAddTask}>
					+ Thêm Task Mới
				</Button>
			</div>
		</div>
	);
};

export default TaskList;
