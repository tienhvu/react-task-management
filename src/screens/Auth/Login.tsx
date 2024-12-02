// LoginForm.tsx
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "~/store/store";
import { login } from "~/store/slices/authSlice";
import React from "react";

function LoginForm() {
	const dispatch = useDispatch<AppDispatch>();
	const { error, loading: isLoading } = useSelector(
		(state: RootState) => state.auth,
	);

	const [credentials, setCredentials] = React.useState({
		username: "",
		password: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setCredentials((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleLogin = (e: React.FormEvent) => {
		e.preventDefault();
		dispatch(login(credentials));
	};

	return (
		<Form onSubmit={handleLogin}>
			<Form.Group>
				<Form.Label>Tên đăng nhập</Form.Label>
				<Form.Control
					type="text"
					name="username"
					value={credentials.username}
					onChange={handleChange}
					required
				/>
			</Form.Group>

			<Form.Group>
				<Form.Label>Mật khẩu</Form.Label>
				<Form.Control
					type="password"
					name="password"
					value={credentials.password}
					onChange={handleChange}
					required
				/>
			</Form.Group>

			{error && <div className="text-danger">{error}</div>}

			<Button type="submit" disabled={isLoading}>
				{isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
			</Button>
		</Form>
	);
}

export default LoginForm;
