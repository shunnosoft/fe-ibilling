import { createSlice } from "@reduxjs/toolkit";

export const hotspotSlice = createSlice({
  name: "hotspot",
  initialState: {
    syncPackage: [],
    package: [],
    customer: [],
    hotspotCustomer: [],
  },
  reducers: {
    getSyncPackageSuccess: (state, { payload }) => {
      state.syncPackage = payload;
    },
    getPackageSuccess: (state, { payload }) => {
      state.package = payload;
    },
    getHotspotCustomerSuccess: (state, { payload }) => {
      state.hotspotCustomer = payload;
    },
    addCustomerSuccess: (state, { payload }) => {
      state.customer.push(payload);
    },
    getCustomerSuccess: (state, { payload }) => {
      state.customer = payload;
    },
  },
});

export const {
  getSyncPackageSuccess,
  getPackageSuccess,
  addCustomerSuccess,
  getHotspotCustomerSuccess,
  getCustomerSuccess,
} = hotspotSlice.actions;
export default hotspotSlice.reducer;
