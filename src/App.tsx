import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/routes";
import "bootstrap/dist/css/bootstrap.min.css";
function App() {
	return (
		<BrowserRouter>
			<AppRoutes />
		</BrowserRouter>
	);
}

export default App;
