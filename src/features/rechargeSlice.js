import { createSlice } from "@reduxjs/toolkit";

export const rechargeSlice = createSlice({
  name: "recharge",
  initialState: {
    rechargeHistory: [],
    singleHistory: [],
  },
  reducers: {
    getAllRechargeHistory: (state, action) => {
      state.rechargeHistory = action.payload;
    },
    resellerRechargeHistorySlice: (state, action) => {
      state.singleHistory = action.payload;
    },
  },
});

export const { getAllRechargeHistory, resellerRechargeHistorySlice } =
  rechargeSlice.actions;
export default rechargeSlice.reducer;
