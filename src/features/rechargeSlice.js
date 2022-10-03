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
    historyEditSuccess: (state, action) => {
      state.rechargeHistory[
        state.rechargeHistory.findIndex((item) => item.id === action.payload.id)
      ] = action.payload;
    },
    resellerRechargeHistorySlice: (state, action) => {
      state.singleHistory = action.payload;
    },
  },
});

export const {
  getAllRechargeHistory,
  resellerRechargeHistorySlice,
  historyEditSuccess,
} = rechargeSlice.actions;
export default rechargeSlice.reducer;
