import { Button, Card, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import PrivateLayout from "~/layouts/PrivateLayout";
import PublicLayout from "~/layouts/PublicLayout";
import { RootState } from "~/store/store";
const HomePage: React.FC = () => {
	const { user, accessToken } = useSelector((state: RootState) => state.auth);
	const isAuthenticated = !!user && !!accessToken;
	if (!isAuthenticated) {
		return (
			<PublicLayout>
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
			</PublicLayout>
		);
	}
	return (
		<PrivateLayout>
			<Container className="mt-5">
				<Card className="text-center">
					<Card.Body>
						<Card.Title>Chào mừng đến với trang chủ </Card.Title>
						<Card.Text>Đây là trang chủ sau khi đăng nhập.</Card.Text>
					</Card.Body>
				</Card>
			</Container>
		</PrivateLayout>
	);
};

export default HomePage;
