import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "~/App";
import { Provider } from "react-redux";
import { store } from "~/store/store";
import { setupWorker } from "msw/browser";
import { handlers } from "./mocks/handlers/handlers";

// Create and start the MSW worker
export const worker = setupWorker(...handlers);

// Start the worker before rendering the app
worker.start().then(() => {
	createRoot(document.getElementById("root")!).render(
		<StrictMode>
			<Provider store={store}>
				<App />
			</Provider>
		</StrictMode>,
	);
});
