import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TeaWare } from "../types/TeaWare";

type TeaWareState = {
    teaWare: TeaWare | null;
};

const initialState: TeaWareState = {
    teaWare: null
};

const teaWareSlice = createSlice({
    name: "teaBrewing",
    initialState,
    reducers: {
        setTeaWare: (state, action: PayloadAction<TeaWare>) => {
            state.teaWare = action.payload;
        },

        unsetTeaWare: (state) => {
            state.teaWare = null;
        }
    }
});

export const { setTeaWare: setTeaWare, unsetTeaWare: unsetTeaWare } = teaWareSlice.actions;
export default teaWareSlice.reducer;