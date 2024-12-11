import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "~/store/store";

export type RouteConfig = {
	path: string;
	component: React.ComponentType;
	isPrivate?: boolean;
	layout?: React.ComponentType;
};

export const ProtectedRoute: React.FC<{
	component: React.ComponentType;
	isPrivate?: boolean;
}> = ({ component: Component, isPrivate }) => {
	const { user, accessToken } = useSelector((state: RootState) => state.auth);
	const isAuthenticated = !!user && !!accessToken;

	if (isPrivate && !isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	return <Component />;
};

export const createRoutes = (routes: RouteConfig[]) => {
	return routes.map((route) => {
		const Layout = route.layout || React.Fragment;

		return (
			<Route
				key={route.path}
				path={route.path}
				element={
					<Layout>
						<ProtectedRoute
							component={route.component}
							isPrivate={route.isPrivate}
						/>
					</Layout>
				}
			/>
		);
	});
};
