import { createSlice } from "@reduxjs/toolkit";

export const resellerSupportSlice = createSlice({
  name: "resellerSupport",
  initialState: {
    resellerSupport: [],
  },
  reducers: {
    getResellerSupport: (state, action) => {
      state.resellerSupport = action.payload;
    },
    addResellerSupport: (state, action) => {
      state.resellerSupport.push(action.payload);
    },
    updateResellerSupport: (state, action) => {
      const supportIndex = state.resellerSupport.findIndex(
        (item) => item.id === action.payload.id
      );
      state.resellerSupport[supportIndex] = action.payload;
    },
  },
});

export const { getResellerSupport, addResellerSupport, updateResellerSupport } =
  resellerSupportSlice.actions;
export default resellerSupportSlice.reducer;
