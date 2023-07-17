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
    ispOwnerReseller: [],
    ispOwnerCollector: [],
    discountCustomer: [],
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
    getIspOwnerResellerSuccess: (state, action) => {
      state.ispOwnerReseller = action.payload;
    },
    getIspOwnerCollectorSuccess: (state, action) => {
      state.ispOwnerCollector = action.payload;
    },
    getDiscountCustomerSuccess: (state, action) => {
      state.discountCustomer = action.payload;
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
  getIspOwnerResellerSuccess,
  getIspOwnerCollectorSuccess,
  getDiscountCustomerSuccess,
} = dashboardInformation.actions;

export default dashboardInformation.reducer;
