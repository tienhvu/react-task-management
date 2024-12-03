import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { login } from "~/store/slices/authSlice";
import { AppDispatch, RootState } from "~/store/store";
import { Account } from "~/types/interface/Account";

const loginSchema = Yup.object().shape({
	username: Yup.string()
		.required("Tên đăng nhập không được để trống")
		.min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
	password: Yup.string()
		.required("Mật khẩu không được để trống")
		.min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export const LoginForm: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const { error, loading: isLoading } = useSelector(
		(state: RootState) => state.auth,
	);

	const [showSuccessAlert, setShowSuccessAlert] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(loginSchema),
		mode: "onChange",
	});

	const onSubmit = async (data: Account) => {
		const actionResult = await dispatch(login(data));
		if (login.fulfilled.match(actionResult)) {
			setShowSuccessAlert(true);

			setTimeout(() => {
				setShowSuccessAlert(false);
				navigate("/manage-task");
			}, 2000);
		}
	};

	return (
		<div className="d-flex justify-content-center align-items-center vh-100 bg-light">
			<Form
				onSubmit={handleSubmit(onSubmit)}
				className="p-4 border rounded shadow bg-white d-flex flex-column gap-3"
				style={{ width: "500px" }}
			>
				<h1 className="text-center font-bold mb-6">Đăng Nhập</h1>

				{showSuccessAlert && (
					<Alert
						variant="success"
						onClose={() => setShowSuccessAlert(false)}
						dismissible
					>
						Đăng nhập thành công!
					</Alert>
				)}

				{error && (
					<Alert
						variant="danger"
						onClose={() => dispatch({ type: "auth/clearError" })}
						dismissible
					>
						{error}
					</Alert>
				)}
				<Form.Group>
					<Form.Label>Tên đăng nhập</Form.Label>
					<Form.Control
						type="text"
						{...register("username")}
						isInvalid={!!errors.username}
						placeholder="Nhập tên đăng nhập"
					/>
					<Form.Control.Feedback type="invalid">
						{errors.username?.message}
					</Form.Control.Feedback>
				</Form.Group>

				<Form.Group>
					<Form.Label>Mật khẩu</Form.Label>
					<Form.Control
						type="password"
						{...register("password")}
						isInvalid={!!errors.password}
						placeholder="Nhập mật khẩu"
					/>
					<Form.Control.Feedback type="invalid">
						{errors.password?.message}
					</Form.Control.Feedback>
				</Form.Group>

				<Button
					variant="primary"
					type="submit"
					className="w-full mt-3"
					disabled={isLoading}
				>
					{isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
				</Button>

				<div className="text-center mt-4">
					<p>
						Chưa có tài khoản?{" "}
						<NavLink
							to="/register"
							className="text-blue-600 hover:underline"
							onClick={() => dispatch({ type: "auth/clearError" })}
						>
							Đăng ký
						</NavLink>
					</p>
				</div>
			</Form>
		</div>
	);
};

export default LoginForm;
