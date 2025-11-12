// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import splitterReducer from "./splitterSlice";
import phoneReducer from "./phoneSlice";
import refreshReducer  from "./refreshSlice";
export const store = configureStore({
  reducer: {
    splitter: splitterReducer,
    phones: phoneReducer,
     refresh: refreshReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
