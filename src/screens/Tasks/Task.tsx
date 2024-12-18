import { useMemo, useState } from "react";
import {
	Table,
	Form,
	Button,
	Dropdown,
	InputGroup,
	Modal,
	Pagination,
} from "react-bootstrap";

// Enhanced Category Dropdown with detailed information
const CategoryMultiSelect = ({
	categories,
	selectedCategories,
	onCategoryChange,
}) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const filteredCategories = categories.filter((cat) =>
		cat.name.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const handleCategoryToggle = (category) => {
		const isSelected = selectedCategories.some((c) => c.id === category.id);
		if (isSelected) {
			onCategoryChange(selectedCategories.filter((c) => c.id !== category.id));
		} else {
			onCategoryChange([...selectedCategories, category]);
		}
	};

	return (
		<>
			<Dropdown
				show={isDropdownOpen}
				onToggle={(isOpen) => {
					setIsDropdownOpen(isOpen);
					if (isOpen) {
						setShowModal(true);
					}
				}}
				className="w-100"
				style={{ maxWidth: "300px", overflow: "hidden" }}
			>
				<Dropdown.Toggle variant="outline-secondary" className="w-100">
					{selectedCategories.length > 0
						? selectedCategories.map((cat) => cat.name).join(", ")
						: "Chọn danh mục"}
				</Dropdown.Toggle>
			</Dropdown>

			<Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
				<Modal.Header closeButton>
					<Modal.Title>Chọn Danh Mục Chi Tiết</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<InputGroup className="mb-3">
						<Form.Control
							placeholder="Tìm kiếm danh mục"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</InputGroup>

					<Table striped bordered hover>
						<thead>
							<tr>
								<th>Chọn</th>
								<th>Tên Danh Mục</th>
								<th>Mô Tả</th>
							</tr>
						</thead>
						<tbody>
							{filteredCategories.map((category) => (
								<tr
									key={category.id}
									className={
										selectedCategories.some((c) => c.id === category.id)
											? "table-active cursor-pointer"
											: "cursor-pointer"
									}
									onClick={() => handleCategoryToggle(category)}
								>
									<td>
										<Form.Check
											type="checkbox"
											id={`category-${category.id}`}
											checked={selectedCategories.some(
												(c) => c.id === category.id,
											)}
											onChange={() => handleCategoryToggle(category)}
										/>
									</td>
									<td>{category.name}</td>
									<td>{category.description}</td>
								</tr>
							))}
						</tbody>
					</Table>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowModal(false)}>
						Đóng
					</Button>
					<Button variant="primary" onClick={() => setShowModal(false)}>
						Xác Nhận
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

// Rest of the component remains the same as in the previous implementation
const StatusDropdown = ({ statuses, selectedStatus, onStatusChange }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dropdown
			show={isOpen}
			onToggle={(isOpen) => setIsOpen(isOpen)}
			className="w-100"
		>
			<Dropdown.Toggle variant="outline-secondary" className="w-100">
				{selectedStatus || "Chọn trạng thái"}
			</Dropdown.Toggle>

			<Dropdown.Menu className="w-100">
				{statuses.map((status) => (
					<Dropdown.Item
						key={status}
						onClick={() => {
							onStatusChange(status);
							setIsOpen(false);
						}}
					>
						{status}
					</Dropdown.Item>
				))}
			</Dropdown.Menu>
		</Dropdown>
	);
};
const TaskList = () => {
	const [statuses] = useState(["Todo", "In Progress", "Completed"]);

	const [categories, setCategories] = useState([
		{
			id: 1,
			name: "Lập trình",
			description: "Các nhiệm vụ liên quan đến lập trình",
		},
		{ id: 2, name: "Design", description: "Các nhiệm vụ thiết kế" },
		{ id: 3, name: "Quản lý dự án", description: "Nhiệm vụ quản lý dự án" },
		{ id: 4, name: "Marketing", description: "Các nhiệm vụ marketing" },
		{ id: 5, name: "Coding", description: "Các nhiệm vụ coding" },
	]);

	const [tasks, setTasks] = useState([
		{
			id: 1,
			title: "Phát triển web",
			categories: [categories[0]],
			status: "Todo",
			createdAt: "2024-01-15",
			updatedAt: "2024-01-15",
			hasChanges: false,
			isNewTask: false,
		},
		{
			id: 2,
			title: "Thiết kế giao diện",
			categories: [categories[1]],
			status: "In Progress",
			createdAt: "2024-01-20",
			updatedAt: "2024-01-20",
			hasChanges: false,
			isNewTask: false,
		},
		{
			id: 3,
			title: "Báo cáo dự án",
			categories: [categories[2]],
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
			id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
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
								<CategoryMultiSelect
									categories={categories}
									selectedCategories={task.categories}
									onCategoryChange={(newCategories) =>
										handleCategoriesChange(task.id, newCategories)
									}
								/>
							</td>
							<td>
								<StatusDropdown
									statuses={statuses}
									selectedStatus={task.status}
									onStatusChange={(newStatus) =>
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
