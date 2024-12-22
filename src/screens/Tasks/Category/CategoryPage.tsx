import { useState } from "react";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "~/store/store";
import { Category } from "~/types/Category";
import SearchBar from "~/screens/Tasks/Category/SearchBar";
import AddCategory from "./AddCategory";
import CategoryDeleteModal from "./CategoryDeleteModal";
import CategoryEditModal from "./CategoryEditModal";

const CategoryPage = () => {
	const { categories } = useSelector((state: RootState) => state.category);
	const [isOpenEditCategoryModal, setIsOpenEditCategoryModal] =
		useState<Category | null>(null);
	const [isOpenDeleteCategoryModal, setIsOpenDeleteCategoryModal] =
		useState<Category | null>(null);

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
							<SearchBar />
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
													onClick={() => setIsOpenEditCategoryModal(category)}
													className="me-2"
												>
													Chỉnh Sửa
												</Button>
												<Button
													variant="danger"
													onClick={() => setIsOpenDeleteCategoryModal(category)}
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
			{isOpenEditCategoryModal && (
				<CategoryEditModal
					isOpen={!!isOpenEditCategoryModal}
					category={isOpenEditCategoryModal}
					onClose={() => setIsOpenEditCategoryModal(null)}
				/>
			)}

			{isOpenDeleteCategoryModal && (
				<CategoryDeleteModal
					isOpen={!!isOpenDeleteCategoryModal}
					category={isOpenDeleteCategoryModal}
					onClose={() => setIsOpenDeleteCategoryModal(null)}
				/>
			)}
		</Container>
	);
};

export default CategoryPage;
