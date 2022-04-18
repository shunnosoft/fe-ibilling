import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  packages: [],
};

const packageSlice = createSlice({
  name: "package",
  initialState,
  reducers: {
    getpackageSuccess: (state, action) => {
      state.packages = action.payload;
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
  },
});

export const { getpackageSuccess, editPackageSuccess, addPackageSuccess } =
  packageSlice.actions;

export default packageSlice.reducer;
