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
  },
});

export const { getIspOwnerInvoicesSuccess } = invoiceList.actions;

export default invoiceList.reducer;
