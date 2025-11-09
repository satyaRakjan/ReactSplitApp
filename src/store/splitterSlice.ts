// src/store/splitterSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SplitterState {
  firstSize: string;

  secondSize: string;

  showSecond: boolean;
}

const initialState: SplitterState = {
  firstSize: "40%",

  secondSize: "60%",

  showSecond: true,
};

const splitterSlice = createSlice({
  name: "splitter",
  initialState,
  reducers: {
    setFullPage(state) {
      state.firstSize = "0%";
      state.secondSize = "100%";
      state.showSecond = true;
    },
    setClosePage(state) {
      state.firstSize = "100%";
      state.secondSize = "0%";
      state.showSecond = false;
    },
    resetDefault(state) {
      state.firstSize = "40%";
      state.secondSize = "60%";
      state.showSecond = true;
    },
    setSizes(state, action: PayloadAction<{ firstSize: string; secondSize: string }>) {
      state.firstSize = action.payload.firstSize;
      state.secondSize = action.payload.secondSize;
    },
  },
});

export const { setFullPage, setClosePage, resetDefault, setSizes } = splitterSlice.actions;
export default splitterSlice.reducer;
