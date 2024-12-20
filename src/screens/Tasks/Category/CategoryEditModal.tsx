/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useToast } from "~/components/Toast";
import { Category } from "~/types/Category";
import { UpdateCategoryRequest } from "~/services/categoryApi";
import { updateCategory, getCategories } from "~/store/slices/categorySlice";
import { AppDispatch } from "~/store/store";

interface CategoryEditModalProps {
	isOpen: boolean;
	category: Category;
	onClose: () => void;
}

const categorySchema = Yup.object().shape({
	name: Yup.string()
		.trim()
		.required("Tên danh mục không được để trống")
		.min(2, "Tên danh mục phải có ít nhất 2 ký tự"),
	description: Yup.string()
		.optional()
		.max(500, "Mô tả không được vượt quá 500 ký tự"),
});

const CategoryEditModal: React.FC<CategoryEditModalProps> = ({
	isOpen,
	category,
	onClose,
}) => {
	const dispatch = useDispatch<AppDispatch>();
	const { showToast } = useToast();
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isValid },
	} = useForm({
		resolver: yupResolver(categorySchema),
		mode: "onChange",
		defaultValues: { name: "", description: "" },
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	React.useEffect(() => {
		if (isOpen) {
			setValue("name", category.name);
			setValue("description", category.description || "");
		}
	}, [isOpen, category, setValue]);

	const handleUpdateCategory = async (data: UpdateCategoryRequest) => {
		setIsSubmitting(true);
		try {
			await dispatch(
				updateCategory({
					categoryId: category.id,
					categoryData: data,
				}),
			).unwrap();

			showToast("Cập nhật danh mục thành công");
			dispatch(getCategories());
			onClose();
		} catch (error) {
			showToast("Cập nhật danh mục thất bại!", "danger");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Modal show={isOpen} onHide={onClose}>
			<Modal.Header closeButton>
				<Modal.Title>Chỉnh sửa danh mục</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={handleSubmit(handleUpdateCategory)}>
					<Form.Group controlId="editCategoryName" className="mb-3">
						<Form.Label>Tên Danh Mục</Form.Label>
						<Form.Control
							type="text"
							{...register("name")}
							isInvalid={!!errors.name}
							placeholder="Nhập tên danh mục"
						/>
						<Form.Control.Feedback type="invalid">
							{errors.name?.message}
						</Form.Control.Feedback>
					</Form.Group>

					<Form.Group controlId="editCategoryDescription" className="mb-3">
						<Form.Label>Mô Tả</Form.Label>
						<Form.Control
							as="textarea"
							{...register("description")}
							isInvalid={!!errors.description}
							placeholder="Nhập mô tả danh mục (tùy chọn)"
							rows={3}
						/>
						<Form.Control.Feedback type="invalid">
							{errors.description?.message}
						</Form.Control.Feedback>
					</Form.Group>

					<Button variant="primary" type="submit" disabled={!isValid}>
						{isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
					</Button>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default CategoryEditModal;
