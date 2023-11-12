import { createSlice } from "@reduxjs/toolkit";

const publicSlice = createSlice({
  name: "publicHotspot",
  initialState: {
    publicPackage: [],
    hotspotUser: "",
  },
  reducers: {
    getPublicHotspotPackages: (state, action) => {
      state.publicPackage = action.payload;
    },
    getCreateUser: (state, action) => {
      state.hotspotUser = action.payload;
    },
  },
});

export const { getPublicHotspotPackages, getCreateUser } = publicSlice.actions;

export default publicSlice.reducer;
