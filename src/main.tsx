import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "~/App";
import { Provider } from "react-redux";
import { persistor, store } from "~/store/store";
import { setupWorker } from "msw/browser";
import { handlers } from "./mocks/handlers/handlers";
import { PersistGate } from "redux-persist/integration/react";

// Create and start the MSW worker
export const worker = setupWorker(...handlers);

// Start the worker before rendering the app
worker.start().then(() => {
	createRoot(document.getElementById("root")!).render(
		<StrictMode>
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<App />
				</PersistGate>
			</Provider>
		</StrictMode>,
	);
});
