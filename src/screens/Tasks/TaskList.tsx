import React, { useEffect } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "~/store/slices/categorySlice";
import { AppDispatch, RootState } from "~/store/store";
import { Task } from "~/types/Task";
import { TaskStatus } from "~/types/StatusEnum";
import { CategoryDropDown } from "./component/CategoryDropDown";
import { StatusDropdown } from "./component/StatusDropdown";

interface TaskFormValues {
	tasks: (Task & { isNew?: boolean })[];
}

const TaskList: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { categories } = useSelector((state: RootState) => state.category);
	const {
		control,
		handleSubmit,
		reset,
		formState: { dirtyFields },
	} = useForm<TaskFormValues>({
		defaultValues: {
			tasks: [
				{
					id: "1",
					title: "Phát triển web",
					category: [],
					status: TaskStatus.TODO,
					createdAt: new Date("2024-01-15"),
					updatedAt: new Date("2024-01-15"),
				},
			],
		},
	});

	const { fields, append, remove, update } = useFieldArray({
		control,
		name: "tasks",
	});

	useEffect(() => {
		dispatch(getCategories());
	}, [dispatch]);

	const handleAddTask = () => {
		const newTask: Task & { isNew?: boolean } = {
			id: Date.now().toString(),
			title: "",
			category: [],
			status: TaskStatus.TODO,
			createdAt: new Date(),
			updatedAt: new Date(),
			isNew: true,
		};
		append(newTask);
	};

	const onSubmit = async (data: TaskFormValues) => {
		try {
			console.log("Submitting tasks:", data.tasks);
			const updatedTasks = data.tasks.map((task) => ({
				...task,
				isNew: false,
			}));
			reset({ tasks: updatedTasks });
		} catch (error) {
			console.error("Lỗi khi lưu tasks:", error);
		}
	};

	const handleCancelTask = (index: number) => {
		const task = fields[index];
		if (task.isNew) {
			remove(index);
		} else {
			reset({
				tasks: fields.map((field, i) =>
					i === index ? { ...field, ...task } : field,
				),
			});
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="p-4">
			<Table striped bordered hover>
				<thead>
					<tr>
						<th>Tiêu Đề</th>
						<th>Danh Mục</th>
						<th>Trạng Thái</th>
						<th>Hành Động</th>
					</tr>
				</thead>
				<tbody>
					{fields.map((field, index) => {
						// Sửa đổi logic kiểm tra dirty state
						const isCurrentTaskDirty =
							(dirtyFields.tasks?.[index] &&
								Object.keys(dirtyFields.tasks[index] || {}).length > 0) ||
							field.isNew;

						return (
							<tr key={field.id}>
								<td>
									<Controller
										control={control}
										name={`tasks.${index}.title`}
										render={({ field }) => (
											<Form.Control type="text" {...field} />
										)}
									/>
								</td>
								<td style={{ maxWidth: "500px", overflow: "hidden" }}>
									<Controller
										control={control}
										name={`tasks.${index}.category`}
										render={({ field }) => (
											<CategoryDropDown
												categories={categories}
												selectedCategories={field.value}
												onChange={field.onChange}
											/>
										)}
									/>
								</td>
								<td>
									<Controller
										control={control}
										name={`tasks.${index}.status`}
										render={({ field }) => (
											<StatusDropdown
												selectedStatus={field.value}
												changeStatus={field.onChange}
											/>
										)}
									/>
								</td>
								<td>
									{isCurrentTaskDirty ? (
										<div>
											<Button
												type="submit"
												variant="primary"
												size="sm"
												className="me-2"
											>
												Lưu
											</Button>
											<Button
												variant="secondary"
												size="sm"
												onClick={() => handleCancelTask(index)}
											>
												Hủy
											</Button>
										</div>
									) : (
										<Button
											variant="danger"
											size="sm"
											onClick={() => remove(index)}
										>
											Xóa
										</Button>
									)}
								</td>
							</tr>
						);
					})}
				</tbody>
			</Table>

			<Button variant="success" onClick={handleAddTask}>
				+ Thêm Task Mới
			</Button>
		</form>
	);
};

export default TaskList;
