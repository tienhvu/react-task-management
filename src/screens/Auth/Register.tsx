import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { register as registerAction } from "~/store/slices/authSlice";
import { AppDispatch, RootState } from "~/store/store";
import { RegisterUser } from "~/types/interface/RegisterUser";

const registerSchema = Yup.object().shape({
	username: Yup.string()
		.required("Tên đăng nhập không được để trống")
		.min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
	password: Yup.string()
		.required("Mật khẩu không được để trống")
		.min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
	rePassword: Yup.string()
		.oneOf([Yup.ref("password")], "Mật khẩu xác nhận không khớp")
		.required("Xác nhận mật khẩu không được để trống"),
	email: Yup.string()
		.required("Email không được để trống")
		.email("Email không hợp lệ"),
	firstName: Yup.string()
		.required("Tên không được để trống")
		.min(2, "Tên phải có ít nhất 2 ký tự"),
	lastName: Yup.string()
		.required("Họ không được để trống")
		.min(2, "Họ phải có ít nhất 2 ký tự"),
	gender: Yup.string()
		.required("Giới tính không được để trống")
		.oneOf(["Male", "Female", "Other"], "Giới tính không hợp lệ"),
});

export const RegisterForm: React.FC = () => {
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
		watch,
		trigger,
	} = useForm({
		resolver: yupResolver(registerSchema),
		mode: "onChange",
	});

	const passwordValue = watch("password");
	const rePasswordValue = watch("rePassword");
	const isError = !!error || !!Object.keys(errors).length;
	useEffect(() => {
		if (passwordValue && rePasswordValue) {
			trigger("rePassword");
		}
	}, [passwordValue, rePasswordValue, trigger]);

	const onSubmit = async (data: RegisterUser) => {
		const actionResult = await dispatch(registerAction(data));
		if (registerAction.fulfilled.match(actionResult)) {
			setShowSuccessAlert(true);

			setTimeout(() => {
				setShowSuccessAlert(false);
				navigate("/login");
			}, 2000);
		}
	};

	return (
		<div className="d-flex justify-content-center align-items-center vh-100 bg-light">
			<Form
				onSubmit={handleSubmit(onSubmit)}
				className="p-4 border rounded shadow bg-white d-flex flex-column gap-2"
				style={{ width: "500px", height: "auto" }}
			>
				<h1 className="text-center font-bold mb-6">Đăng Ký</h1>

				{showSuccessAlert && (
					<Alert
						variant="success"
						onClose={() => setShowSuccessAlert(false)}
						dismissible
					>
						Đăng ký thành công!
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

				<div className="row">
					<Form.Group className="col-6">
						<Form.Label>
							Họ <span className="text-danger">*</span>
						</Form.Label>
						<Form.Control
							type="text"
							{...register("lastName")}
							isInvalid={!!errors.lastName}
							placeholder="Nhập họ"
						/>
						<Form.Control.Feedback type="invalid">
							{errors.lastName?.message}
						</Form.Control.Feedback>
					</Form.Group>

					<Form.Group className="col-6">
						<Form.Label>
							Tên <span className="text-danger">*</span>
						</Form.Label>
						<Form.Control
							type="text"
							{...register("firstName")}
							isInvalid={!!errors.firstName}
							placeholder="Nhập tên"
						/>
						<Form.Control.Feedback type="invalid">
							{errors.firstName?.message}
						</Form.Control.Feedback>
					</Form.Group>
				</div>

				<div className="row">
					<Form.Group className="col-6">
						<Form.Label>
							Email <span className="text-danger">*</span>
						</Form.Label>
						<Form.Control
							type="email"
							{...register("email")}
							isInvalid={!!errors.email}
							placeholder="Nhập email"
						/>
						<Form.Control.Feedback type="invalid">
							{errors.email?.message}
						</Form.Control.Feedback>
					</Form.Group>

					<Form.Group className="col-6">
						<Form.Label>
							Giới tính <span className="text-danger">*</span>
						</Form.Label>
						<Form.Select {...register("gender")} isInvalid={!!errors.gender}>
							<option value="">Chọn giới tính</option>
							<option value="Male">Nam</option>
							<option value="Female">Nữ</option>
							<option value="Other">Khác</option>
						</Form.Select>
						<Form.Control.Feedback type="invalid">
							{errors.gender?.message}
						</Form.Control.Feedback>
					</Form.Group>
				</div>

				<Form.Group>
					<Form.Label>
						Tên đăng nhập <span className="text-danger">*</span>
					</Form.Label>
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
					<Form.Label>
						Mật khẩu <span className="text-danger">*</span>
					</Form.Label>
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

				<Form.Group>
					<Form.Label>
						Xác nhận mật khẩu <span className="text-danger">*</span>
					</Form.Label>
					<Form.Control
						type="password"
						{...register("rePassword")}
						isInvalid={!!errors.rePassword}
						placeholder="Nhập lại mật khẩu"
					/>
					<Form.Control.Feedback type="invalid">
						{errors.rePassword?.message}
					</Form.Control.Feedback>
				</Form.Group>

				<Button
					variant="primary"
					type="submit"
					className="w-full mt-3"
					disabled={isLoading || isError}
				>
					{isLoading ? "Đang đăng ký..." : "Đăng ký"}
				</Button>

				<div className="text-center mt-4">
					<p>
						Đã có tài khoản?{" "}
						<NavLink
							to="/login"
							className="text-blue-600 hover:underline"
							onClick={() => dispatch({ type: "auth/clearError" })}
						>
							Đăng nhập
						</NavLink>
					</p>
				</div>
			</Form>
		</div>
	);
};

export default RegisterForm;
