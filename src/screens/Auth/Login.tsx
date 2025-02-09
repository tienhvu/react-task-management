import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { useToast } from "~/components/Toast";
import { login } from "~/store/slices/authSlice";
import { AppDispatch, RootState } from "~/store/store";
import { Account } from "~/types/Account";
import yup from "~/validations/schema/yup";

const loginSchema = yup.object().shape({
	username: yup.string().username().required(),
	password: yup.string().password().required(),
});

export const LoginForm: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const { error, isLoading, accessToken } = useSelector(
		(state: RootState) => state.auth,
	);
	const { showToast } = useToast();
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm({
		resolver: yupResolver(loginSchema),
		mode: "onChange",
	});

	useEffect(() => {
		if (accessToken) {
			navigate("/");
		}
	}, [accessToken, navigate]);

	const onSubmit = async (data: Account) => {
		const actionResult = await dispatch(login(data));
		if (login.fulfilled.match(actionResult)) {
			showToast("Đăng nhập thành công!");
			navigate("/");
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
					disabled={isLoading || !isValid}
				>
					{isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
				</Button>

				<div className="text-center mt-4">
					<p>
						Chưa có tài khoản?{" "}
						<NavLink to="/register" className="text-blue-600 hover:underline">
							Đăng ký
						</NavLink>
					</p>
				</div>
			</Form>
		</div>
	);
};

export default LoginForm;
