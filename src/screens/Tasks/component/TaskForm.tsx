import { format } from "date-fns";
import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import { UseFormReturn } from "react-hook-form";
import { Category } from "~/types/Category";
import { TaskStatus } from "~/types/StatusEnum";
import { Task } from "~/types/Task";
import { CategorySelect } from "./CategorySelect";
import { StatusDropdown } from "./StatusDropdown";
import { useSelector } from "react-redux";
import { RootState } from "~/store/store";

export interface TaskFormData {
	title: string;
	categories?: Category[];
	status?: TaskStatus;
}

interface TaskFormProps {
	form: UseFormReturn<TaskFormData>;
	categories: Category[];
	onSave: (data: TaskFormData) => void;
	onCancel: () => void;
	index: number;
	task?: Task;
}

export const TaskForm: React.FC<TaskFormProps> = ({
	form,
	categories,
	onSave,
	onCancel,
	index,
	task,
}) => {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isDirty, isValid },
	} = form;

	useEffect(() => {
		register("categories");
	}, [register]);

	const watchCategories = form.watch("categories") || [];
	const { isLoading } = useSelector((state: RootState) => state.task);
	return (
		<tr>
			<td>{index}</td>
			<td>
				<input type="text" className="form-control" {...register("title")} />
				{errors.title && (
					<span className="text-danger">{errors.title.message}</span>
				)}
			</td>
			<td>
				<CategorySelect
					categories={categories}
					value={watchCategories}
					onChange={(newCategories) => {
						setValue("categories", newCategories, {
							shouldDirty: true,
							shouldValidate: true,
						});
					}}
				/>
			</td>
			<td>
				<StatusDropdown
					selectedStatus={form.watch("status")}
					changeStatus={(status: TaskStatus) => {
						setValue("status", status, {
							shouldDirty: true,
							shouldValidate: true,
						});
					}}
				/>
			</td>
			<td>
				{task ? format(new Date(task.createdAt), "HH:mm:ss dd/MM/yyyy") : "-"}
			</td>
			<td>
				{task ? format(new Date(task.updatedAt), "HH:mm:ss dd/MM/yyyy") : "-"}
			</td>
			<td>
				<div className="d-flex gap-2">
					<Button
						variant="success"
						onClick={handleSubmit((data) => {
							onSave(data);
						})}
						disabled={!isDirty || !isValid || !!isLoading}
					>
						{isLoading ? "Đang lưu..." : "Lưu"}
					</Button>
					<Button variant="secondary" onClick={onCancel}>
						Hủy
					</Button>
				</div>
			</td>
		</tr>
	);
};
