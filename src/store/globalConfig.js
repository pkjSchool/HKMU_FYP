import { configureStore } from "@reduxjs/toolkit";
import loginInfo from './loginInfo.js'

const store = configureStore({
  reducer: {
    loginInfo,
  },
});

export default store;