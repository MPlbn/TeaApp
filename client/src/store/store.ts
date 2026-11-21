import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { teaApi } from "../services/teaApi";
import teaWareReducer from "./teaWareSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [teaApi.reducerPath]: teaApi.reducer,
        teaWare: teaWareReducer
    },

    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(teaApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;