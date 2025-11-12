import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface Phone {
  id: number;
  phoneName: string;
  brand: string;
  price: number;
  launchPrice: number;
  storage: string;
  ram: string;
  battery: string;
  camera: string;
  screenSize: number;
  os: string;
  releaseYear: number;
  rating: number;
  inStock: boolean;
  description: string;
}

interface PhoneState {
  phones: Phone[];
  loading: boolean;
  error: string | null;
}

const initialState: PhoneState = {
  phones: [],
  loading: false,
  error: null,
};

// 🚀 Async Thunk for fetching all phones
export const fetchPhones = createAsyncThunk("phones/fetchAll", async () => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/phones`);
  if (!response.ok) throw new Error("Failed to fetch phones");
  const data = await response.json();
  return data as Phone[];
});

const phoneSlice = createSlice({
  name: "phones",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPhones.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPhones.fulfilled, (state, action: PayloadAction<Phone[]>) => {
        state.loading = false;
        state.phones = action.payload;
      })
      .addCase(fetchPhones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error fetching phones";
      });
  },
});

export default phoneSlice.reducer;
