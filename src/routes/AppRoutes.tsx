import { Route, Routes } from "react-router-dom";
import NotFoundPage from "~/components/NotFoundPage";
import PublicPage from "~/components/PublicPage";
import { LoginForm } from "~/screens/Auth/Login";
import RegisterForm from "~/screens/Auth/Register";

function AppRoutes() {
	return (
		<Routes>
			<Route path="/login" element={<LoginForm />} />
			<Route path="/register" element={<RegisterForm />} />
			<Route path="/" element={<PublicPage />} />
			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	);
}

export default AppRoutes;
