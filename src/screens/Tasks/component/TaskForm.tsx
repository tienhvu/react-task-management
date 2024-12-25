import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { AppDispatch, RootState } from "~/store/store";
import { Category } from "~/types/Category";
import { TaskStatus } from "~/types/StatusEnum";
import { Task } from "~/types/Task";
import { CategorySelect } from "./CategorySelect";
import { StatusDropdown } from "./StatusDropdown";
import { useToast } from "~/components/Toast";
import { getTasks, updateTask, addTask } from "~/store/slices/taskSlice";
import { Button } from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import yup from "~/validations/schema/yup";

const taskSchema = yup.object().shape({
	title: yup.string().taskTitle().default(""),
});
interface TaskFormProps {
	onCancel: () => void;
	index?: number;
	initialData?: Task | null;
	categories: Category[];
}

interface TaskFormData {
	title: string;
	categories?: Category[];
	status?: TaskStatus;
}

export const TaskForm: React.FC<TaskFormProps> = ({
	onCancel,
	index,
	initialData,
	categories,
}) => {
	const dispatch = useDispatch<AppDispatch>();
	const { showToast } = useToast();
	const { isLoading, meta } = useSelector((state: RootState) => state.task);

	const form = useForm<TaskFormData>({
		defaultValues: {
			title: initialData?.title,
			categories: initialData?.categories,
			status: initialData?.status,
		},
		resolver: yupResolver(taskSchema),
		mode: "onChange",
	});

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors, isDirty, isValid },
	} = form;

	useEffect(() => {
		register("categories", { required: "Categories are required" });
		register("status", { required: "Status is required" });
	}, [register]);

	const watchCategories = watch("categories") || [];

	const handleSave = async (data: TaskFormData) => {
		try {
			if (initialData) {
				await dispatch(
					updateTask({
						taskId: initialData.id,
						taskData: data,
					}),
				).unwrap();
				showToast("Task updated successfully!");
			} else {
				await dispatch(
					addTask({
						title: data.title,
						categories: data.categories,
						status: data.status,
					}),
				).unwrap();
				showToast("Task created successfully!");
			}

			dispatch(
				getTasks({
					page: meta.page,
					limit: meta.limit,
					query: "",
				}),
			);

			onCancel();
		} catch (error) {
			showToast(
				`Error ${initialData ? "updating" : "creating"} task!`,
				"danger",
			);
			console.error(error);
		}
	};

	return (
		<tr className="bg-gray-50">
			<td className="p-2">{index || "-"}</td>
			<td className="p-2">
				<input
					{...register("title")}
					className="w-full p-1 border rounded"
					placeholder="Task title"
				/>
				{errors.title && (
					<div className="mt-1 text-sm text-danger">{errors.title.message}</div>
				)}
			</td>
			<td className="p-2">
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
			<td className="p-2">
				<StatusDropdown
					selectedStatus={form.watch("status")}
					changeStatus={(status) => {
						setValue("status", status, {
							shouldDirty: true,
							shouldValidate: true,
						});
					}}
				/>
			</td>
			<td className="p-2">
				{initialData
					? format(new Date(initialData.createdAt), "HH:mm:ss dd/MM/yyyy")
					: "-"}
			</td>
			<td className="p-2">
				{initialData
					? format(new Date(initialData.updatedAt), "HH:mm:ss dd/MM/yyyy")
					: "-"}
			</td>
			<td className="p-2 space-x-2">
				<Button
					onClick={handleSubmit(handleSave)}
					size="sm"
					disabled={!isDirty || !isValid || isLoading}
					className="mr-2"
				>
					{isLoading ? "Saving..." : "Save"}
				</Button>
				<Button onClick={onCancel} size="sm" variant="secondary">
					Cancel
				</Button>
			</td>
		</tr>
	);
};

export default TaskForm;
