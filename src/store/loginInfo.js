import { createSlice } from "@reduxjs/toolkit";

const loginInfo = createSlice({
    name: "loginInfo",
    initialState: {
        username: null,
        password: null,
    },
    reducers: {
        setInfo (state, action) {
            console.log(action.payload)
            state.username = action.payload.username;
            state.password = action.payload.password;
        },
        clearInfo (state, action) {
            state.username = null;
        }
    },
});

export const { setInfo, clearInfo } = loginInfo.actions;
export default loginInfo.reducer;