import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "~/App";
import { Provider } from "react-redux";
import { persistor, store } from "~/store/store";
import { setupWorker } from "msw/browser";
import { handlers } from "./mocks/handlers/handlers";
import { PersistGate } from "redux-persist/integration/react";
import { ToastProvider } from "./components/Toast";

export const worker = setupWorker(...handlers);

worker.start().then(() => {
	createRoot(document.getElementById("root")!).render(
		<StrictMode>
			<ToastProvider>
				<Provider store={store}>
					<PersistGate loading={null} persistor={persistor}>
						<App />
					</PersistGate>
				</Provider>
			</ToastProvider>
		</StrictMode>,
	);
});
