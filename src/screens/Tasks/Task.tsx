import React, { useMemo, useState } from "react";
import {
	Table,
	Form,
	Button,
	Dropdown,
	InputGroup,
	Modal,
	Pagination,
} from "react-bootstrap";

// Component Dropdown Danh Mục với Nút Chi Tiết
const CategoryDropdown = ({
	categories,
	selectedCategory,
	onCategoryChange,
	onDetailView,
}) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [isOpen, setIsOpen] = useState(false);

	const filteredCategories = categories.filter((cat) =>
		cat.name.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	return (
		<div className="d-flex align-items-center">
			<Dropdown
				show={isOpen}
				onToggle={(isOpen) => setIsOpen(isOpen)}
				className="flex-grow-1 me-2"
			>
				<Dropdown.Toggle variant="outline-secondary">
					{selectedCategory?.name || "Chọn danh mục"}
				</Dropdown.Toggle>

				<Dropdown.Menu style={{ width: "300px", padding: "10px" }}>
					<InputGroup className="mb-2">
						<Form.Control
							placeholder="Tìm kiếm danh mục"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</InputGroup>

					<div style={{ maxHeight: "200px", overflowY: "auto" }}>
						{filteredCategories.map((category) => (
							<Dropdown.Item
								key={category.id}
								onClick={() => {
									onCategoryChange(category);
									setIsOpen(false);
								}}
							>
								{category.name}
							</Dropdown.Item>
						))}
					</div>

					<Dropdown.Divider />
					<Dropdown.Item
						onClick={() => {
							/* Logic thêm danh mục */
						}}
					>
						+ Thêm danh mục mới
					</Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown>

			<Button
				variant="outline-info"
				size="sm"
				onClick={() => onDetailView(selectedCategory)}
				disabled={!selectedCategory}
			>
				Chi tiết
			</Button>
		</div>
	);
};

