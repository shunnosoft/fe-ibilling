import { createSlice } from "@reduxjs/toolkit";

const clientSlice = createSlice({
  name: "client",
  initialState: {
    paymentHistory: [],
  },
  reducers: {
    getAllPaymentHistory: (state, action) => {
      state.paymentHistory = action.payload;
    },
  },
});

export const { getAllPaymentHistory } = clientSlice.actions;

export default clientSlice.reducer;
