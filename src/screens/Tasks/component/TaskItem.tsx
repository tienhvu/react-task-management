import React from "react";
import { Button } from "react-bootstrap";
import { Task } from "~/types/Task";
import { format } from "date-fns";

interface TaskItemProps {
	task: Task;
	index: number;
	onUpdate: () => void;
	onDelete: () => void;
	disabled: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({
	task,
	index,
	onUpdate,
	onDelete,
	disabled,
}) => (
	<tr>
		<td>{index}</td>
		<td>{task.title}</td>
		<td>{(task.categories || []).map((cat) => cat.name).join(", ")}</td>

		<td>{task.status}</td>
		<td>{format(new Date(task.createdAt), "HH:mm:ss dd/MM/yyyy")}</td>
		<td>{format(new Date(task.updatedAt), "HH:mm:ss dd/MM/yyyy")}</td>
		<td>
			<div className="d-flex gap-2">
				<Button
					variant="primary"
					onClick={onUpdate}
					size="sm"
					disabled={disabled}
				>
					Edit
				</Button>
				<Button
					variant="danger"
					onClick={onDelete}
					size="sm"
					disabled={disabled}
				>
					Delete
				</Button>
			</div>
		</td>
	</tr>
);
