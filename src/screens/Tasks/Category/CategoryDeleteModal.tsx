/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useToast } from "~/components/Toast";
import { Category } from "~/types/Category";
import { deleteCategory, getCategories } from "~/store/slices/categorySlice";
import { AppDispatch } from "~/store/store";

interface CategoryDeleteModalProps {
	isOpen: boolean;
	category: Category;
	onClose: () => void;
}

const CategoryDeleteModal: React.FC<CategoryDeleteModalProps> = ({
	isOpen,
	category,
	onClose,
}) => {
	const dispatch = useDispatch<AppDispatch>();
	const { showToast } = useToast();

	const handleDeleteCategory = async () => {
		try {
			await dispatch(deleteCategory(category.id)).unwrap();
			showToast("Xóa danh mục thành công");
			dispatch(getCategories());
			onClose();
		} catch (error) {
			showToast("Xóa danh mục thất bại!", "danger");
		}
	};

	return (
		<Modal show={isOpen} onHide={onClose}>
			<Modal.Header closeButton>
				<Modal.Title>Xác Nhận Xóa</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				Bạn có chắc chắn muốn xóa danh mục "{category.name}" không?
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={onClose}>
					Hủy
				</Button>
				<Button variant="danger" onClick={handleDeleteCategory}>
					Xóa
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default CategoryDeleteModal;
