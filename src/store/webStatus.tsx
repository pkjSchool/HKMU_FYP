import { createSlice } from "@reduxjs/toolkit";

const webStatus = createSlice({
    name: "webStatus",
    initialState: {
        isInitial: true,
    },
    reducers: {
        setWebStatus (state, action) {
            console.log(action.payload)
            state.isInitial = action.payload.isInitial;
        },
    },
});

export const { setWebStatus } = webStatus.actions;
export default webStatus.reducer;