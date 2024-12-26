import React from "react";
import { Navigate } from "react-router-dom";
import useLoggedIn from "~/hook/useLoggedIn";
import { SCREEN_PATHS } from "~/utils/constants/constants";

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
	const isLoggedIn = useLoggedIn();

	if (isPrivate && !isLoggedIn) {
		return <Navigate to={SCREEN_PATHS.LOGIN} replace />;
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
