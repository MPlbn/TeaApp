import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type InfoModalData = {
    message: string;
};

type UiState = {
    infoModal: InfoModalData | null;
};

const initialState: UiState = {
    infoModal: null
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        openInfoModal: (
            state,
            action: PayloadAction<InfoModalData>
        ) => {
            state.infoModal = action.payload;
        },

        closeInfoModal: (state) => {
            state.infoModal = null;
        }
    }
});

export const { openInfoModal, closeInfoModal } = uiSlice.actions;

export default uiSlice.reducer;