import { createSlice } from "@reduxjs/toolkit";

const resellerSlice = createSlice({
  name: "reseller",
  initialState: {
    reseller: [],
  },
  reducers: {
    getResellerProfile: (state, action) => {
      state.reseller = action.payload;
    },
  },
});

export const { getResellerProfile } = resellerSlice.actions;

export default resellerSlice.reducer;
