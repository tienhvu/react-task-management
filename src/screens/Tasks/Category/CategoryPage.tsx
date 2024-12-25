import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "~/store/slices/categorySlice";
import { AppDispatch, RootState } from "~/store/store";
import { Category } from "~/types/Category";
import AddCategory from "./AddCategory";
import CategoryDeleteModal from "./CategoryDeleteModal";
import CategoryEditModal from "./CategoryEditModal";
import { useSearchParams } from "react-router-dom";

const CategoryPage = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { categories } = useSelector((state: RootState) => state.category);
	const [isOpenEditModal, setIsOpenEditModal] = useState(false);
	const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
	const [categorySelected, setCategorySelected] = useState<Category>();
	const [searchParams] = useSearchParams();

	useEffect(() => {
		const query = searchParams.get("query") || "";
		dispatch(getCategories({ query }));
	}, [searchParams, dispatch]);

	const handleOpenModal = (type: "edit" | "delete", category: Category) => {
		setCategorySelected(category);
		if (type === "edit") {
			setIsOpenEditModal(true);
		} else if (type === "delete") {
			setIsOpenDeleteModal(true);
		}
	};

	return (
		<Container className="mt-5">
			{/* Phần form thêm mới */}
			<Row>
				<Col md={12}>
					<AddCategory />
				</Col>
			</Row>

			{/* Danh sách danh mục */}
			<Row className="mt-5">
				<Col md={12}>
					<Card>
						<Card.Body>
							{/* Thanh tìm kiếm */}
							<SearchBar placeholder="Tìm kiếm danh mục ..." />

							{/* Bảng danh mục */}
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
													onClick={() => handleOpenModal("edit", category)}
													className="me-2"
												>
													Chỉnh Sửa
												</Button>
												<Button
													variant="danger"
													onClick={() => handleOpenModal("delete", category)}
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
			{isOpenEditModal && categorySelected && (
				<CategoryEditModal
					isOpen={isOpenEditModal}
					category={categorySelected}
					onClose={() => setIsOpenEditModal(false)}
				/>
			)}

			{isOpenDeleteModal && categorySelected && (
				<CategoryDeleteModal
					isOpen={isOpenDeleteModal}
					category={categorySelected}
					onClose={() => setIsOpenDeleteModal(false)}
				/>
			)}
		</Container>
	);
};

export default CategoryPage;
