import { Route, Routes } from "react-router-dom";
import NotFoundPage from "~/components/NotFoundPage";
import PublicPage from "~/components/PublicPage";
import ProtectedRoute from "~/guards/ProtectedRouter";
import { LoginForm } from "~/screens/Auth/Login";
import RegisterForm from "~/screens/Auth/Register";
import Task from "~/screens/Tasks/Task";
import Profile from "~/screens/User/Profile";

function AppRoutes() {
	return (
		<Routes>
			<Route path="/login" element={<LoginForm />} />
			<Route path="/register" element={<RegisterForm />} />
			{/* <Route path="/profile" element={<Profile />} /> */}

			<Route
				path="/profile"
				element={
					<ProtectedRoute>
						<Profile />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/tasks"
				element={
					<ProtectedRoute>
						<Task />
					</ProtectedRoute>
				}
			/>
			{/* <Route path="/tasks" element={<Task />} /> */}
			<Route path="/" element={<PublicPage />} />
			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	);
}

export default AppRoutes;
