import { createSlice } from "@reduxjs/toolkit";

const resellerSmsRequestSlice = createSlice({
  name: "resellerSmsHistory",
  initialState: {
    requestSmsHistory: [],
    withdrawalHistory: [],
  },
  reducers: {
    getSmsRequestHistorySuccess: (state, { payload }) => {
      state.requestSmsHistory = payload;
    },
    acceptedStatusSuccess: (state, { payload }) => {
      const matchReseller = state.requestSmsHistory.find(
        (item) => (item.reseller.id = payload.id)
      );

      const updateData = { ...matchReseller, status: payload.status };

      state.requestSmsHistory[
        state.requestSmsHistory.findIndex((item) => item.id === payload.id)
      ] = updateData;
    },

    // reseller online customer payment withdrawal history
    getWithdrawalHistory: (state, { payload }) => {
      state.withdrawalHistory = payload;
    },

    statusWithdrawalHistory: (state, { payload }) => {
      const matchReport = state.withdrawalHistory?.find(
        (item) => item.id === payload.id
      );
      const updateData = { ...matchReport, status: payload.status };
      console.log(updateData);

      state.withdrawalHistory[
        state.withdrawalHistory.findIndex((item) => item.id === payload.id)
      ] = updateData;
    },
  },
});

export const {
  getSmsRequestHistorySuccess,
  acceptedStatusSuccess,
  getWithdrawalHistory,
  statusWithdrawalHistory,
} = resellerSmsRequestSlice.actions;
export default resellerSmsRequestSlice.reducer;
