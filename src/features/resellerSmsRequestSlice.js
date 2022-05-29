import { createSlice } from "@reduxjs/toolkit";

const resellerSmsRequestSlice = createSlice({
  name: "resellerSmsHistory",
  initialState: {
    requestSmsHistory: [],
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
  },
});

export const { getSmsRequestHistorySuccess, acceptedStatusSuccess } =
  resellerSmsRequestSlice.actions;
export default resellerSmsRequestSlice.reducer;
