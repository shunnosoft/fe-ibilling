import { createSlice } from "@reduxjs/toolkit";

export const rechargeSlice = createSlice({
  name: "recharge",
  initialState: {
    rechargeHistory: [],
  },
  reducers: {
    getAllRechargeHistory: (state, action) => {
      state.rechargeHistory = action.payload;
    },
  },
});

export const { getAllRechargeHistory } = rechargeSlice.actions;
export default rechargeSlice.reducer;
