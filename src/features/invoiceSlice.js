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
  },
});

export const { getInvoiceListSuccess } = invoiceSlice.actions;
export default invoiceSlice.reducer;
