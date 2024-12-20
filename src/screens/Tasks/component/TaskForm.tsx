/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { Task } from "~/types/Task";
import { Category } from "~/types/Category";
import { TaskStatus } from "~/types/StatusEnum";
import { CreateTaskRequest, UpdateTaskRequest } from "~/services/taskApi";
import { getCategories, searchCategories } from "~/store/slices/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "~/store/store";
import useDebounce from "~/hook/useDebounce";
import { SearchBar } from "./SearchBar";
import { addTask, getTasks, updateTask } from "~/store/slices/taskSlice";
import { useToast } from "~/components/Toast";

interface TaskFormProps {
	show: boolean;
	task?: Task | null;
	categories: Category[];
	onHide: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({
	show,
	task,
	categories,
	onHide,
}) => {
	const { showToast } = useToast();
	const [searchTerm, setSearchTerm] = useState("");
	const [isProcessing, setIsProcessing] = useState(false);
	const [isSearching, setIsSearching] = useState(false);
	const dispatch = useDispatch<AppDispatch>();
	const { page, limit } = useSelector((state: RootState) => state.task);
	const debouncedSearchTerm = useDebounce(searchTerm, 500);
	const isEditMode = !!task;

	const { control, handleSubmit, reset } = useForm<
		CreateTaskRequest | UpdateTaskRequest
	>({
		defaultValues: {
			title: "",
			category: [],
			status: TaskStatus.TODO,
		},
	});

	useEffect(() => {
		if (task) {
			reset({
				title: task.title,
				category: task.category,
				status: task.status,
			});
		} else {
			reset({
				title: "",
				category: [],
				status: TaskStatus.TODO,
			});
		}
	}, [task, reset]);

	useEffect(() => {
		if (isSearching && debouncedSearchTerm) {
			dispatch(searchCategories(debouncedSearchTerm));
		} else if (debouncedSearchTerm) {
			setIsSearching(false);
			dispatch(getCategories());
		}
	}, [dispatch, debouncedSearchTerm, isSearching]);

	const handleSearch = (query: string) => {
		setSearchTerm(query);
		setIsSearching(!!query);
	};

	const handleSave = async (data: CreateTaskRequest | UpdateTaskRequest) => {
		setIsProcessing(true);
		try {
			if (isEditMode && task) {
				await dispatch(
					updateTask({ taskId: task.id, taskData: data as UpdateTaskRequest }),
				);
				dispatch(getTasks({ page, limit }));
				showToast("Cập nhật task thành công!");
			} else {
				await dispatch(addTask(data as CreateTaskRequest));
				showToast("Thêm task thành công!");
			}
			onHide();
		} catch (error) {
			showToast(
				`Có lỗi xảy ra khi ${isEditMode ? "cập nhật" : "thêm"} task!`,
				"danger",
			);
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<Modal show={show} onHide={onHide} size="lg">
			<Modal.Header closeButton className="bg-primary text-white">
				<Modal.Title>{isEditMode ? "Edit Task" : "Add Task"}</Modal.Title>
			</Modal.Header>
			<Form>
				<Modal.Body className="p-4">
					<Form.Group className="mb-4">
						<Form.Label>Title</Form.Label>
						<Controller
							name="title"
							control={control}
							rules={{ required: "Title is required" }}
							render={({ field, fieldState: { error } }) => (
								<>
									<Form.Control
										{...field}
										className={error ? "is-invalid" : ""}
										placeholder="Enter task title"
									/>
									{error && (
										<div className="invalid-feedback">{error.message}</div>
									)}
								</>
							)}
						/>
					</Form.Group>

					<Form.Group className="mb-4">
						<Form.Label>Categories</Form.Label>
						<SearchBar onSearch={handleSearch} searchType="category" />
						<div
							className="border rounded mt-2"
							style={{
								maxHeight: "200px",
								overflowY: "auto",
								backgroundColor: "white",
							}}
						>
							{categories.length === 0 ? (
								<div className="p-2 text-center text-muted">
									No categories available
								</div>
							) : (
								<Controller
									name="category"
									control={control}
									render={({ field: { value = [], onChange } }) => (
										<div className="p-2">
											<Table striped bordered hover>
												<thead>
													<tr>
														<th>Select</th>
														<th>Category Name</th>
														<th>Description</th>
														<th>Created At</th>
														<th>Updated At</th>
													</tr>
												</thead>
												<tbody>
													{categories.map((category) => (
														<tr key={category.id}>
															<td>
																<Form.Check
																	type="checkbox"
																	id={`category-${category.id}`}
																	checked={value.some(
																		(cat) => cat.id === category.id,
																	)}
																	onChange={(e) => {
																		const updatedCategories = e.target.checked
																			? [...value, category]
																			: value.filter(
																					(cat) => cat.id !== category.id,
																				);
																		onChange(updatedCategories);
																	}}
																/>
															</td>
															<td>{category.name}</td>
															<td>
																{category.description ||
																	"No description available"}
															</td>
															<td>
																{new Date(
																	category.createdAt,
																).toLocaleDateString()}
															</td>
															<td>
																{new Date(
																	category.updatedAt,
																).toLocaleDateString()}
															</td>
														</tr>
													))}
												</tbody>
											</Table>
										</div>
									)}
								/>
							)}
						</div>
					</Form.Group>

					<Form.Group className="mb-4">
						<Form.Label>Status</Form.Label>
						<Controller
							name="status"
							control={control}
							render={({ field }) => (
								<Form.Select {...field}>
									{Object.values(TaskStatus).map((status) => (
										<option key={status} value={status}>
											{status}
										</option>
									))}
								</Form.Select>
							)}
						/>
					</Form.Group>
				</Modal.Body>

				<Modal.Footer>
					<Button variant="secondary" onClick={onHide}>
						Cancel
					</Button>
					<Button
						variant="primary"
						onClick={handleSubmit(handleSave)}
						disabled={isProcessing}
					>
						{isProcessing
							? isEditMode
								? "Updating..."
								: "Adding..."
							: isEditMode
								? "Save Changes"
								: "Add Task"}
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
};
