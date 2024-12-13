import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/routes";
import { useDispatch } from "react-redux";
import { injectDispatch } from "~/utils/injectDispatch";
import { useEffect } from "react";
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
