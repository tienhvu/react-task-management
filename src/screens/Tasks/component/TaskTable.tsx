import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useToast } from "~/components/Toast";
import {
	addTask,
	deleteTask,
	getTasks,
	updateTask,
} from "~/store/slices/taskSlice";
import { AppDispatch } from "~/store/store";
import { Category } from "~/types/Category";
import { Task } from "~/types/Task";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { CreateTaskRequest, UpdateTaskRequest } from "~/services/taskApi";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { TaskForm, TaskFormData } from "./TaskForm";
import { TaskItem } from "./TaskItem";
import { TaskFormEditModal } from "./TaskFormEditModal";

const taskSchema = yup.object().shape({
	title: yup.string().required("Tiêu đề không được để trống"),
});

interface TaskTableProps {
	tasks: Task[];
	categories: Category[];
	currentMeta: {
		page: number;
		limit: number;
		total: number;
	};
}

export const TaskTable: React.FC<TaskTableProps> = ({
	tasks,
	categories,
	currentMeta,
}) => {
	const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
	const [isOpenEditModal, setIsOpenEditModal] = useState(false);
	const [taskSelected, setTaskSelected] = useState<Task | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [isAddingNewTask, setIsAddingNewTask] = useState(false);

	const dispatch = useDispatch<AppDispatch>();
	const { showToast } = useToast();

	const form = useForm<TaskFormData>({
		resolver: yupResolver(taskSchema),
		mode: "onChange",
		defaultValues: {
			title: "",
			categories: [],
			status: undefined,
		},
	});

	const resetForm = (task?: Task) => {
		form.reset({
			title: task?.title || "",
			categories: task?.categories || [],
			status: task?.status || undefined,
		});
	};

	const onAddNew = () => {
		setIsAddingNewTask(true);
		resetForm();
	};

	const onEdit = (task: Task) => {
		setTaskSelected(task);
		setIsEditing(true);
		resetForm(task);
	};

	const onShowEditModal = (task: Task) => {
		setIsOpenEditModal(true);
		setTaskSelected(task);
	}

	const handleFormSuccess = async () => {
		await dispatch(getTasks({ page: currentMeta.page, limit: currentMeta.limit }));
		setIsOpenEditModal(false);
		setTaskSelected(null);
	};

	const onDelete = (task: Task) => {
		setTaskSelected(task);
		setIsEditing(false);
		setIsOpenDeleteModal(true);
	};

	const handleSave = async (data: UpdateTaskRequest | CreateTaskRequest) => {
		try {
			if (taskSelected) {
				await dispatch(
					updateTask({
						taskId: taskSelected.id,
						taskData: data as UpdateTaskRequest,
					}),
				).unwrap();
				await dispatch(
					getTasks({ page: currentMeta.page, limit: currentMeta.limit }),
				);
				showToast("Cập nhật task thành công!");
			} else {
				await dispatch(addTask(data as CreateTaskRequest)).unwrap();
				await dispatch(getTasks({ page: 1, limit: currentMeta.limit }));
				showToast("Thêm task mới thành công!");
			}

			handleCancel();
		} catch (error) {
			showToast(
				`Có lỗi xảy ra khi ${taskSelected ? "cập nhật" : "thêm mới"} task!`,
				"danger",
			);
			console.error(error);
		}
	};

	const handleCancel = () => {
		setTaskSelected(null);
		setIsOpenEditModal(false);
		setIsEditing(false);
		setIsAddingNewTask(false);
		form.reset();
	};

	const handleDelete = async () => {
		if (taskSelected) {
			try {
				await dispatch(deleteTask(taskSelected.id));
				dispatch(
					getTasks({
						page: currentMeta.page,
						limit: currentMeta.limit,
					}),
				);
				showToast("Xóa task thành công!");
				setIsOpenDeleteModal(false);
			} catch {
				showToast("Có lỗi xảy ra khi xóa task!", "danger");
			}
		}
	};

	return (
		<>
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
					{isAddingNewTask && (
						<TaskForm
							form={form}
							categories={categories}
							onSave={handleSave}
							onCancel={handleCancel}
							index={1}
						/>
					)}
					{tasks.map((task, index) =>
						isEditing && taskSelected?.id === task.id ? (
							<TaskForm
								key={task.id}
								form={form}
								categories={categories}
								onSave={handleSave}
								onCancel={handleCancel}
								index={isAddingNewTask ? index + 2 : index + 1}
								task={task}
							/>
						) : (
							<TaskItem
								key={task.id}
								task={task}
								index={isAddingNewTask ? index + 2 : index + 1}
								onUpdate={() => onEdit(task)}
								onShowModal={() => onShowEditModal(task)}
								onDelete={() => onDelete(task)}
								disabled={isAddingNewTask}
							/>
						),
					)}
				</tbody>
			</Table>
			<div className="d-flex justify-content-between mt-3">
				<Button
					variant="success"
					onClick={onAddNew}
					disabled={!!isAddingNewTask || !!taskSelected}
				>
					+ Add new task
				</Button>
			</div>

			{/* Modals xóa */}
			{taskSelected && (
				<DeleteConfirmModal
					isOpen={isOpenDeleteModal}
					onClose={() => {
						setIsOpenDeleteModal(false);
						setTaskSelected(null);
					}}
					onConfirm={handleDelete}
					task={taskSelected}
				/>
			)}

			{isOpenEditModal && taskSelected && (
				<TaskFormEditModal
				onOpen={isOpenEditModal}
				task={taskSelected}
				categories={categories}
				schema={taskSchema}
				onSuccess={handleFormSuccess}
				onClose={() => setIsOpenEditModal(false)}
			/>
			)}
		</>
	);
};
