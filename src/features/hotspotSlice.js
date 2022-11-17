import { createSlice } from "@reduxjs/toolkit";

export const hotspotSlice = createSlice({
  name: "hotspot",
  initialState: {
    package: [],
  },
  reducers: {
    getPackageSuccess: (state, { payload }) => {
      state.package = payload;
    },
  },
});

export const { getPackageSuccess } = hotspotSlice.actions;
export default hotspotSlice.reducer;
