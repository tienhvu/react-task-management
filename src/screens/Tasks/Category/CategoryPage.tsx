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

const categorySchema = Yup.object().shape({
	name: Yup.string()
		.trim()
		.required("Tên danh mục không được để trống")
		.min(2, "Tên danh mục phải có ít nhất 2 ký tự"),
	description: Yup.string()
		.optional()
		.max(500, "Mô tả không được vượt quá 500 ký tự"),
});

const defaultFormValues = {
	name: "",
	description: "",
};

const CategoryPage = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { categories, error, selectedCategory } = useSelector(
		(state: RootState) => state.category,
	);
	const { showToast } = useToast();

	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors, isValid },
	} = useForm({
		resolver: yupResolver(categorySchema),
		mode: "onChange",
		defaultValues: defaultFormValues,
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
		null,
	);

	//Handle search and fetch data
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

	useEffect(() => {
		if (selectedCategory) {
			reset({
				name: selectedCategory.name,
				description: selectedCategory.description || "",
			});
		} else {
			reset(defaultFormValues);
		}
	}, [selectedCategory, reset]);

	const isFormModified = () => {
		const currentValues = watch();
		return (
			(selectedCategory &&
				(selectedCategory.name !== currentValues.name ||
					selectedCategory.description !== currentValues.description)) ||
			(!selectedCategory && (currentValues.name || currentValues.description))
		);
	};

	const handleAddCategory = async (data: CreateCategoryRequest) => {
		setIsSubmitting(true);
		try {
			await dispatch(addCategory(data)).unwrap();
			handleSuccessfulAction();
		} catch (error) {
			handleErrorAction("Thêm danh mục thất bại!");
		}
	};

	const handleUpdateCategory = async (data: UpdateCategoryRequest) => {
		if (!selectedCategory) return;
		setIsSubmitting(true);
		try {
			await dispatch(
				updateCategory({
					categoryId: selectedCategory.id,
					categoryData: data,
				}),
			).unwrap();
			handleSuccessfulAction();
		} catch (error) {
			handleErrorAction(error as string);
		}
	};

	const confirmDeleteCategory = (category: Category) => {
		setCategoryToDelete(category);
		setShowDeleteModal(true);
	};

	const handleDeleteCategory = async () => {
		if (!categoryToDelete) return;
		try {
			await dispatch(deleteCategory(categoryToDelete.id)).unwrap();
			showToast("Xóa danh mục thành công");
			dispatch(getCategories());
		} catch (error) {
			handleErrorAction(error as string);
		} finally {
			setShowDeleteModal(false);
			setCategoryToDelete(null);
		}
	};

	const handleSelectCategory = (category: Category) => {
		dispatch(selectCategory(category));
	};

	const handleCancelEdit = () => {
		dispatch(selectCategory(null));
		reset(defaultFormValues);
	};

	//Functions handle notification
	const handleSuccessfulAction = () => {
		showToast(
			selectedCategory
				? "Cập nhật danh mục thành công"
				: "Thêm danh mục thành công",
		);
		dispatch(selectCategory(null));
		reset(defaultFormValues);
		setIsSubmitting(false);
	};

	const handleErrorAction = (errorMessage: string) => {
		showToast(errorMessage, "danger");
		setIsSubmitting(false);
	};

	return (
		<Container className="mt-5">
			<Row>
				<Col md={12}>
					<Card>
						<Card.Header as="h3">
							{selectedCategory ? "Chỉnh Sửa Danh Mục" : "Thêm Danh Mục Mới"}
						</Card.Header>
						<Card.Body>
							{error && <Alert variant="danger">{error}</Alert>}
							<Form
								onSubmit={handleSubmit(
									selectedCategory ? handleUpdateCategory : handleAddCategory,
								)}
							>
								<Form.Group controlId="categoryName" className="mb-3">
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

								<Form.Group controlId="categoryDescription" className="mb-3">
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

								<div className="d-flex justify-content-between">
									<Button
										variant="primary"
										type="submit"
										disabled={isSubmitting || !isFormModified() || !isValid}
									>
										{isSubmitting
											? "Đang xử lý..."
											: selectedCategory
												? "Cập Nhật"
												: "Thêm Mới"}
									</Button>
									{selectedCategory && (
										<Button variant="secondary" onClick={handleCancelEdit}>
											Hủy
										</Button>
									)}
								</div>
							</Form>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			{/* Danh sách danh mục */}
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

			{/* Modal xác nhận xóa */}
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
