import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { injectDispatch } from "~/utils/injectDispatch";
import AppRoutes from "./routes/routes";
function App() {
	const dispatch = useDispatch();
	useEffect(() => {
		injectDispatch(dispatch);
	}, [dispatch]);

	return (
		<BrowserRouter>
			<AppRoutes />
		</BrowserRouter>
	);
}

export default App;
