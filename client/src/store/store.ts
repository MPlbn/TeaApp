import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./uiSlice"
import { teaApi } from "../services/teaApi";

export const store = configureStore({
    reducer: {
        ui: uiReducer,
        [teaApi.reducerPath]: teaApi.reducer
    },

    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(teaApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;