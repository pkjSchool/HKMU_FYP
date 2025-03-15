import { configureStore } from "@reduxjs/toolkit";
import loginInfo from './loginInfo.tsx'
import webStatus from './webStatus.tsx'

const store = configureStore({
  reducer: {
    loginInfo,
    webStatus,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;