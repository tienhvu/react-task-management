import React from "react";
import { Button, Card, Container } from "react-bootstrap";
import useLoggedIn from "~/hook/useLoggedIn";

const HomePage: React.FC = () => {
	const isLoggedIn = useLoggedIn();

	return (
		<Container className="mt-5">
			{!isLoggedIn ? (
				<Card className="text-center">
					<Card.Body>
						<Card.Title>Chào mừng đến với trang Public</Card.Title>
						<Card.Text>
							Đây là một trang công khai mà ai cũng có thể truy cập.
						</Card.Text>
						<Button variant="primary" href="/login">
							Đăng nhập
						</Button>
					</Card.Body>
				</Card>
			) : (
				<Card className="text-center">
					<Card.Body>
						<Card.Title>Chào mừng đến với trang Private</Card.Title>
						<Card.Text>
							Bạn đã đăng nhập và có thể truy cập các nội dung riêng tư.
						</Card.Text>
					</Card.Body>
				</Card>
			)}
		</Container>
	);
};

export default HomePage;
