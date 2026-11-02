import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/User";

type AuthState = {
    accessToken: string | null;
    refreshToken: string | null;
    expiresAt: string | null;
    user: User | null;
}

const initialState: AuthState = {
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
    user: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<Omit<AuthState, "user">>) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.expiresAt = action.payload.expiresAt;
        },

        clearCredentials: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
            state.expiresAt = null;
        },

        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        }
    }
});

export const { setCredentials, clearCredentials, setUser } = authSlice.actions;

export default authSlice.reducer;