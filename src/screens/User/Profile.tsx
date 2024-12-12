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
import ResetPasswordForm from "~/components/ResetPasswordForm";
import { useToast } from "~/components/Toast";
import { UpdateUserRequest } from "~/services/userApi";
import {
	refreshToken,
	resetPassword,
	updateUser,
} from "~/store/slices/authSlice";
import { AppDispatch, RootState } from "~/store/store";
import yup from "~/validations/schema/yup";

const profileUpdateSchema = Yup.object().shape({
	username: yup.string().username().optional(),
	email: yup.string().emailTest().optional(),
	firstName: yup.string().firstName().optional(),
	lastName: yup.string().lastName().optional(),
	gender: yup.string().gender().optional(),
});

const Profile = () => {
	const { showToast } = useToast();
	const dispatch = useDispatch<AppDispatch>();
	const {
		isLoading,
		error,
		user,
		refreshToken: currentRefreshToken,
	} = useSelector((state: RootState) => state.auth);
	const [isEditing, setIsEditing] = useState(false);
	const [isResettingPassword, setIsResettingPassword] = useState(false);
	const [isChangingPassword, setIsChangingPassword] = useState(false);
	const {
		register: registerProfile,
		handleSubmit: handleProfileUpdate,
		formState: { errors: profileErrors, isDirty, isValid },
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
		if (!user || !user.id) return;
		const result = await dispatch(
			updateUser({
				userId: user.id,
				userData: data,
			}),
		);
		if (updateUser.fulfilled.match(result)) {
			showToast("Cập nhật người dùng thành công!");
		} else {
			showToast("Cập nhật người dùng thất bại!", "danger");
		}
		setIsEditing(false);
	};

	useEffect(() => {
		if (user) {
			resetProfileForm(user);
		}
	}, [user, resetProfileForm]);

	const handleBackClick = () => {
		setIsChangingPassword(false);
	};

	const onPasswordReset = async (passwordData: {
		currentPassword: string;
		newPassword: string;
		confirmPassword: string;
	}) => {
		if (!user || !user.id) return;
		try {
			const resetResult = await dispatch(
				resetPassword({
					userId: user.id,
					oldPassword: passwordData.currentPassword,
					newPassword: passwordData.newPassword,
				}),
			);

			if (resetPassword.fulfilled.match(resetResult)) {
				if (currentRefreshToken) {
					await dispatch(
						refreshToken({
							refreshToken: currentRefreshToken,
							userId: user.id,
						}),
					).unwrap();
				}

				showToast("Đổi mật khẩu thành công!");
				setIsChangingPassword(false);
			}
		} catch (err) {
			showToast("Đổi mật khẩu thất bại!", "danger");
			console.error("Password reset failed", err);
		}
	};

	if (!user || !user.id) {
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

							{!isEditing && !isChangingPassword ? (
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
									<Button
										className="ms-2"
										variant="success"
										onClick={() => setIsChangingPassword(true)}
									>
										Thay Đổi Mật Khẩu
									</Button>
								</>
							) : isEditing ? (
								<>
									<Form onSubmit={handleProfileUpdate(onProfileUpdate)}>
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
													<option value="" disabled>
														Chọn giới tính
													</option>
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
												disabled={isLoading || !isDirty || !isValid}
											>
												{isLoading ? "Đang lưu..." : "Lưu Thay Đổi"}
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
									</Form>
								</>
							) : isChangingPassword ? (
								<ResetPasswordForm
									onPasswordReset={onPasswordReset}
									isResettingPassword={isResettingPassword}
									onResettingPasswordChange={setIsResettingPassword}
									onBackClick={handleBackClick}
								/>
							) : null}
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};

export default Profile;
