import {
	Alert,
	Button,
	Card,
	Col,
	Container,
	Form,
	Row,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "~/store/store";
import { PATH } from "~/utils/constants/constants";

const Profile = () => {
	const { error, user } = useSelector((state: RootState) => state.auth);
	const navigate = useNavigate();
	if (!user?.id) {
		return (
			<Container className="mt-5">
				<Alert variant="warning">Không tìm thấy thông tin người dùng</Alert>
			</Container>
		);
	}

	return (
		<Container className="mt-5">
			<Row className="justify-content-md-center">
				<Col md={8}>
					<Card>
						<Card.Header as="h3">Thông Tin Cá Nhân</Card.Header>
						<Card.Body>
							{error && <Alert variant="danger">{error}</Alert>}
							<>
								<Form.Group as={Row} className="mb-3">
									<Form.Label column sm="4">
										ID:
									</Form.Label>
									<Col sm="8">{user.id}</Col>
								</Form.Group>
								<Form.Group as={Row} className="mb-3">
									<Form.Label column sm="4">
										Tên Đăng Nhập:
									</Form.Label>
									<Col sm="8">{user.username}</Col>
								</Form.Group>
								<Form.Group as={Row} className="mb-3">
									<Form.Label column sm="4">
										Email:
									</Form.Label>
									<Col sm="8">{user.email}</Col>
								</Form.Group>
								<Form.Group as={Row} className="mb-3">
									<Form.Label column sm="4">
										Họ:
									</Form.Label>
									<Col sm="8">{user.lastName}</Col>
								</Form.Group>
								<Form.Group as={Row} className="mb-3">
									<Form.Label column sm="4">
										Tên:
									</Form.Label>
									<Col sm="8">{user.firstName}</Col>
								</Form.Group>
								<Form.Group as={Row} className="mb-3">
									<Form.Label column sm="4">
										Giới Tính:
									</Form.Label>
									<Col sm="8">{user.gender}</Col>
								</Form.Group>
								<Form.Group as={Row} className="mb-3">
									<Form.Label column sm="4">
										Ngày Tạo:
									</Form.Label>
									<Col sm="8">
										{user.createdAt
											? new Date(user.createdAt).toLocaleString()
											: "N/A"}
									</Col>
								</Form.Group>
								<Form.Group as={Row} className="mb-3">
									<Form.Label column sm="4">
										Ngày Cập Nhật:
									</Form.Label>
									<Col sm="8">
										{user.updatedAt
											? new Date(user.updatedAt).toLocaleString()
											: "N/A"}
									</Col>
								</Form.Group>
								<Button
									variant="primary"
									onClick={() => navigate(PATH.EDIT_USER)}
								>
									Chỉnh Sửa Thông Tin
								</Button>
								<Button
									className="ms-2"
									variant="success"
									onClick={() => navigate(PATH.RESET_PASSWORD)}
								>
									Thay Đổi Mật Khẩu
								</Button>
							</>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};

export default Profile;
