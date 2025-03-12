import { configureStore } from "@reduxjs/toolkit";
import loginInfo from './loginInfo.tsx'
import webStatus from './webStatus.tsx'
import pianoCharacterSlice from './pianoCharacherSlice.tsx';

const store = configureStore({
  reducer: {
    loginInfo,
    webStatus,
    pianoCharacterSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;