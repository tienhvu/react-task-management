import { Table, Button } from "react-bootstrap";
import { Task } from "~/types/Task";
import { Category } from "~/types/Category";
import { useState } from "react";
import { DeleteConfirmModal } from "./DeleteConfrmModal";
import { useDispatch, useSelector } from "react-redux";
import { deleteTask, getTasks } from "~/store/slices/taskSlice";
import { AppDispatch, RootState } from "~/store/store";
import { useToast } from "~/components/Toast";
import { format } from "date-fns";
import { TaskForm } from "./TaskForm";
interface TaskTableProps {
	tasks: Task[];
	categories: Category[];
}

export const TaskTable: React.FC<TaskTableProps> = ({ tasks, categories }) => {
	const [editTask, setEditTask] = useState<Task | null>(null);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
	const [showAddModal, setShowAddModal] = useState(false);
	const { page, limit } = useSelector((state: RootState) => state.task);
	const { showToast } = useToast();
	const dispatch = useDispatch<AppDispatch>();

	const handleEdit = (task: Task) => {
		setEditTask(task);
		setShowEditModal(true);
	};

	const handleDelete = (task: Task) => {
		setTaskToDelete(task);
		setShowDeleteModal(true);
	};

	const handleConfirmDelete = async () => {
		if (taskToDelete) {
			try {
				await dispatch(deleteTask(taskToDelete.id));
				dispatch(getTasks({ page: page, limit: limit }));
				showToast("Xóa task thành công!");
				setShowDeleteModal(false);
				setTaskToDelete(null);
			} catch {
				showToast("Có lỗi xảy ra khi xóa task!", "danger");
			}
		}
	};

	const handleAddTask = () => {
		setShowAddModal(true);
	};

	const getCategoryNames = (
		categoryIds: string[],
		categories: Category[],
	): string => {
		return categoryIds
			.map((categoryId) => {
				const category = categories.find((cat) => cat.id === categoryId);
				return category?.name;
			})
			.filter(Boolean)
			.join(", ");
	};

	return (
		<>
			<Table
				striped
				bordered
				hover
				style={{ height: "300px", overflow: "auto" }}
			>
				<thead>
					<tr>
						<th>#</th>
						<th>Title</th>
						<th>Category</th>
						<th>Status</th>
						<th>Updated At</th>
						<th>Created At</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{tasks.length > 0 ? (
						tasks.map((task, index) => (
							<tr key={task.id}>
								<td>{(page - 1) * limit + index + 1}</td>
								<td>{task.title}</td>
								<td>
									{getCategoryNames(
										task.category.map((cat) => cat.id),
										categories,
									)}
								</td>
								<td>{task.status}</td>
								<td>
									{format(new Date(task.updatedAt), "HH:mm:ss dd/MM/yyyy")}
								</td>
								<td>
									{format(new Date(task.createdAt), "HH:mm:ss dd/MM/yyyy")}
								</td>
								<td>
									<div className="d-flex gap-2">
										<Button
											variant="primary"
											size="sm"
											onClick={() => handleEdit(task)}
										>
											Edit
										</Button>
										<Button
											variant="danger"
											size="sm"
											onClick={() => handleDelete(task)}
										>
											Delete
										</Button>
									</div>
								</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan={7} className="text-center">
								No tasks found.
							</td>
						</tr>
					)}
				</tbody>
			</Table>
			<div className="d-flex justify-content-between mt-3">
				<Button variant="success" onClick={handleAddTask}>
					+ Thêm Task Mới
				</Button>
			</div>
			{/* <TaskAddForm
				show={showAddModal}
				categories={categories}
				onHide={() => setShowAddModal(false)}
			/>

			<TaskEditForm
				show={showEditModal}
				task={editTask}
				categories={categories}
				onHide={() => {
					setShowEditModal(false);
					setEditTask(null);
				}}
			/> */}
			<TaskForm
				show={showAddModal}
				categories={categories}
				onHide={() => setShowAddModal(false)}
			/>
			<TaskForm
				show={showEditModal}
				task={editTask}
				categories={categories}
				onHide={() => {
					setShowEditModal(false);
					setEditTask(null);
				}}
			/>
			<DeleteConfirmModal
				show={showDeleteModal}
				onHide={() => {
					setShowDeleteModal(false);
					setTaskToDelete(null);
				}}
				onConfirm={handleConfirmDelete}
				taskTitle={taskToDelete?.title || ""}
			/>
		</>
	);
};
