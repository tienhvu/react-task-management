import { Card, Col, Container, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { AppDispatch } from "~/store/store";
import { useToast } from "~/components/Toast";
import { addCategory } from "~/store/slices/categorySlice";
import CategoryForm from "./CategoryForm";
import type { CategoryFormData } from "./CategoryForm";

import { SCREEN_PATHS } from "~/utils/constants/constants";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const { showToast } = useToast();
	const handleAddCategory = async (data: CategoryFormData) => {
		try {
			await dispatch(addCategory(data)).unwrap();
			showToast("Thêm danh mục thành công");
			navigate(SCREEN_PATHS.CATEGORY);
		} catch {
			showToast("Thêm danh mục thất bại!", "danger");
		}
	};

	return (
		<Container className="mt-5">
			<Row className="justify-content-md-center">
				<Col md={8}>
					<Card>
						<Card.Header as="h3">Thêm Danh Mục Mới</Card.Header>
						<Card.Body>
							<CategoryForm
								onSubmit={handleAddCategory}
								buttonLabel="Thêm Mới"
							/>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};

export default AddCategory;
