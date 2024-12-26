/* eslint-disable react-hooks/exhaustive-deps */
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import React, { useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "~/components/Toast";
import { useTasks } from "~/hook/useTasks";
import { addTask, updateTask } from "~/store/slices/taskSlice";
import { AppDispatch, RootState } from "~/store/store";
import { Category } from "~/types/Category";
import { TaskStatus } from "~/types/StatusEnum";
import { Task } from "~/types/Task";
import yup from "~/validations/schema/yup";
import { CategorySelect } from "./CategorySelect";
import { StatusDropdown } from "./StatusDropdown";
import { useOnClickOutside } from "~/hook/useOnclickOutside";
import { Button } from "react-bootstrap";

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
	const { isLoading } = useSelector((state: RootState) => state.task);
	const { fetchTasks } = useTasks();
	const formRef = useRef<HTMLFormElement>(null);

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

	const handleSave = async (data: TaskFormData) => {
		if (!isDirty || !isValid) return;

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

			fetchTasks();
			onCancel();
		} catch (error) {
			showToast(
				`Error ${initialData ? "updating" : "creating"} task!`,
				"danger",
			);
			console.error(error);
		}
	};

	useOnClickOutside(formRef, () => {
		if (isDirty && isValid) {
			handleSubmit(handleSave)();
		}
	});

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			if (isDirty && isValid) {
				handleSubmit(handleSave)();
			}
		}
	};

	const watchedFields = watch();
	useEffect(() => {
		if (isDirty && isValid && initialData) {
			handleSubmit(handleSave)();
		}
	}, [watchedFields.status, watchedFields.categories]);

	return (
		<tr className="bg-gray-50">
			<td className="p-2">{index || "-"}</td>
			<td className="p-2">
				<form
					ref={formRef}
					onSubmit={(e) => {
						e.preventDefault();
						if (isDirty && isValid) {
							handleSubmit(handleSave)();
						}
					}}
				>
					<input
						{...register("title")}
						className="w-full p-1 border rounded"
						placeholder="Task title"
						onKeyDown={handleKeyDown}
					/>
					{errors.title && (
						<div className="mt-1 text-sm text-danger">
							{errors.title.message}
						</div>
					)}
				</form>
			</td>
			<td className="p-2">
				<CategorySelect
					categories={categories}
					value={watch("categories")}
					onSave={async (newCategories) => {
						setValue("categories", newCategories, {
							shouldDirty: true,
							shouldValidate: true,
						});
					}}
					isLoading={isLoading}
				/>
			</td>
			<td className="p-2">
				<StatusDropdown
					selectedStatus={watch("status")}
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
				<Button onClick={onCancel} size="sm" variant="secondary">
					Cancel
				</Button>
			</td>
		</tr>
	);
};

export default TaskForm;
