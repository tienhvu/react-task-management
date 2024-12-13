import React, { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "~/components/SideBar/SideBar";

interface LayoutProps {
	children?: ReactNode;
}

const PrivateLayout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<div className="d-flex">
			<Sidebar />
			<div
				style={{
					marginLeft: "250px",
				}}
			/>
			{children || <Outlet />}
		</div>
	);
};

export default PrivateLayout;
