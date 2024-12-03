import { Routes, Route, Navigate } from "react-router-dom";
import { LoginForm } from "~/screens/Auth/Login";

import RegisterForm from "~/screens/Auth/Register";

function AppRoutes() {
	return (
		<Routes>
			<Route path="/login" element={<LoginForm />} />
			<Route path="/register" element={<RegisterForm />} />
			<Route path="*" element={<Navigate to="/login" />} />
		</Routes>
	);
}

export default AppRoutes;
