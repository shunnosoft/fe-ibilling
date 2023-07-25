import { createSlice } from "@reduxjs/toolkit";

const resellerPaymentSlice = createSlice({
  name: "resellerPayment",
  initialState: {
    onlinePaymentCustomer: [],
  },
  reducers: {
    getOnlinePaymentCustomer: (state, action) => {
      state.onlinePaymentCustomer = action.payload;
    },
  },
});

export const { getOnlinePaymentCustomer } = resellerPaymentSlice.actions;

export default resellerPaymentSlice.reducer;
