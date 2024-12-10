import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import {
	Alert,
	Button,
	Card,
	Col,
	Container,
	Form,
	Row,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import Header from "~/components/Header";
import ResetPasswordForm from "~/components/ResetPasswordForm";
import { UpdateUserRequest } from "~/services/userApi";
import { updateUserInAuth } from "~/store/slices/authSlice";
import { updateUser } from "~/store/slices/userSlice";
import { AppDispatch, RootState } from "~/store/store";
import yupConfig from "~/validations/schema/yupConfig";
const profileUpdateSchema = Yup.object().shape({
	username: yupConfig.string().username().optional(),
	email: yupConfig.string().emailTest().optional(),
	firstName: yupConfig.string().firstName().optional(),
	lastName: yupConfig.string().lastName().optional(),
	gender: yupConfig.string().gender().optional(),
});

const Profile = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { loading, error } = useSelector((state: RootState) => state.user);
	const { user } = useSelector((state: RootState) => state.auth);
	const [isEditing, setIsEditing] = useState(false);
	const [isResettingPassword, setIsResettingPassword] = useState(false);
	const {
		register: registerProfile,
		handleSubmit: handleProfileSubmit,
		formState: { errors: profileErrors, isDirty },
		reset: resetProfileForm,
	} = useForm({
		resolver: yupResolver(profileUpdateSchema),
		mode: "onChange",
		defaultValues: user || {},
	});

	const handleEditClick = () => {
		setIsEditing(true);
		resetProfileForm();
	};

	// Handle Profile Update
	const onProfileUpdate = async (data: UpdateUserRequest) => {
		if (!user?.id) return;
		try {
			const result = await dispatch(
				updateUser({
					userId: user.id,
					userData: data,
				}),
			).unwrap();
			dispatch(updateUserInAuth(result.data.user));
			setIsEditing(false);
		} catch (err) {
			console.error("Update failed", err);
		}
	};

	useEffect(() => {
		if (user) {
			resetProfileForm(user);
		}
	}, [user, resetProfileForm]);

	//Handle reset password form
	const onPasswordReset = async (passwordData: {
		currentPassword: string;
		newPassword: string;
		confirmPassword: string;
	}) => {
		try {
			console.log("Password reset data:", passwordData);
		} catch (err) {
			console.error("Password reset failed", err);
		}
	};

	if (!user) {
		return (
			<Container className="mt-5">
				<Alert variant="warning">Không tìm thấy thông tin người dùng</Alert>
			</Container>
		);
	}

	return (
		<>
			<Header />
			<Container className="mt-5">
				<Row className="justify-content-md-center">
					<Col md={8}>
						<Card>
							<Card.Header as="h3">Thông Tin Cá Nhân</Card.Header>
							<Card.Body>
								{error && <Alert variant="danger">{error}</Alert>}

								<Form onSubmit={handleProfileSubmit(onProfileUpdate)}>
									{!isEditing ? (
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
											<Button variant="primary" onClick={handleEditClick}>
												Chỉnh Sửa Thông Tin
											</Button>
										</>
									) : (
										<>
											<Form.Group as={Row} className="mb-3">
												<Form.Label column sm="4">
													Tên Đăng Nhập
												</Form.Label>
												<Col sm="8">
													<Form.Control
														type="text"
														{...registerProfile("username")}
														isInvalid={!!profileErrors.username}
													/>
													<Form.Control.Feedback type="invalid">
														{profileErrors.username?.message}
													</Form.Control.Feedback>
												</Col>
											</Form.Group>
											<Form.Group as={Row} className="mb-3">
												<Form.Label column sm="4">
													Email
												</Form.Label>
												<Col sm="8">
													<Form.Control
														type="email"
														{...registerProfile("email")}
														isInvalid={!!profileErrors.email}
													/>
													<Form.Control.Feedback type="invalid">
														{profileErrors.email?.message}
													</Form.Control.Feedback>
												</Col>
											</Form.Group>
											<Form.Group as={Row} className="mb-3">
												<Form.Label column sm="4">
													Họ
												</Form.Label>
												<Col sm="8">
													<Form.Control
														type="text"
														{...registerProfile("lastName")}
														isInvalid={!!profileErrors.lastName}
													/>
													<Form.Control.Feedback type="invalid">
														{profileErrors.lastName?.message}
													</Form.Control.Feedback>
												</Col>
											</Form.Group>
											<Form.Group as={Row} className="mb-3">
												<Form.Label column sm="4">
													Tên
												</Form.Label>
												<Col sm="8">
													<Form.Control
														type="text"
														{...registerProfile("firstName")}
														isInvalid={!!profileErrors.firstName}
													/>
													<Form.Control.Feedback type="invalid">
														{profileErrors.firstName?.message}
													</Form.Control.Feedback>
												</Col>
											</Form.Group>
											<Form.Group as={Row} className="mb-3">
												<Form.Label column sm="4">
													Giới Tính
												</Form.Label>
												<Col sm="8">
													<Form.Select
														{...registerProfile("gender")}
														isInvalid={!!profileErrors.gender}
													>
														<option value="">Chọn giới tính</option>
														<option value="Male">Nam</option>
														<option value="Female">Nữ</option>
														<option value="Other">Khác</option>
													</Form.Select>
													<Form.Control.Feedback type="invalid">
														{profileErrors.gender?.message}
													</Form.Control.Feedback>
												</Col>
											</Form.Group>
											<div className="d-flex justify-content-between">
												<Button
													variant="success"
													type="submit"
													disabled={loading || !isDirty}
												>
													{loading ? "Đang lưu..." : "Lưu Thay Đổi"}
												</Button>
												<Button
													variant="secondary"
													onClick={() => {
														setIsEditing(false);
														resetProfileForm();
													}}
												>
													Hủy
												</Button>
											</div>
										</>
									)}
								</Form>
							</Card.Body>
						</Card>

						{/* Phần Reset Mật Khẩu */}
						<Card className="mt-4">
							<Card.Header as="h3">Đặt Lại Mật Khẩu</Card.Header>
							<Card.Body>
								<ResetPasswordForm
									onPasswordReset={onPasswordReset}
									isResettingPassword={isResettingPassword}
									onResettingPasswordChange={setIsResettingPassword}
								/>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>
		</>
	);
};

export default Profile;
