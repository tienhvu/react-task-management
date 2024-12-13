import { setupWorker } from "msw/browser";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from "~/App";
import { persistor, store } from "~/store/store";
import { ToastProvider } from "./components/Toast";
import { handlers } from "./mocks/handlers/handlers";

export const worker = setupWorker(...handlers);

worker.start().then(() => {
	createRoot(document.getElementById("root")!).render(
		<ToastProvider>
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<App />
				</PersistGate>
			</Provider>
		</ToastProvider>,
	);
});
