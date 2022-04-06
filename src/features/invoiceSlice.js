import { createSlice } from "@reduxjs/toolkit";

export const invoiceSlice = createSlice({
  name: "invoice",
  initialState: {
    invoices: [],
  },
  reducers: {
    getInvoiceListSuccess: (state, action) => {
      state.invoices = action.payload;
    },
    getUnpaidInvoiceSuccess: (state, action) => {
      state.invoice = action.payload;
    },
  },
});

export const {
  getInvoiceListSuccess,
  getUnpaidInvoiceSuccess,
} = invoiceSlice.actions;
export default invoiceSlice.reducer;
