import { ReactNode } from "react";

interface AuthLayoutProps {
	children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
	return (
		// <Grid container sx={{ height: "100vh" }}>
		// 	<Grid item xs={12} md={6} sx={{ height: "100vh", overflow: "hidden" }}>
		// 		<BackgroundImage />
		// 	</Grid>
		// 	<Grid item xs={12} md={6} sx={{ height: "100vh", overflow: "auto" }}>
		// 		{children}
		// 	</Grid>
		// </Grid>
		<h1>Auth Layout</h1>
	);
}
