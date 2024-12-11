import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectIsAuthenticated } from "~/store/slices/authSlice";

export type RouteConfig = {
	path: string;
	component: React.ComponentType;
	isPrivate?: boolean;
	layout?: React.ComponentType<{ children: React.ReactNode }>;
};

type Props = {
	component: React.ComponentType;
	isPrivate?: boolean;
	layout?: React.ComponentType<{ children: React.ReactNode }>;
};

const ProtectedRoute: React.FC<Props> = ({
	component: Component,
	isPrivate,
	layout: Layout,
}) => {
	const isAuthenticated = useSelector(selectIsAuthenticated);

	if (isPrivate && !isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	if (Layout) {
		return (
			<Layout>
				<Component />
			</Layout>
		);
	}

	return <Component />;
};

export default ProtectedRoute;
