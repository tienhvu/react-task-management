import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "~/components/HomePage";
import NotFoundPage from "~/components/NotFoundPage";
import ProtectedRoute, { RouteConfig } from "~/guards/RouteConfig";
import PrivateLayout from "~/layouts/PrivateLayout";
import LoginForm from "~/screens/Auth/Login";
import RegisterForm from "~/screens/Auth/Register";
import CategoryPage from "~/screens/Tasks/Category/CategoryPage";
import TaskList from "~/screens/Tasks/TaskListPage";
import Profile from "~/screens/User/Profile";
import ProfileEdit from "~/screens/User/ProfileEdit";
import ResetPassword from "~/screens/User/ResetPassword";
import { SCREEN_PATHS } from "~/utils/constants/constants";

const AppRoutes: React.FC = () => {
	const routeConfigs: RouteConfig[] = [
		{
			path: SCREEN_PATHS.TASK,
			component: TaskList,
			isPrivate: true,
			layout: PrivateLayout,
		},
		{
			path: SCREEN_PATHS.PROFILE,
			component: Profile,
			isPrivate: true,
			layout: PrivateLayout,
		},
		{
			path: SCREEN_PATHS.EDIT_USER,
			component: ProfileEdit,
			isPrivate: true,
			layout: PrivateLayout,
		},
		{
			path: SCREEN_PATHS.RESET_PASSWORD,
			component: ResetPassword,
			isPrivate: true,
			layout: PrivateLayout,
		},
		{
			path: SCREEN_PATHS.PROFILE,
			component: Profile,
			isPrivate: true,
			layout: PrivateLayout,
		},
		{
			path: SCREEN_PATHS.CATEGORY,
			component: CategoryPage,
			isPrivate: true,
			layout: PrivateLayout,
		},
		{
			path: SCREEN_PATHS.LOGIN,
			component: LoginForm,
		},
		{
			path: SCREEN_PATHS.REGISTER,
			component: RegisterForm,
		},
		{
			path: SCREEN_PATHS.HOME,
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
