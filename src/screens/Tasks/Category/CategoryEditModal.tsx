import { Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { AppDispatch } from "~/store/store";
import { useToast } from "~/components/Toast";
import { updateCategory, getCategories } from "~/store/slices/categorySlice";
import CategoryForm from "./CategoryForm";
import type { CategoryFormData } from "./CategoryForm";
import { Category } from "~/types/Category";

interface CategoryEditModalProps {
	isOpen: boolean;
	category: Category;
	onClose: () => void;
}

const CategoryEditModal: React.FC<CategoryEditModalProps> = ({
	isOpen,
	category,
	onClose,
}) => {
	const dispatch = useDispatch<AppDispatch>();
	const { showToast } = useToast();

	const handleUpdateCategory = async (data: CategoryFormData) => {
		try {
			await dispatch(
				updateCategory({
					categoryId: category.id,
					categoryData: data,
				}),
			).unwrap();
			showToast("Cập nhật danh mục thành công");
			dispatch(getCategories({ query: "" }));
			onClose();
		} catch (error) {
			showToast("Cập nhật danh mục thất bại!", "danger");
			console.log("Error: ", error);
		}
	};

	return (
		<Modal show={isOpen} onHide={onClose}>
			<Modal.Header closeButton>
				<Modal.Title>Chỉnh sửa danh mục</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<CategoryForm
					initialData={category}
					onSubmit={handleUpdateCategory}
					buttonLabel="Cập nhật"
				/>
			</Modal.Body>
		</Modal>
	);
};

export default CategoryEditModal;
