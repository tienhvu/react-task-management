import { Container, Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
	const navigate = useNavigate();

	return (
		<Container className="text-center mt-5">
			<Alert variant="danger">
				<h1>404 - Không tìm thấy trang</h1>
				<p>Trang bạn đang tìm không tồn tại.</p>
			</Alert>
			<Button variant="primary" onClick={() => navigate("/")}>
				Quay lại Trang chủ
			</Button>
		</Container>
	);
};

export default NotFoundPage;
