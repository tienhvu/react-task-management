/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useToast } from "~/components/Toast";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
	Container,
	Row,
	Col,
	Card,
	Form,
	Button,
	Table,
	Alert,
	Modal,
} from "react-bootstrap";
import {
	addCategory,
	updateCategory,
	deleteCategory,
	searchCategories,
	selectCategory,
	getCategories,
} from "~/store/slices/categorySlice";
import { AppDispatch, RootState } from "~/store/store";
import { Category } from "~/types/Category";
import {
	CreateCategoryRequest,
	UpdateCategoryRequest,
} from "~/services/categoryApi";
import useDebounce from "~/hook/useDebounce";

// Validation schema for category form
const categorySchema = Yup.object().shape({
	name: Yup.string()
		.trim()
		.required("Tên danh mục không được để trống")
		.min(2, "Tên danh mục phải có ít nhất 2 ký tự"),
	description: Yup.string()
		.optional()
		.max(500, "Mô tả không được vượt quá 500 ký tự"),
});

const CategoryPage = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { categories, error, selectedCategory } = useSelector(
		(state: RootState) => state.category,
	);
	const { showToast } = useToast();

	const {
		register: registerAdd,
		handleSubmit: handleSubmitAdd,
		reset: resetAdd,
		formState: { errors: errorsAdd, isValid: isValidAdd },
	} = useForm({
		resolver: yupResolver(categorySchema),
		mode: "onChange",
		defaultValues: { name: "", description: "" },
	});

	const {
		register: registerEdit,
		handleSubmit: handleSubmitEdit,
		reset: resetEdit,
		setValue: setValueEdit,
		formState: { errors: errorsEdit, isValid: isValidEdit },
	} = useForm({
		resolver: yupResolver(categorySchema),
		mode: "onChange",
		defaultValues: { name: "", description: "" },
	});

	const [isAddSubmitting, setIsAddSubmitting] = useState(false);
	const [isEditSubmitting, setIsEditSubmitting] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
		null,
	);

	// Search functionality
	const [searchTerm, setSearchTerm] = useState("");
	const debouncedSearchTerm = useDebounce(searchTerm, 500);

	useEffect(() => {
		if (debouncedSearchTerm) {
			dispatch(searchCategories(debouncedSearchTerm));
		} else {
			dispatch(getCategories());
		}
	}, [debouncedSearchTerm, dispatch]);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	// Add Category Handler
	const handleAddCategory = async (data: CreateCategoryRequest) => {
		setIsAddSubmitting(true);
		try {
			await dispatch(addCategory(data)).unwrap();
			showToast("Thêm danh mục thành công");
			resetAdd();
		} catch (error) {
			showToast("Thêm danh mục thất bại!", "danger");
		} finally {
			setIsAddSubmitting(false);
			dispatch(getCategories());
		}
	};

	// Update Category Handler
	const handleUpdateCategory = async (data: UpdateCategoryRequest) => {
		if (!selectedCategory) return;

		setIsEditSubmitting(true);
		try {
			await dispatch(
				updateCategory({
					categoryId: selectedCategory.id,
					categoryData: data,
				}),
			).unwrap();

			showToast("Cập nhật danh mục thành công");
			handleEditClose();
		} catch (error) {
			showToast("Cập nhật danh mục thất bại!", "danger");
		} finally {
			setIsEditSubmitting(false);
			dispatch(getCategories());
		}
	};

	// Delete Category Handler
	const confirmDeleteCategory = (category: Category) => {
		setCategoryToDelete(category);
		setShowDeleteModal(true);
	};

	const handleDeleteCategory = async () => {
		if (!categoryToDelete) return;

		try {
			await dispatch(deleteCategory(categoryToDelete.id)).unwrap();
			showToast("Xóa danh mục thành công");
		} catch (error) {
			showToast("Xóa danh mục thất bại!", "danger");
		} finally {
			setShowDeleteModal(false);
			setCategoryToDelete(null);
			dispatch(getCategories());
		}
	};

	// Select Category for Editing
	const handleSelectCategory = (category: Category) => {
		dispatch(selectCategory(category));
		setValueEdit("name", category.name);
		setValueEdit("description", category.description || "");
		setShowEditModal(true);
	};

	// Close Edit Modal
	const handleEditClose = () => {
		dispatch(selectCategory(null));
		resetEdit();
		setShowEditModal(false);
	};

	return (
		<Container className="mt-5">
			{/* Add Category Form */}
			<Row>
				<Col md={12}>
					<Card>
						<Card.Header as="h3">Thêm Danh Mục Mới</Card.Header>
						<Card.Body>
							{error && <Alert variant="danger">{error}</Alert>}
							<Form onSubmit={handleSubmitAdd(handleAddCategory)}>
								<Form.Group controlId="categoryName" className="mb-3">
									<Form.Label>Tên Danh Mục</Form.Label>
									<Form.Control
										type="text"
										{...registerAdd("name")}
										isInvalid={!!errorsAdd.name}
										placeholder="Nhập tên danh mục"
									/>
									<Form.Control.Feedback type="invalid">
										{errorsAdd.name?.message}
									</Form.Control.Feedback>
								</Form.Group>

								<Form.Group controlId="categoryDescription" className="mb-3">
									<Form.Label>Mô Tả</Form.Label>
									<Form.Control
										as="textarea"
										{...registerAdd("description")}
										isInvalid={!!errorsAdd.description}
										placeholder="Nhập mô tả danh mục (tùy chọn)"
										rows={3}
									/>
									<Form.Control.Feedback type="invalid">
										{errorsAdd.description?.message}
									</Form.Control.Feedback>
								</Form.Group>

								<Button
									variant="primary"
									type="submit"
									disabled={isAddSubmitting || !isValidAdd}
								>
									{isAddSubmitting ? "Đang xử lý..." : "Thêm Mới"}
								</Button>
							</Form>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			{/* Category List */}
			<Row className="mt-5">
				<Col md={12}>
					<Card>
						<Card.Body>
							<Form.Control
								type="text"
								placeholder="Tìm kiếm danh mục"
								value={searchTerm}
								onChange={handleSearch}
							/>
							<Table striped bordered hover className="mt-3">
								<thead>
									<tr>
										<th>STT</th>
										<th>Tên</th>
										<th>Mô Tả</th>
										<th>Hành động</th>
									</tr>
								</thead>
								<tbody>
									{categories.map((category, index) => (
										<tr key={category.id}>
											<td>{index + 1}</td>
											<td>{category.name}</td>
											<td>{category.description}</td>
											<td>
												<Button
													variant="warning"
													onClick={() => handleSelectCategory(category)}
													className="me-2"
												>
													Chỉnh Sửa
												</Button>
												<Button
													variant="danger"
													onClick={() => confirmDeleteCategory(category)}
												>
													Xóa
												</Button>
											</td>
										</tr>
									))}
								</tbody>
							</Table>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			{/* Edit Category Modal */}
			<Modal show={showEditModal} onHide={handleEditClose}>
				<Modal.Header closeButton>
					<Modal.Title>Chỉnh sửa danh mục</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleSubmitEdit(handleUpdateCategory)}>
						<Form.Group controlId="editCategoryName" className="mb-3">
							<Form.Label>Tên Danh Mục</Form.Label>
							<Form.Control
								type="text"
								{...registerEdit("name")}
								isInvalid={!!errorsEdit.name}
								placeholder="Nhập tên danh mục"
							/>
							<Form.Control.Feedback type="invalid">
								{errorsEdit.name?.message}
							</Form.Control.Feedback>
						</Form.Group>

						<Form.Group controlId="editCategoryDescription" className="mb-3">
							<Form.Label>Mô Tả</Form.Label>
							<Form.Control
								as="textarea"
								{...registerEdit("description")}
								isInvalid={!!errorsEdit.description}
								placeholder="Nhập mô tả danh mục (tùy chọn)"
								rows={3}
							/>
							<Form.Control.Feedback type="invalid">
								{errorsEdit.description?.message}
							</Form.Control.Feedback>
						</Form.Group>

						<Button
							variant="primary"
							type="submit"
							disabled={isEditSubmitting || !isValidEdit}
						>
							{isEditSubmitting ? "Đang xử lý..." : "Cập Nhật"}
						</Button>
					</Form>
				</Modal.Body>
			</Modal>

			{/* Delete Confirmation Modal */}
			<Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Xác Nhận Xóa</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Bạn có chắc chắn muốn xóa danh mục "{categoryToDelete?.name}" không?
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
						Hủy
					</Button>
					<Button variant="danger" onClick={handleDeleteCategory}>
						Xóa
					</Button>
				</Modal.Footer>
			</Modal>
		</Container>
	);
};

export default CategoryPage;
