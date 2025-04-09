import { createSlice } from "@reduxjs/toolkit";

const resellerSlice = createSlice({
  name: "reseller",
  initialState: {
    reseller: [],
  },
  reducers: {
    getResellerProfileSuccess: (state, action) => {
      state.reseller = action.payload;
    },
  },
});

export const { getResellerProfileSuccess } = resellerSlice.actions;

export default resellerSlice.reducer;
