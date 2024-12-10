import Sidebar from "~/components/SideBar";

type MainLayoutProps = {
	children: React.ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
	return (
		<div className="d-flex">
			<Sidebar />
			<div
				className="flex-grow-1 p-3"
				style={{
					marginLeft: "250px",
				}}
			>
				{children}
			</div>
		</div>
	);
};

export default MainLayout;
