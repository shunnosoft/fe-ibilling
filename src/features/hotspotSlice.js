import { createSlice } from "@reduxjs/toolkit";

export const hotspotSlice = createSlice({
  name: "hotspot",
  initialState: {
    syncPackage: [],
    package: [],
    customer: [],
    activeHotspotCustomer: [],
    hotspotCustomer: [],
  },
  reducers: {
    getSyncPackageSuccess: (state, { payload }) => {
      state.syncPackage = payload;
    },
    getPackageSuccess: (state, { payload }) => {
      state.package = payload;
    },
    editHotspotPackageSuccess: (state, { payload }) => {
      state.package[state.package.findIndex((item) => item.id === payload.id)] =
        payload;
    },
    deleteHotspotPackageSuccess: (state, { payload }) => {
      state.package = state.package.filter((item) => item.id !== payload);
    },
    getHotspotCustomerSuccess: (state, { payload }) => {
      state.hotspotCustomer = payload;
    },
    getHotspotActiveCustomerSuccess: (state, { payload }) => {
      state.activeHotspotCustomer = payload;
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

    // bulk reducer action
    bulkUpdateSuccess: (state, { payload }) => {
      let customers = [...state.customer];
      for (let i = 0; i < customers.length; i++) {
        const element = customers[i];
        for (let j = 0; j < payload.length; j++) {
          if (element.id === payload[j].id) {
            customers[i] = payload[j];
          }
        }
      }
      state.customer = [...customers];
    },

    bulkDeleteSuccess: (state, { payload }) => {
      let customers = [...state.customer];
      let updateCustomer = [];

      //loop through existing customer
      for (let i = 0; i < customers.length; i++) {
        const element = customers[i];
        const found = payload.find((item) => item.id === element.id);
        if (!found) updateCustomer.push(element);
      }

      state.customer = [...updateCustomer];
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
  editHotspotPackageSuccess,
  deleteHotspotPackageSuccess,
  getHotspotActiveCustomerSuccess,
  getCustomerSuccess,
  bulkUpdateSuccess,
  bulkDeleteSuccess,
} = hotspotSlice.actions;
export default hotspotSlice.reducer;
