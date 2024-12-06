import { Container, Card, Button } from "react-bootstrap";

const PublicPage = () => {
	return (
		<Container className="mt-5">
			<Card className="text-center">
				<Card.Body>
					<Card.Title>Chào mừng đến với trang Public</Card.Title>
					<Card.Text>
						Đây là một trang công khai mà ai cũng có thể truy cập.
					</Card.Text>
					<Button variant="primary" href="/login">
						Tìm hiểu thêm
					</Button>
				</Card.Body>
			</Card>
		</Container>
	);
};

export default PublicPage;
