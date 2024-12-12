import React, { ReactNode } from "react";
import { Outlet } from "react-router-dom";

interface LayoutProps {
	children?: ReactNode;
}
const PublicLayout: React.FC<LayoutProps> = ({ children }) => {
	return <div className="d-flex">{children || <Outlet />}</div>;
};

export default PublicLayout;
