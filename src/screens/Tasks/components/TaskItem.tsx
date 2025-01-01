import { format } from "date-fns";
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setIsEditingTask } from "~/store/slices/taskSlice";
import { AppDispatch } from "~/store/store";
import { Task } from "~/types/Task";
import DeleteModal from "./DeleteModal";
import { TaskForm } from "./TaskForm";
import { TaskFormModal } from "./TaskFormModal";

interface Props {
	task: Task;
}

export const TaskItem: React.FC<Props> = ({ task }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
	const [isOpenEditModal, setIsOpenEditModal] = useState(false);
	const dispatch = useDispatch<AppDispatch>();
	const handleRowClick = (e: React.MouseEvent) => {
		const isActionColumn = (e.target as HTMLElement).closest("td:last-child");
		if (!isActionColumn) {
			setIsEditing(true);
			dispatch(setIsEditingTask(task.id));
		}
	};

	const handleCancelEdit = () => {
		setIsEditing(false);
		dispatch(setIsEditingTask(false));
	};

	if (isEditing) {
		return <TaskForm onClose={handleCancelEdit} initialData={task} />;
	}

	return (
		<>
			<tr onClick={handleRowClick}>
				<td>{task.id}</td>
				<td>{task.title}</td>
				<td>{(task.categories || []).map((cat) => cat.name).join(", ")}</td>
				<td>{task.status}</td>
				<td>{format(new Date(task.createdAt), "HH:mm:ss dd/MM/yyyy")}</td>
				<td>{format(new Date(task.updatedAt), "HH:mm:ss dd/MM/yyyy")}</td>
				<td onClick={(e) => e.stopPropagation()}>
					<div className="d-flex gap-2">
						<Button
							variant="primary"
							onClick={() => setIsOpenEditModal(true)}
							size="sm"
						>
							Edit
						</Button>
						<Button
							variant="danger"
							onClick={() => setIsOpenDeleteModal(true)}
							size="sm"
						>
							Delete
						</Button>
					</div>
				</td>
			</tr>

			{isOpenDeleteModal && (
				<DeleteModal
					isOpen={isOpenDeleteModal}
					item={task}
					itemType="task"
					onClose={() => {
						setIsOpenDeleteModal(false);
					}}
				/>
			)}

			{isOpenEditModal && (
				<TaskFormModal
					isOpen={isOpenEditModal}
					task={task}
					onClose={() => {
						setIsOpenEditModal(false);
					}}
				/>
			)}
		</>
	);
};
