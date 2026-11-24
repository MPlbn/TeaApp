import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/User";

type AuthState = {
    accessToken: string | null;
    expiresAt: string | null;
    user: User | null;
}

const initialState: AuthState = {
    accessToken: null,
    expiresAt: null,
    user: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<Omit<AuthState, "user">>) => {
            state.accessToken = action.payload.accessToken;
            state.expiresAt = action.payload.expiresAt;
        },

        clearCredentials: (state) => {
            state.accessToken = null;
            state.expiresAt = null;
            state.user = null;
        },

        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        }
    }
});

export const { setCredentials, clearCredentials, setUser } = authSlice.actions;

export default authSlice.reducer;