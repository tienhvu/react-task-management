import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "~/components/Toast";
import { useTasks } from "~/hook/useTasks";
import { CreateTaskRequest, UpdateTaskRequest } from "~/services/taskApi";
import { addTask, updateTask } from "~/store/slices/taskSlice";
import { AppDispatch, RootState } from "~/store/store";
import { Category } from "~/types/Category";
import { TaskStatus } from "~/types/StatusEnum";
import { Task } from "~/types/Task";
import yup from "~/validations/schema/yup";
import { CategoryTable } from "./CategoryTable";
import { StatusDropdown } from "./StatusDropdown";

const taskSchema = yup.object().shape({
	title: yup.string().taskTitle(),
});

interface TaskFormModalProps {
	isOpen: boolean;
	task?: Task;
	categories: Category[];
	onClose: () => void;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
	isOpen,
	task,
	categories,
	onClose,
}) => {
	const isEditMode = Boolean(task);
	const { showToast } = useToast();
	const dispatch = useDispatch<AppDispatch>();
	const { isLoading } = useSelector((state: RootState) => state.task);
	const { fetchTasks } = useTasks();

	const {
		control,
		handleSubmit,
		setValue,
		watch,
		formState: { errors, isDirty, isValid },
	} = useForm<CreateTaskRequest | UpdateTaskRequest>({
		resolver: yupResolver(taskSchema),
		defaultValues: {
			title: task?.title,
			categories: task?.categories,
			status: task?.status ?? TaskStatus.TODO,
		},
		mode: "onChange",
	});

	const handleCategorySelect = (category: Category) => {
		const selectedCategories = watch("categories") || [];
		const isSelected = selectedCategories.some((c) => c.id === category.id);

		const newCategories = isSelected
			? selectedCategories.filter((c) => c.id !== category.id)
			: [...selectedCategories, category];

		setValue("categories", newCategories, {
			shouldDirty: true,
			shouldValidate: true,
		});
	};

	const onSubmit = async (data: CreateTaskRequest | UpdateTaskRequest) => {
		try {
			if (isEditMode) {
				await dispatch(
					updateTask({ taskId: task!.id, taskData: data as UpdateTaskRequest }),
				).unwrap();
				showToast("Task updated successfully!");
			} else {
				await dispatch(addTask(data as CreateTaskRequest)).unwrap();
				showToast("Task created successfully!");
			}
			fetchTasks();
			onClose();
		} catch {
			showToast(
				`Error occurred while ${isEditMode ? "updating" : "creating"} task!`,
				"danger",
			);
		}
	};

	return (
		<Modal show={isOpen} onHide={onClose} size="lg">
			<Modal.Header closeButton>
				<Modal.Title>
					{isEditMode ? "Edit Task" : "Create New Task"}
				</Modal.Title>
			</Modal.Header>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Modal.Body>
					<Form.Group>
						<Form.Label>Title</Form.Label>
						<Controller
							name="title"
							control={control}
							render={({ field }) => (
								<Form.Control
									{...field}
									placeholder="Enter task title"
									className={errors.title ? "is-invalid" : ""}
								/>
							)}
						/>
						{errors.title && (
							<div className="invalid-feedback">{errors.title.message}</div>
						)}
					</Form.Group>

					<Form.Group>
						<Form.Label>Categories</Form.Label>
						<CategoryTable
							categories={categories}
							selectedCategories={watch("categories") || []}
							onCategorySelect={handleCategorySelect}
						/>
					</Form.Group>

					<Form.Group>
						<Form.Label>Status</Form.Label>
						<StatusDropdown
							selectedStatus={watch("status")}
							changeStatus={(status) =>
								setValue("status", status, { shouldDirty: true })
							}
						/>
					</Form.Group>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={onClose}>
						Cancel
					</Button>
					<Button
						type="submit"
						variant="primary"
						disabled={!isDirty || !isValid || isLoading}
					>
						{isLoading
							? "Saving..."
							: isEditMode
								? "Save Changes"
								: "Create Task"}
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
};
