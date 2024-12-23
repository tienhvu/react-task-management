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
	const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
	const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
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

	const handleUpdate = (task: Task) => {
		setTaskToEdit(task);
		setIsAddingNewTask(false);
		resetForm(task);
	};

	const handleSave = async (data: UpdateTaskRequest | CreateTaskRequest) => {
		try {
			if (taskToEdit) {
				await dispatch(
					updateTask({
						taskId: taskToEdit.id,
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
				`Có lỗi xảy ra khi ${taskToEdit ? "cập nhật" : "thêm mới"} task!`,
				"danger",
			);
			console.error(error);
		}
	};

	const handleAddNew = () => {
		setIsAddingNewTask(true);
		setTaskToEdit(null);
		resetForm();
	};

	const handleCancel = () => {
		setTaskToEdit(null);
		setIsAddingNewTask(false);
		form.reset();
	};

	const handleDelete = (task: Task) => {
		setTaskToDelete(task);
		setIsOpenDeleteModal(true);
	};

	const handleConfirmDelete = async () => {
		if (taskToDelete) {
			try {
				await dispatch(deleteTask(taskToDelete.id));
				dispatch(
					getTasks({
						page: currentMeta.page,
						limit: currentMeta.limit,
					}),
				);
				showToast("Xóa task thành công!");
				setIsOpenDeleteModal(false);
				setTaskToDelete(null);
			} catch {
				showToast("Có lỗi xảy ra khi xóa task!", "danger");
			}
		}
	};

	return (
		<>
			<Table striped bordered hover>
				<thead>
					<tr>
						<th>#</th>
						<th>Title</th>
						<th>Category</th>
						<th>Status</th>
						<th>Created At</th>
						<th>Updated At</th>
						<th>Actions</th>
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
						taskToEdit?.id === task.id ? (
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
								onUpdate={() => handleUpdate(task)}
								onDelete={() => handleDelete(task)}
							/>
						),
					)}
				</tbody>
			</Table>
			<div className="d-flex justify-content-between mt-3">
				<Button
					variant="success"
					onClick={handleAddNew}
					disabled={!!isAddingNewTask || !!taskToEdit}
				>
					+ Thêm Task Mới
				</Button>
			</div>

			<DeleteConfirmModal
				isOpen={isOpenDeleteModal}
				onClose={() => {
					setIsOpenDeleteModal(false);
				}}
				onConfirm={handleConfirmDelete}
				task={taskToDelete}
			/>
		</>
	);
};
