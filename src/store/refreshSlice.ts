import { createSlice } from "@reduxjs/toolkit";

interface RefreshState {
  phonesUpdated: boolean;
}

const initialState: RefreshState = {
  phonesUpdated: false,
};

const refreshSlice = createSlice({
  name: "refresh",
  initialState,
  reducers: {
    setPhonesUpdated: (state, action) => {
      state.phonesUpdated = action.payload;
    },
  },
});

export const { setPhonesUpdated } = refreshSlice.actions;
export default refreshSlice.reducer;
