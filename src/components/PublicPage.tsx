import { Card, Container } from "react-bootstrap";
import MainLayout from "~/layouts/MainLayout";

const PublicPage = () => {
	return (
		<MainLayout>
			<Container className="mt-5">
				<Card className="text-center">
					<Card.Body>
						<Card.Title>Chào mừng đến với trang Public</Card.Title>
						<Card.Text>
							Đây là một trang công khai mà ai cũng có thể truy cập.
						</Card.Text>
					</Card.Body>
				</Card>
			</Container>
		</MainLayout>
	);
};

export default PublicPage;
