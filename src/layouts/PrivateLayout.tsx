import React, { ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { injectDispatch } from "~/api/axiosInstance";
import Sidebar from "~/components/SideBar/SideBar";

interface LayoutProps {
	children?: ReactNode;
}

const PrivateLayout: React.FC<LayoutProps> = ({ children }) => {
	const dispatch = useDispatch();

	useEffect(() => {
		injectDispatch(dispatch);
	}, [dispatch]);
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
