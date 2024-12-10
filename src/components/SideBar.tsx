import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";

import { logout } from "~/store/slices/authSlice";
import { AppDispatch, RootState } from "~/store/store";

const sidebarStyle = {
	position: "fixed" as const,
	top: 0,
	left: 0,
	width: "250px",
	height: "100vh",
	backgroundColor: "#f8f9fa",
	boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
};

const hoverStyle = {
	transition: "background-color 0.3s, color 0.3s",
};

const Sidebar: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const auth = useSelector((state: RootState) => state.auth);
	const isLoggedIn = !!auth?.accessToken;
	const [showLogoutModal, setShowLogoutModal] = useState(false);

	const handleLogout = () => {
		setShowLogoutModal(true);
	};

	const confirmLogout = async () => {
		try {
			const actionResult = await dispatch(logout());
			if (logout.fulfilled.match(actionResult)) {
				navigate("/");
			}
		} catch (error) {
			console.error("Logout error:", error);
		}
		closeLogoutModal();
	};

	const closeLogoutModal = () => {
		setShowLogoutModal(false);
	};

	const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
		isActive
			? "nav-link active bg-primary text-white rounded px-3 py-2"
			: "nav-link px-3 py-2";

	return (
		<div style={sidebarStyle}>
			<div className="p-3">
				<h4 className="text-center mb-4">Sidebar</h4>
				<nav>
					<ul className="nav flex-column">
						{isLoggedIn ? (
							<>
								<li className="nav-item mb-2" style={hoverStyle}>
									<NavLink to="/" className={navLinkClassName}>
										Trang chủ
									</NavLink>
								</li>
								<li className="nav-item mb-2" style={hoverStyle}>
									<NavLink to="/tasks" className={navLinkClassName}>
										Task Manager
									</NavLink>
								</li>
								<li className="nav-item mb-2" style={hoverStyle}>
									<NavLink to="/profile" className={navLinkClassName}>
										Profile
									</NavLink>
								</li>
								<li className="nav-item" style={hoverStyle}>
									<Button
										variant="link"
										onClick={handleLogout}
										className="nav-link text-danger text-start w-100 px-3 py-2"
										style={{ ...hoverStyle }}
									>
										Log out
									</Button>
								</li>
							</>
						) : (
							<>
								<li className="nav-item mb-2" style={hoverStyle}>
									<NavLink to="/" className={navLinkClassName}>
										Trang chủ
									</NavLink>
								</li>
								<li className="nav-item" style={hoverStyle}>
									<NavLink to="/login" className={navLinkClassName}>
										Đăng nhập
									</NavLink>
								</li>
							</>
						)}
					</ul>
				</nav>
			</div>

			{/* Modal đăng xuất */}
			<Modal show={showLogoutModal} onHide={closeLogoutModal}>
				<Modal.Header closeButton>
					<Modal.Title>Xác nhận đăng xuất</Modal.Title>
				</Modal.Header>
				<Modal.Body>Bạn có chắc chắn muốn đăng xuất?</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={closeLogoutModal}>
						Hủy
					</Button>
					<Button variant="danger" onClick={confirmLogout}>
						Đăng xuất
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default Sidebar;
