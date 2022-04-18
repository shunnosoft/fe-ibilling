import { createSlice } from "@reduxjs/toolkit";

const chartsSlice = createSlice({
  name: "chart",
  initialState: {
    charts: [],
    customerStat: {},
  },
  reducers: {
    getChartSuccess: (state, { payload }) => {
      state.charts = payload;
    },
    getCardDataSuccess: (state, { payload }) => {
      state.customerStat = payload;
    },
    clearChart: (state) => {
      state.charts = [];
    },
  },
});

export const {
  getChartSuccess,
  clearChart,
  getCardDataSuccess,
} = chartsSlice.actions;
export default chartsSlice.reducer;
