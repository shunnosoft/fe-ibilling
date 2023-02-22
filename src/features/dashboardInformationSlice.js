import { createSlice } from "@reduxjs/toolkit";

const dashboardInformation = createSlice({
  name: "dashboardInformation",
  initialState: {
    inactiveCustomer: [],
    expiredCustomer: [],
    freeCustomer: [],
    paidCustomer: [],
    unpaidCustomer: [],
    activeCustomer: [],
  },
  reducers: {
    getInactiveCustomerSuccess: (state, action) => {
      state.inactiveCustomer = action.payload;
    },
    getExpiredCustomerSuccess: (state, action) => {
      state.expiredCustomer = action.payload;
    },
    getFreeCustomerSuccess: (state, action) => {
      state.freeCustomer = action.payload;
    },
    getPaidCustomerSuccess: (state, action) => {
      state.paidCustomer = action.payload;
    },
    getUnpaidCustomerSuccess: (state, action) => {
      state.unpaidCustomer = action.payload;
    },
    getActiveCustomerSuccess: (state, action) => {
      state.activeCustomer = action.payload;
    },
  },
});

export const {
  getInactiveCustomerSuccess,
  getExpiredCustomerSuccess,
  getFreeCustomerSuccess,
  getPaidCustomerSuccess,
  getUnpaidCustomerSuccess,
  getActiveCustomerSuccess,
} = dashboardInformation.actions;

export default dashboardInformation.reducer;
