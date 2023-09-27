import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  packages: [],
  allPackages: [],
  pppoePackages: [],
  hotspotPackage: [],
};

const packageSlice = createSlice({
  name: "package",
  initialState,
  reducers: {
    getpackageSuccess: (state, action) => {
      state.packages = action.payload;
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
  getpackageSuccess,
  getAllPackagesSuccess,
  editPackageSuccess,
  addPackageSuccess,
  deletePackageSuccess,
  getHotspotPackageSuccess,
  getPppoePackages,
} = packageSlice.actions;

export default packageSlice.reducer;
