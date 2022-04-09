import { createSlice } from "@reduxjs/toolkit";

const chartsSlice = createSlice({
  name: "chart",
  initialState: {
    charts: [],
  },
  reducers: {
    getChartSuccess: (state, { payload }) => {
      state.charts = payload;
    },
    clearChart: (state) => {
      state.charts = [];
    },
  },
});

export const { getChartSuccess, clearChart } = chartsSlice.actions;
export default chartsSlice.reducer;
