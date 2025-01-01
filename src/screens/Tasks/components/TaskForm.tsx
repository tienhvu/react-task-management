/* eslint-disable react-hooks/exhaustive-deps */
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import React, { useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useToast } from "~/components/Toast";
import { useOnClickOutside } from "~/hook/useOnclickOutside";
import { useTasks } from "~/hook/useTasks";
import { addTask, updateTask } from "~/store/slices/taskSlice";
import { AppDispatch } from "~/store/store";
import { Category } from "~/types/Category";
import { TaskStatus } from "~/types/StatusEnum";
import { Task } from "~/types/Task";
import yup from "~/validations/schema/yup";
import { CategorySelect } from "./CategorySelect/CategorySelect";
import { StatusDropdown } from "./StatusDropdown";

const taskSchema = yup.object().shape({
	title: yup.string().taskTitle().default(""),
});

interface TaskFormProps {
	onClose: () => void;
	initialData?: Task | null;
}

interface TaskFormData {
	title: string;
	categories?: Category[];
	status?: TaskStatus;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onClose, initialData }) => {
	const dispatch = useDispatch<AppDispatch>();
	const { showToast } = useToast();
	const { fetchTasks } = useTasks();
	const formRef = useRef<HTMLFormElement>(null);

	const form = useForm<TaskFormData>({
		defaultValues: {
			...initialData,
		},
		resolver: yupResolver(taskSchema),
		mode: "onChange",
	});

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isDirty, isValid },
	} = form;

	const [status, categories] = watch(["status", "categories"]);

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
			onClose();
		} catch (error) {
			showToast(
				`Error ${initialData ? "updating" : "creating"} task!`,
				"danger",
			);
			console.error(error);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			if (isDirty && isValid) {
				handleSubmit(handleSave)();
			}
		}
	};
	const rowRef = useRef<HTMLTableRowElement>(null);
	useOnClickOutside(rowRef, onClose);

	useEffect(() => {
		if (isDirty && isValid && initialData) {
			handleSubmit(handleSave)();
		}
	}, [status, categories]);

	return (
		<tr ref={rowRef} className="bg-gray-50">
			<td className="p-2">{initialData ? initialData.id : "-"}</td>
			<FormProvider {...form}>
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
						<div style={{ overflow: "hidden" }}>
							<input
								{...register("title")}
								className="w-full p-1 border rounded"
								placeholder="Task title"
								onKeyDown={handleKeyDown}
							/>
						</div>
						{errors.title && (
							<div className="mt-1 text-sm text-danger">
								{errors.title.message}
							</div>
						)}
					</form>
				</td>
				<td className="p-2">
					<CategorySelect />
				</td>
				<td className="p-2">
					<StatusDropdown />
				</td>
			</FormProvider>
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
				<Button onClick={onClose} size="sm" variant="secondary">
					Cancel
				</Button>
			</td>
		</tr>
	);
};

export default TaskForm;
