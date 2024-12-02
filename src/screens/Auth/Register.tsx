import { Button, Form } from "react-bootstrap";

function RegisterForm() {
	return (
		<div className="d-flex justify-content-center align-items-center vh-100 bg-light">
			<Form
				className="p-4 border rounded shadow bg-white"
				style={{ width: "500px" }}
			>
				<h2 className="text-center mb-4">Register</h2>
				<Form.Group className="mb-3" controlId="formBasicUsername">
					<Form.Label className="fw-bold">User name</Form.Label>
					<Form.Control
						type="username"
						placeholder="Enter username"
						className="border-primary"
					/>
				</Form.Group>

				<Form.Group className="mb-3" controlId="formBasicPassword">
					<Form.Label className="fw-bold">Password</Form.Label>
					<Form.Control
						type="password"
						placeholder="Password"
						className="border-primary"
					/>
				</Form.Group>

				<Button variant="primary" type="submit" className="w-100 fw-bold">
					Register
				</Button>
				<div>
					<a href="/login">Have an account? Click here to login</a>
				</div>
			</Form>
		</div>
	);
}
export default RegisterForm;
