import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { useToast } from "~/components/Toast";
import { UpdateTaskRequest } from "~/services/taskApi";
import { updateTask } from "~/store/slices/taskSlice";
import { AppDispatch } from "~/store/store";
import { Category } from "~/types/Category";
import { Task } from "~/types/Task";
import { CategoryTable } from "./CategoryTable";
import { StatusDropdown } from "./StatusDropdown";

interface TaskFormEditModalProps {
  onOpen: boolean;
  task: Task;
  categories: Category[];
  onSuccess: () => Promise<void>;
  onClose: () => void;
	schema: Yup.ObjectSchema<any>;
}

export const TaskFormEditModal: React.FC<TaskFormEditModalProps> = ({
  onOpen,
  task,
  categories,
  onSuccess,
  onClose,
  schema,
}) => {
  const { showToast } = useToast();
  const dispatch = useDispatch<AppDispatch>();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm<UpdateTaskRequest>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: task.title,
      categories: task.categories,
      status: task.status,
    },
    mode: "onChange",
  });

  const handleCategorySelect = (category: Category) => {
    const selectedCategories = watch("categories") || [];
    const isSelected = selectedCategories.some(c => c.id === category.id);

    const newCategories = isSelected
      ? selectedCategories.filter(c => c.id !== category.id)
      : [...selectedCategories, category];

    setValue("categories", newCategories, { shouldDirty: true, shouldValidate: true });
  };

  const onSubmit = async (data: UpdateTaskRequest) => {
    try {
      await dispatch(updateTask({ taskId: task.id, taskData: data })).unwrap();
      await onSuccess();
      showToast("Task updated successfully!");
      onClose();
    } catch (error) {
      showToast("Error occurred while updating task!", "danger");
    }
  };

  return (
    <Modal show={onOpen} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Task</Modal.Title>
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
            {errors.title && <div className="invalid-feedback">{errors.title.message}</div>}
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
              changeStatus={status => setValue("status", status, { shouldDirty: true })}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={!isDirty || !isValid}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
