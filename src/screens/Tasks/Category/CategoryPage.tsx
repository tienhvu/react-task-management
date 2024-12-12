import React, { useEffect, useState } from "react";
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
} from "react-bootstrap";
import {
	addCategory,
	updateCategory,
	deleteCategory,
	searchCategories,
	selectCategory,
	clearError,
} from "~/store/slices/categorySlice";
import { AppDispatch, RootState } from "~/store/store";
import { Category } from "~/types/Category";
import {
	CreateCategoryRequest,
	UpdateCategoryRequest,
} from "~/services/categoryApi";

const categorySchema = Yup.object().shape({
	name: Yup.string().required("Category name is required"),
	description: Yup.string().optional(),
});

const CategoryPage = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { categories, error, selectedCategory } = useSelector(
		(state: RootState) => state.category,
	);
	const { showToast } = useToast();
	const [isEditing, setIsEditing] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(categorySchema),
		defaultValues: selectedCategory || { name: "", description: "" },
	});

	useEffect(() => {
		if (selectedCategory) {
			reset(selectedCategory);
		}
	}, [selectedCategory, reset]);

	const handleAddCategory = async (data: CreateCategoryRequest) => {
		await dispatch(addCategory(data))
			.unwrap()
			.then(() => {
				showToast("Category added successfully");
				reset();
			})
			.catch((error) => showToast(error));
	};

	const handleUpdateCategory = async (data: UpdateCategoryRequest) => {
		if (!selectedCategory) return;
		await dispatch(
			updateCategory({ categoryId: selectedCategory.id, categoryData: data }),
		)
			.unwrap()
			.then(() => {
				showToast("Category updated successfully");
				setIsEditing(false);
				reset();
			})
			.catch((error) => showToast(error));
	};

	const handleDeleteCategory = async (categoryId: string) => {
		await dispatch(deleteCategory(categoryId))
			.unwrap()
			.then(() => showToast("Category deleted successfully"))
			.catch((error) => showToast(error));
	};

	const handleSearch = async (query: string) => {
		await dispatch(searchCategories(query));
	};

	const handleSelectCategory = (category: Category) => {
		dispatch(selectCategory(category));
		setIsEditing(true);
	};

	const handleClearError = () => {
		dispatch(clearError());
	};

	return (
		<Container className="mt-5">
			<Row>
				<Col md={12}>
					<Card>
						<Card.Header as="h3">Manage Categories</Card.Header>
						<Card.Body>
							{error && <Alert variant="danger">{error}</Alert>}
							<Form
								onSubmit={handleSubmit(
									isEditing ? handleUpdateCategory : handleAddCategory,
								)}
							>
								<Form.Group controlId="categoryName">
									<Form.Label>Category Name</Form.Label>
									<Form.Control
										type="text"
										{...register("name")}
										isInvalid={!!errors.name}
										placeholder="Enter category name"
									/>
									<Form.Control.Feedback type="invalid">
										{errors.name?.message}
									</Form.Control.Feedback>
								</Form.Group>

								<Form.Group controlId="categoryDescription" className="mt-3">
									<Form.Label>Description</Form.Label>
									<Form.Control
										as="textarea"
										{...register("description")}
										isInvalid={!!errors.description}
										placeholder="Enter category description"
									/>
									<Form.Control.Feedback type="invalid">
										{errors.description?.message}
									</Form.Control.Feedback>
								</Form.Group>

								<Button variant="primary" type="submit" className="mt-3">
									{isEditing ? "Update Category" : "Add Category"}
								</Button>
								<Button
									variant="secondary"
									className="mt-3 ms-2"
									onClick={() => reset()}
								>
									Reset
								</Button>
							</Form>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row className="mt-5">
				<Col md={12}>
					<Card>
						<Card.Body>
							<Form.Control
								type="text"
								placeholder="Search categories"
								onChange={(e) => handleSearch(e.target.value)}
							/>
							<Table striped bordered hover className="mt-3">
								<thead>
									<tr>
										<th>Name</th>
										<th>Description</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{categories.map((category) => (
										<tr key={category.id}>
											<td>{category.name}</td>
											<td>{category.description}</td>
											<td>
												<Button
													variant="warning"
													onClick={() => handleSelectCategory(category)}
													className="me-2"
												>
													Edit
												</Button>
												<Button
													variant="danger"
													onClick={() => handleDeleteCategory(category.id)}
												>
													Delete
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
		</Container>
	);
};

export default CategoryPage;
