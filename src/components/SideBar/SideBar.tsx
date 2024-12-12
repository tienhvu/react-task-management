import React, { useState } from "react";
import { Button, Dropdown, Image, Modal, Nav } from "react-bootstrap";
import { BoxArrowRight, PersonCircle } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import profileImage from "~/assets/profile.png";
import { logout, selectIsAuthenticated } from "~/store/slices/authSlice";
import { AppDispatch, RootState } from "~/store/store";
import { profileStyle, sidebarStyle } from "./style";

const Sidebar: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const location = useLocation();
	const auth = useSelector((state: RootState) => state.auth);
	const user = auth.user;
	const isLoggedIn = useSelector(selectIsAuthenticated);
	const [isOpenLogoutModal, setIsOpenLogoutModal] = useState(false);

	const getNavLinks = () => {
		if (isLoggedIn) {
			return [
				{ key: "/", label: "Trang chủ" },
				{ key: "/tasks", label: "Task Manager" },
				{ key: "/categories", label: "Category Manager" },
			];
		} else {
			return [
				{ key: "/", label: "Trang chủ" },
				{ key: "/login", label: "Đăng nhập" },
			];
		}
	};

	const handleProfileClick = () => {
		navigate("/profile");
	};

	const openLogoutModal = () => {
		setIsOpenLogoutModal(true);
	};

	const handleLogout = async () => {
		try {
			const actionResult = await dispatch(logout());
			if (logout.fulfilled.match(actionResult)) {
				navigate("/");
			}
		} catch (error) {
			console.error("Logout error:", error);
		}
		setIsOpenLogoutModal(false);
	};

	const closeLogoutModal = () => {
		setIsOpenLogoutModal(false);
	};

	return (
		<div style={sidebarStyle}>
			<div className="p-3">
				{/* User Profile Dropdown */}
				{isLoggedIn && (
					<Dropdown className="m-3" style={profileStyle}>
						<Dropdown.Toggle
							as="div"
							className="d-flex align-items-center cursor-pointer"
						>
							<Image
								src={profileImage}
								className="rounded-circle img-fluid me-2"
								alt="Profile Image"
								style={{ width: "40px", height: "40px" }}
							/>
							<div className="d-flex flex-column">
								<span>{user?.username}</span>
								<small className="text-muted">
									{`${user?.firstName} ${user?.lastName}`}
								</small>
							</div>
						</Dropdown.Toggle>
						<Dropdown.Menu className="w-100">
							<Dropdown.Item onClick={handleProfileClick}>
								<PersonCircle size={20} className="me-2" />
								Thông tin cá nhân
							</Dropdown.Item>
							<Dropdown.Divider />
							<Dropdown.Item onClick={openLogoutModal} className="text-danger">
								<BoxArrowRight size={20} className="me-2" />
								Đăng xuất
							</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				)}

				{/* Navigation Links */}
				<Nav activeKey={location.pathname} className="flex-column">
					{getNavLinks().map((link) => (
						<Nav.Item key={link.key} className="mb-2">
							<Nav.Link
								eventKey={link.key}
								onClick={() => navigate(link.key)}
								className={`px-3 py-2 ${location.pathname === link.key ? "bg-primary text-white rounded" : ""}`}
							>
								{link.label}
							</Nav.Link>
						</Nav.Item>
					))}
				</Nav>
			</div>

			{/* Logout Confirmation Modal */}
			<Modal show={isOpenLogoutModal} onHide={closeLogoutModal}>
				<Modal.Header closeButton>
					<Modal.Title>Xác nhận đăng xuất</Modal.Title>
				</Modal.Header>
				<Modal.Body>Bạn có chắc chắn muốn đăng xuất?</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={closeLogoutModal}>
						Hủy
					</Button>
					<Button variant="danger" onClick={handleLogout}>
						Đăng xuất
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default Sidebar;
