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
    invoiceDelete: (state, action) => {
      state.invoices = state.invoices.filter(
        (item) => item.id !== action.payload
      );
    },
  },
});

export const { getInvoiceListSuccess, getUnpaidInvoiceSuccess, invoiceDelete } =
  invoiceSlice.actions;
export default invoiceSlice.reducer;
