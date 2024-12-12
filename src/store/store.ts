import { configureStore } from "@reduxjs/toolkit";
import {
	persistStore,
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import categoryReducer from "./slices/categorySlice";
import { setupInterceptors } from "~/api/axiosInstance";
const authPersistConfig = {
	key: "auth",
	storage,
	whitelist: ["accessToken", "refreshToken", "user"],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
	reducer: {
		auth: persistedAuthReducer,
		user: userReducer,
		category: categoryReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
});
setupInterceptors(store.dispatch);
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
