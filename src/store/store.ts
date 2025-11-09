// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import splitterReducer from "./splitterSlice";

export const store = configureStore({
  reducer: {
    splitter: splitterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
