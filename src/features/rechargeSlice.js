import { createSlice } from "@reduxjs/toolkit";

export const rechargeSlice = createSlice({
  name: "recharge",
  initialState: {
    rechargeHistory: [],
    singleHistory: [],
    prevMonthReport: [],
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
    prevMonthReportSlice: (state, action) => {
      state.prevMonthReport = action.payload;
    },
  },
});

export const {
  getAllRechargeHistory,
  resellerRechargeHistorySlice,
  historyEditSuccess,
  prevMonthReportSlice,
} = rechargeSlice.actions;
export default rechargeSlice.reducer;
