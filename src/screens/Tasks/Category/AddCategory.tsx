import { Card } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { AppDispatch } from "~/store/store";
import { useToast } from "~/components/Toast";
import { addCategory, getCategories } from "~/store/slices/categorySlice";
import CategoryForm from "./CategoryForm";
import type { CategoryFormData } from "./CategoryForm";

const AddCategory = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { showToast } = useToast();

	const handleAddCategory = async (data: CategoryFormData) => {
		try {
			await dispatch(addCategory(data)).unwrap();
			showToast("Thêm danh mục thành công");
			dispatch(getCategories());
		} catch (error) {
			showToast("Thêm danh mục thất bại!", "danger");
			console.log("Error", error);
		}
	};

	return (
		<Card>
			<Card.Header as="h3">Thêm Danh Mục Mới</Card.Header>
			<Card.Body>
				<CategoryForm
					onSubmit={handleAddCategory}
					submitButtonText="Thêm Mới"
				/>
			</Card.Body>
		</Card>
	);
};

export default AddCategory;
