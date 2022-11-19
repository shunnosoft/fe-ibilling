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
    editCustomerSuccess: (state, action) => {
      state.customer[
        state.customer.findIndex((item) => item.id === action.payload.id)
      ] = action.payload;
    },

    deleteCustomerSuccess: (state, { payload }) => {
      state.customer = state.customer.filter((item) => item.id !== payload);
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
  editCustomerSuccess,
  deleteCustomerSuccess,
  getHotspotCustomerSuccess,
  getCustomerSuccess,
} = hotspotSlice.actions;
export default hotspotSlice.reducer;
