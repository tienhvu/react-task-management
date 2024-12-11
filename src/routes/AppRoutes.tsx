import { Route, Routes } from "react-router-dom";
import NotFoundPage from "~/components/NotFoundPage";
import PublicPage from "~/components/HomePage";
import { createRoutes, RouteConfig } from "~/guards/RouteConfig";
import PrivateLayout from "~/layouts/PrivateLayout";
import LoginForm from "~/screens/Auth/Login";
import RegisterForm from "~/screens/Auth/Register";
import Task from "~/screens/Tasks/Task";

const routeConfigs: RouteConfig[] = [
	// Public routes
	{ path: "/login", component: LoginForm },
	{ path: "/register", component: RegisterForm },
	{ path: "/", component: PublicPage },

	// Private routes
	{
		path: "/tasks",
		component: Task,
		isPrivate: true,
		layout: PrivateLayout,
	},
];

function AppRoutes() {
	return (
		<Routes>
			<Route>
				{createRoutes(routeConfigs)}
				<Route path="*" element={<NotFoundPage />} />
			</Route>
		</Routes>
	);
}

export default AppRoutes;
