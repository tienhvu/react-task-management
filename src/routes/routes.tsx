import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "~/components/HomePage";
import NotFoundPage from "~/components/NotFoundPage";
import ProtectedRoute, { RouteConfig } from "~/guards/RouteConfig";
import PrivateLayout from "~/layouts/PrivateLayout";
import LoginForm from "~/screens/Auth/Login";
import RegisterForm from "~/screens/Auth/Register";
import CategoryPage from "~/screens/Tasks/Category/CategoryPage";
import Task from "~/screens/Tasks/Task";
import Profile from "~/screens/User/Profile";

const AppRoutes: React.FC = () => {
	const routeConfigs: RouteConfig[] = [
		{
			path: "/tasks",
			component: Task,
			isPrivate: true,
			layout: PrivateLayout,
		},
		{
			path: "/profile",
			component: Profile,
			isPrivate: true,
			layout: PrivateLayout,
		},
		{
			path: "/categories",
			component: CategoryPage,
			isPrivate: true,
			layout: PrivateLayout,
		},
		{
			path: "/login",
			component: LoginForm,
		},
		{
			path: "/register",
			component: RegisterForm,
		},
		{
			path: "/",
			component: HomePage,
			layout: PrivateLayout,
		},
	];

	return (
		<Routes>
			{routeConfigs.map((route) => (
				<Route
					key={route.path}
					path={route.path}
					element={
						<ProtectedRoute
							component={route.component}
							isPrivate={route.isPrivate}
							layout={route.layout}
						/>
					}
				/>
			))}
			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	);
};

export default AppRoutes;
