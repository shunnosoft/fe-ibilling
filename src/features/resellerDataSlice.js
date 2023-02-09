import { createSlice } from "@reduxjs/toolkit";

const resellerDataSlice = createSlice({
  name: "resellerData",
  initialState: {
    data: [],
    packageBasedCustomer: [],
    paidCustomer: [],
    unPaidCustomer: [],
    otherCustomer: [],
  },
  reducers: {
    getResellerDataSuccess: (state, actions) => {
      state.data = actions.payload;
    },
    packageBasedCustomerSuccess: (state, actions) => {
      state.packageBasedCustomer = actions.payload;
    },
    packageBasedPaidCustomerSuccess: (state, actions) => {
      state.paidCustomer = actions.payload;
    },
    packageBasedUnpaidCustomerSuccess: (state, actions) => {
      state.unPaidCustomer = actions.payload;
    },
    packageBasedOtherCustomerSuccess: (state, actions) => {
      state.otherCustomer = actions.payload;
    },
  },
});

export const {
  getResellerDataSuccess,
  packageBasedCustomerSuccess,
  packageBasedPaidCustomerSuccess,
  packageBasedUnpaidCustomerSuccess,
  packageBasedOtherCustomerSuccess,
} = resellerDataSlice.actions;
export default resellerDataSlice.reducer;
