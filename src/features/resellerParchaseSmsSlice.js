import { createSlice } from "@reduxjs/toolkit";

const resellerParchaseSmsSlice = createSlice({
  name: "smsParchase",
  initialState: {
    smsParchase: [],
    smsParchaseNetfee: [],
  },
  reducers: {
    getParchaseHistorySuccess: (state, actions) => {
      state.smsParchase = actions.payload;
    },
    getInvoiceHistorySuccess: (state, actions) => {
      state.smsParchaseNetfee = actions.payload;
    },
    parchaseSmsSuccess: (state, { payload }) => {
      state.smsParchase.unshift(payload);
    },
    parchaseSmsNetFeeSuccess: (state, { payload }) => {
      state.smsParchaseNetfee.unshift(payload);
    },
  },
});

export const {
  parchaseSmsSuccess,
  getParchaseHistorySuccess,
  getInvoiceHistorySuccess,
  parchaseSmsNetFeeSuccess,
} = resellerParchaseSmsSlice.actions;
export default resellerParchaseSmsSlice.reducer;
