import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Button, Form, Row, Col } from "react-bootstrap";

const passwordResetSchema = Yup.object().shape({
	currentPassword: Yup.string().required(
		"Mật khẩu hiện tại không được để trống",
	),
	newPassword: Yup.string()
		.required("Mật khẩu mới không được để trống")
		.min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref("newPassword")], "Mật khẩu xác nhận không khớp")
		.required("Xác nhận mật khẩu không được để trống"),
});

interface ResetPasswordFormProps {
	onPasswordReset: (data: {
		currentPassword: string;
		newPassword: string;
		confirmPassword: string;
	}) => Promise<void>;
	isResettingPassword: boolean;
	onResettingPasswordChange?: (isResetting: boolean) => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
	onPasswordReset,
	isResettingPassword,
	onResettingPasswordChange,
}) => {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		reset,
		watch,
		trigger,
	} = useForm({
		resolver: yupResolver(passwordResetSchema),
		mode: "onChange",
		reValidateMode: "onChange",
	});

	const passwordValue = watch("newPassword");
	const rePasswordValue = watch("confirmPassword");

	useEffect(() => {
		if (passwordValue && rePasswordValue) {
			trigger("confirmPassword");
		}
	}, [passwordValue, rePasswordValue, trigger]);

	const handlePasswordResetSubmit = async (data: {
		currentPassword: string;
		newPassword: string;
		confirmPassword: string;
	}) => {
		onResettingPasswordChange?.(true);

		try {
			await onPasswordReset(data);
			reset();
		} catch (error) {
			console.error("Password reset failed", error);
		} finally {
			onResettingPasswordChange?.(false);
		}
	};

	return (
		<Form onSubmit={handleSubmit(handlePasswordResetSubmit)}>
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
			<Button
				type="submit"
				variant="danger"
				disabled={!isValid || isResettingPassword}
			>
				{isResettingPassword ? "Đang xử lý..." : "Đặt Lại Mật Khẩu"}
			</Button>
		</Form>
	);
};

export default ResetPasswordForm;
