import { createSlice } from "@reduxjs/toolkit";
import { setCookie, getCookie } from "../util/cookie";

const loginInfo = createSlice({
    name: "loginInfo",
    initialState: {
        isLogined: false,
        user_id: null,
        login_id: null,
        displayName: null,
        jsondata: null
    },
    reducers: {
        setInfo (state, action) {
            console.log(action.payload)
            state.isLogined = true;
            state.user_id = action.payload.user_id;
            state.login_id = action.payload.login_id;
            state.displayName = action.payload.displayName;
            state.jsondata = action.payload.jsondata;
            setCookie("user_id", action.payload.user_id, 30)
        },
        clearInfo (state, action) {
            state.isLogined = false;
            state.user_id = null;
            state.login_id = null;
            state.displayName = null;
            state.jsondata = null;
        }
    },
});

export const { setInfo, clearInfo } = loginInfo.actions;
export default loginInfo.reducer;