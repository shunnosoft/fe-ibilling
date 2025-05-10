import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  olt: [],
  onu: {},
};

const oltSlice = createSlice({
  name: "olt",
  initialState,
  reducers: {
    getIspOwnerOLTSuccess: (state, action) => {
      state.olt = action.payload;
    },
    createIspOwnerOLTSuccess: (state, action) => {
      state.olt.push(action.payload);
    },
    updateIspOwnerOLTSuccess: (state, action) => {
      state.olt[state.olt.findIndex((item) => item.id === action.payload.id)] =
        action.payload;
    },
    deleteIspOwnerOLTSuccess: (state, action) => {
      state.olt = state.olt.filter((item) => item.id !== action.payload);
    },

    getCustomerONUSuccess: (state, action) => {
      state.onu = action.payload;
    },
    getAllPackagesSuccess: (state, action) => {
      state.allPackages = action.payload;
    },
    editPackageSuccess: (state, action) => {
      // console.log(action.payload)
      state.packages[
        state.packages.findIndex((item) => item.id === action.payload.id)
      ] = action.payload;
    },
    addPackageSuccess: (state, action) => {
      state.packages.push(action.payload);
    },
    deletePackageSuccess: (state, action) => {
      state.packages = state.packages.filter(
        (item) => item.id !== action.payload
      );
    },
    getHotspotPackageSuccess: (state, action) => {
      state.hotspotPackage = action.payload;
    },

    // pppoe packages
    getPppoePackages: (state, action) => {
      state.pppoePackages = action.payload;
    },
  },
});

export const {
  getIspOwnerOLTSuccess,
  createIspOwnerOLTSuccess,
  updateIspOwnerOLTSuccess,
  deleteIspOwnerOLTSuccess,
  getCustomerONUSuccess,
  getpackageSuccess,
  getAllPackagesSuccess,
  editPackageSuccess,
  addPackageSuccess,
  deletePackageSuccess,
  getHotspotPackageSuccess,
  getPppoePackages,
} = oltSlice.actions;

export default oltSlice.reducer;
