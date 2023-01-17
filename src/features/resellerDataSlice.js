import { createSlice } from "@reduxjs/toolkit";

const resellerDataSlice = createSlice({
  name: "resellerData",
  initialState: {
    data: [],
  },
  reducers: {
    getResellerDataSuccess: (state, actions) => {
      state.data = actions.payload;
    },
  },
});

export const { getResellerDataSuccess } = resellerDataSlice.actions;
export default resellerDataSlice.reducer;
