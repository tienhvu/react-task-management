import { useState } from "react";
import {
	Container,
	Dropdown,
	DropdownToggle,
	Image,
	Nav,
	Navbar,
	Modal,
	Button,
} from "react-bootstrap";
import { BoxArrowRight, PersonCircle } from "react-bootstrap-icons";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import profileImage from "~/assets/profile.png";
import { logout } from "~/store/slices/authSlice";
import { AppDispatch } from "~/store/store";

const Header = () => {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const [user, setUser] = useState(() => {
		const authData = localStorage.getItem("auth");
		return authData ? JSON.parse(authData).user : null;
	});

	const [showLogoutModal, setShowLogoutModal] = useState(false);

	const handleProfileClick = () => {
		navigate("/profile");
	};

	const handleLogoutClick = () => {
		setShowLogoutModal(true);
	};

	const confirmLogout = async () => {
		try {
			const actionResult = await dispatch(logout());
			if (logout.fulfilled.match(actionResult)) {
				setUser(null);
				navigate("/login");
			} else {
				console.error("Logout failed");
			}
		} catch (error) {
			console.error("Logout error:", error);
		}
		setShowLogoutModal(false);
	};

	const cancelLogout = () => {
		setShowLogoutModal(false);
	};

	return (
		<>
			<Navbar bg="light" expand="lg" className="shadow-sm">
				<Container fluid>
					<Navbar.Brand href="#">Header</Navbar.Brand>
					<Nav className="align-items-center">
						<Dropdown>
							<DropdownToggle
								as={Nav.Link}
								className="d-flex align-items-center p-0"
							>
								<Image
									src={profileImage}
									className="rounded-circle img-fluid"
									alt="Profile Image"
									style={{ width: "40px", position: "relative" }}
								/>
							</DropdownToggle>
							<Dropdown.Menu
								align="end"
								className="mt-2"
								style={{ position: "absolute" }}
							>
								<Dropdown.Item onClick={handleProfileClick}>
									<div className="d-flex gap-2 align-items-center">
										<Image
											src={profileImage}
											className="rounded-circle img-fluid"
											alt="Profile Image"
											style={{ width: "40px", height: "40px" }}
										/>
										<div className="d-flex flex-column">
											<span> {user?.username}</span>
											<span>{`${user?.firstName} ${user?.lastName}`}</span>
										</div>
									</div>
								</Dropdown.Item>
								<Dropdown.Divider />
								<Dropdown.Item onClick={handleProfileClick}>
									<PersonCircle size={20} className="me-2" />
									Thông tin cá nhân
								</Dropdown.Item>
								<Dropdown.Divider />
								<Dropdown.Item onClick={handleLogoutClick}>
									<BoxArrowRight size={20} className="me-2" />
									Đăng xuất
								</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					</Nav>
				</Container>
			</Navbar>

			{/* Logout Confirmation Modal */}
			<Modal show={showLogoutModal} onHide={cancelLogout}>
				<Modal.Header closeButton>
					<Modal.Title>Confirm Logout</Modal.Title>
				</Modal.Header>
				<Modal.Body>Are you sure you want to logout?</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={cancelLogout}>
						Cancel
					</Button>
					<Button variant="danger" onClick={confirmLogout}>
						Logout
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default Header;
