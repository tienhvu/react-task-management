import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Button, Form, Row, Col, Container, Card } from "react-bootstrap";
import { useToast } from "~/components/Toast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "~/store/store";
import { refreshToken, resetPassword } from "~/store/slices/authSlice";
import { useNavigate } from "react-router-dom";

const passwordResetSchema = Yup.object().shape({
	currentPassword: Yup.string().required(
		"Mật khẩu hiện tại không được để trống",
	),
	newPassword: Yup.string()
		.required("Mật khẩu mới không được để trống")
		.min(6, "Mật khẩu phải có ít nhất 6 ký tự")
		.notOneOf(
			[Yup.ref("currentPassword")],
			"Mật khẩu mới không được giống mật khẩu cũ",
		),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref("newPassword")], "Mật khẩu xác nhận không khớp")
		.required("Xác nhận mật khẩu không được để trống"),
});

const ResetPassword = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		watch,
		trigger,
	} = useForm({
		resolver: yupResolver(passwordResetSchema),
		mode: "onChange",
		reValidateMode: "onChange",
	});

	const navigate = useNavigate();
	const { showToast } = useToast();
	const dispatch = useDispatch<AppDispatch>();
	const [isResettingPassword, setIsResettingPassword] = useState(false);
	const passwordValue = watch("newPassword");
	const rePasswordValue = watch("confirmPassword");
	const currentPasswordValue = watch("currentPassword");
	const newPasswordValue = watch("newPassword");

	const { user, refreshToken: currentRefreshToken } = useSelector(
		(state: RootState) => state.auth,
	);

	useEffect(() => {
		if (currentPasswordValue && newPasswordValue) {
			trigger("newPassword");
		}
	}, [currentPasswordValue, newPasswordValue, trigger]);

	useEffect(() => {
		if (passwordValue && rePasswordValue) {
			trigger("confirmPassword");
		}
	}, [passwordValue, rePasswordValue, trigger]);

	const onPasswordReset = async (passwordData: {
		currentPassword: string;
		newPassword: string;
		confirmPassword: string;
	}) => {
		if (!user?.id) return;
		setIsResettingPassword(true);
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
			} else {
				throw new Error("Password reset failed");
			}
		} catch (err) {
			console.error("Password reset failed", err);
			showToast("Đổi mật khẩu thất bại!", "danger");
		} finally {
			setIsResettingPassword(false);
		}
	};

	return (
		<Container className="mt-5">
			<Row className="justify-content-md-center">
				<Col md={8}>
					<Card>
						<Card.Header as="h3">Chỉnh sửa thông tin</Card.Header>
						<Card.Body>
							<Form onSubmit={handleSubmit(onPasswordReset)}>
								<Row>
									<Col>
										<Form.Group className="mb-3">
											<Form.Label>Mật Khẩu Hiện Tại</Form.Label>
											<Form.Control
												type="password"
												{...register("currentPassword")}
												isInvalid={!!errors.currentPassword}
											/>
											<Form.Control.Feedback type="invalid">
												{errors.currentPassword?.message}
											</Form.Control.Feedback>
										</Form.Group>
									</Col>
								</Row>
								<Row>
									<Col>
										<Form.Group className="mb-3">
											<Form.Label>Mật Khẩu Mới</Form.Label>
											<Form.Control
												type="password"
												{...register("newPassword")}
												isInvalid={!!errors.newPassword}
											/>
											<Form.Control.Feedback type="invalid">
												{errors.newPassword?.message}
											</Form.Control.Feedback>
										</Form.Group>
									</Col>
								</Row>
								<Row>
									<Col>
										<Form.Group className="mb-3">
											<Form.Label>Xác Nhận Mật Khẩu Mới</Form.Label>
											<Form.Control
												type="password"
												{...register("confirmPassword")}
												isInvalid={!!errors.confirmPassword}
											/>
											<Form.Control.Feedback type="invalid">
												{errors.confirmPassword?.message}
											</Form.Control.Feedback>
										</Form.Group>
									</Col>
								</Row>

								<Row className="mt-3">
									<Col xs="auto">
										<Button
											type="submit"
											variant="danger"
											disabled={!isValid || isResettingPassword}
										>
											{isResettingPassword
												? "Đang xử lý..."
												: "Đặt Lại Mật Khẩu"}
										</Button>
									</Col>
									<Col xs="auto">
										<Button
											variant="secondary"
											onClick={() => navigate("/profile")}
										>
											Quay lại
										</Button>
									</Col>
								</Row>
							</Form>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};

export default ResetPassword;
