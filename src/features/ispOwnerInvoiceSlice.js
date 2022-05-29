import { createSlice } from "@reduxjs/toolkit";

const invoiceList = createSlice({
  name: "invoice",
  initialState: {
    ownerInvoice: [],
  },
  reducers: {
    getIspOwnerInvoicesSuccess: (state, actions) => {
      state.ownerInvoice = actions.payload;
    },

    editInvoiceSuccess: (state, actions) => {
      state.ownerInvoice[
        state.ownerInvoice.findIndex((item) => item.id === actions.payload.id)
      ] = actions.payload;
    },
  },
});

export const { getIspOwnerInvoicesSuccess, editInvoiceSuccess } =
  invoiceList.actions;

export default invoiceList.reducer;
