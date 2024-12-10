import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "~/store/store";

interface ProtectedRouteProps {
	redirectPath?: string;
	children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	redirectPath = "/login",
	children,
}) => {
	const location = useLocation();
	const { user, accessToken } = useSelector((state: RootState) => state.auth);

	const isAuthenticated = !!user && !!accessToken;

	if (!isAuthenticated) {
		return <Navigate to={redirectPath} state={{ from: location }} replace />;
	}

	return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