// Component Status Checkbox Ngang
const StatusCheckbox = ({ statuses, selectedStatus, onStatusChange }) => {
	return (
		<div className="d-flex">
			{statuses.map((status) => (
				<Form.Check
					key={status}
					type="radio"
					label={status}
					name="status-radio"
					checked={selectedStatus === status}
					onChange={() => onStatusChange(status)}
					className="me-3"
				/>
			))}
		</div>
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
		{ id: 3, name: "Quản lý", description: "Nhiệm vụ quản lý dự án" },
		{ id: 4, name: "Marketing", description: "Các nhiệm vụ marketing" },
	]);
	const [tasks, setTasks] = useState([
		{
			id: 1,
			title: "Phát triển web",
			category: categories[0],
			status: "Todo",
			createdAt: "2024-01-15",
			updatedAt: "2024-01-15",
			hasChanges: false,
		},
		{
			id: 2,
			title: "Thiết kế giao diện",
			category: categories[1],
			status: "In Progress",
			createdAt: "2024-01-20",
			updatedAt: "2024-01-20",
			hasChanges: false,
		},
		{
			id: 3,
			title: "Báo cáo dự án",
			category: categories[2],
			status: "Completed",
			createdAt: "2024-01-10",
			updatedAt: "2024-01-25",
			hasChanges: false,
		},
		{
			id: 4,
			title: "Chiến dịch quảng cáo",
			category: categories[3],
			status: "Todo",
			createdAt: "2024-02-01",
			updatedAt: "2024-02-01",
			hasChanges: false,
		},
	]);
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [tasksPerPage] = useState(5);
	// Hàm lọc và phân trang tasks
	const filteredAndPaginatedTasks = useMemo(() => {
		// Lọc tasks theo từ khóa tìm kiếm
		const filtered = tasks.filter(
			(task) =>
				task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				task.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				task.status.toLowerCase().includes(searchTerm.toLowerCase()),
		);

		// Phân trang
		const indexOfLastTask = currentPage * tasksPerPage;
		const indexOfFirstTask = indexOfLastTask - tasksPerPage;
		return filtered.slice(indexOfFirstTask, indexOfLastTask);
	}, [tasks, searchTerm, currentPage, tasksPerPage]);

	// Tính toán số trang
	const totalPages = Math.ceil(tasks.length / tasksPerPage);

	const [showCategoryModal, setShowCategoryModal] = useState(false);
	const [currentCategory, setCurrentCategory] = useState(null);
	const [categoryForm, setCategoryForm] = useState({
		title: "",
		description: "",
	});
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	// Status Checkbox for individual task
	const IndividualStatusCheckbox = ({ task, onStatusChange }) => {
		return (
			<div className="d-flex">
				{statuses.map((status) => (
					<Form.Check
						key={status}
						type="radio"
						label={status}
						name={`status-radio-${task.id}`}
						checked={task.status === status}
						onChange={() => onStatusChange(task.id, status)}
						className="me-3"
					/>
				))}
			</div>
		);
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

	const handleAddTask = () => {
		const newTask = {
			id: tasks.length + 1,
			title: "",
			category: null,
			status: "Todo",
			createdAt: new Date().toISOString().split("T")[0],
			updatedAt: new Date().toISOString().split("T")[0],
			hasChanges: true,
		};
		setTasks([...tasks, newTask]);
	};

	const handleCategoryChange = (taskId, newCategory) => {
		updateTaskChanges(taskId, { category: newCategory });
	};

	const handleStatusChange = (taskId, newStatus) => {
		updateTaskChanges(taskId, {
			status: newStatus,
		});
	};

	const handleTitleChange = (taskId, newTitle) => {
		updateTaskChanges(taskId, { title: newTitle });
	};

	const handleSaveTask = (taskId) => {
		const updatedTasks = tasks.map((task) =>
			task.id === taskId ? { ...task, hasChanges: false } : task,
		);
		setTasks(updatedTasks);
	};

	const handleCancelTask = (taskId) => {
		// Optionally implement logic to revert changes
		const updatedTasks = tasks.map((task) =>
			task.id === taskId
				? {
						...task,
						hasChanges: false,
					}
				: task,
		);
		setTasks(updatedTasks);
	};

	const handleCategoryDetail = (category) => {
		setCurrentCategory(category);
		setCategoryForm({
			title: category.name,
			description: category.description,
		});
		setShowCategoryModal(true);
	};

	const handleAddCategory = () => {
		const newCategory = {
			id: categories.length + 1,
			name: categoryForm.title,
			description: categoryForm.description,
		};
		setCategories([...categories, newCategory]);
		setShowCategoryModal(false);
		setCategoryForm({ title: "", description: "" });
	};

	const handleDeleteCategory = () => {
		const filteredCategories = categories.filter(
			(cat) => cat.id !== currentCategory.id,
		);
		setCategories(filteredCategories);
		setShowDeleteConfirm(false);
		setShowCategoryModal(false);
	};

	return (
		<div className="p-4">
			{/* Thêm ô tìm kiếm */}
			<InputGroup className="mb-3">
				<Form.Control
					placeholder="Tìm kiếm tasks (theo tiêu đề, danh mục, trạng thái)"
					value={searchTerm}
					onChange={(e) => {
						setSearchTerm(e.target.value);
						setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
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
								<CategoryDropdown
									categories={categories}
									selectedCategory={task.category}
									onCategoryChange={(newCategory) =>
										handleCategoryChange(task.id, newCategory)
									}
									onDetailView={handleCategoryDetail}
								/>
							</td>
							<td>
								<IndividualStatusCheckbox
									task={task}
									onStatusChange={handleStatusChange}
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
											Hủy
										</Button>
									</div>
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

				<Pagination>
					<Pagination.First
						onClick={() => setCurrentPage(1)}
						disabled={currentPage === 1}
					/>
					<Pagination.Prev
						onClick={() => setCurrentPage(currentPage - 1)}
						disabled={currentPage === 1}
					/>
					{[...Array(totalPages)].map((_, index) => (
						<Pagination.Item
							key={index + 1}
							active={index + 1 === currentPage}
							onClick={() => setCurrentPage(index + 1)}
						>
							{index + 1}
						</Pagination.Item>
					))}
					<Pagination.Next
						onClick={() => setCurrentPage(currentPage + 1)}
						disabled={currentPage === totalPages}
					/>
					<Pagination.Last
						onClick={() => setCurrentPage(totalPages)}
						disabled={currentPage === totalPages}
					/>
				</Pagination>
			</div>

			{/* Modal Chi Tiết Danh Mục */}
			<Modal
				show={showCategoryModal}
				onHide={() => setShowCategoryModal(false)}
			>
				<Modal.Header closeButton>
					<Modal.Title>Chi Tiết Danh Mục</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group>
							<Form.Label>Tiêu Đề</Form.Label>
							<Form.Control
								type="text"
								value={categoryForm.title}
								onChange={(e) =>
									setCategoryForm({ ...categoryForm, title: e.target.value })
								}
							/>
						</Form.Group>
						<Form.Group>
							<Form.Label>Mô Tả</Form.Label>
							<Form.Control
								as="textarea"
								value={categoryForm.description}
								onChange={(e) =>
									setCategoryForm({
										...categoryForm,
										description: e.target.value,
									})
								}
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="secondary"
						onClick={() => setShowDeleteConfirm(true)}
					>
						Xóa
					</Button>
					<Button variant="primary">Lưu Thay Đổi</Button>
				</Modal.Footer>
			</Modal>

			{/* Modal Xác Nhận Xóa */}
			<Modal
				show={showDeleteConfirm}
				onHide={() => setShowDeleteConfirm(false)}
			>
				<Modal.Header closeButton>
					<Modal.Title>Xác Nhận Xóa</Modal.Title>
				</Modal.Header>
				<Modal.Body>Bạn có chắc chắn muốn xóa danh mục này không?</Modal.Body>
				<Modal.Footer>
					<Button
						variant="secondary"
						onClick={() => setShowDeleteConfirm(false)}
					>
						Hủy
					</Button>
					<Button variant="danger" onClick={handleDeleteCategory}>
						Xóa
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default TaskList;
