/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	Container,
	Row,
	Col,
	Card,
	Form,
	Button,
	Table,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useToast } from "~/components/Toast";
import {
	addCategory,
	getCategories,
	searchCategories,
} from "~/store/slices/categorySlice";
import { AppDispatch, RootState } from "~/store/store";
import { Category } from "~/types/Category";
import { CreateCategoryRequest } from "~/services/categoryApi";
import useDebounce from "~/hook/useDebounce";
import CategoryEditModal from "./CategoryEditModal";
import CategoryDeleteModal from "./CategoryDeleteModal";

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
	const { categories } = useSelector((state: RootState) => state.category);
	const { showToast } = useToast();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid },
	} = useForm({
		resolver: yupResolver(categorySchema),
		mode: "onChange",
		defaultValues: { name: "", description: "" },
	});

	const [isAddSubmitting, setIsAddSubmitting] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
	const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
		null,
	);

	const debouncedSearchTerm = useDebounce(searchTerm, 500);

	useEffect(() => {
		if (debouncedSearchTerm) {
			dispatch(searchCategories(debouncedSearchTerm));
		} else {
			dispatch(getCategories());
		}
	}, [debouncedSearchTerm, dispatch]);

	const handleAddCategory = async (data: CreateCategoryRequest) => {
		setIsAddSubmitting(true);
		try {
			await dispatch(addCategory(data)).unwrap();
			showToast("Thêm danh mục thành công");
			reset();
			dispatch(getCategories());
		} catch (error) {
			showToast("Thêm danh mục thất bại!", "danger");
		} finally {
			setIsAddSubmitting(false);
		}
	};

	return (
		<Container className="mt-5">
			{/* Phần form thêm mới */}
			<Row>
				<Col md={12}>
					<Card>
						<Card.Header as="h3">Thêm Danh Mục Mới</Card.Header>
						<Card.Body>
							<Form onSubmit={handleSubmit(handleAddCategory)}>
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

								<Button
									variant="primary"
									type="submit"
									disabled={isAddSubmitting || !isValid}
								>
									{isAddSubmitting ? "Đang xử lý..." : "Thêm Mới"}
								</Button>
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
								onChange={(e) => setSearchTerm(e.target.value)}
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
													onClick={() => setCategoryToEdit(category)}
													className="me-2"
												>
													Chỉnh Sửa
												</Button>
												<Button
													variant="danger"
													onClick={() => setCategoryToDelete(category)}
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

			{/* Modals */}
			{categoryToEdit && (
				<CategoryEditModal
					isOpen={!!categoryToEdit}
					category={categoryToEdit}
					onClose={() => setCategoryToEdit(null)}
				/>
			)}

			{categoryToDelete && (
				<CategoryDeleteModal
					isOpen={!!categoryToDelete}
					category={categoryToDelete}
					onClose={() => setCategoryToDelete(null)}
				/>
			)}
		</Container>
	);
};

export default CategoryPage;
