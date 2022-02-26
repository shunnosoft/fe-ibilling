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
  },
});

export const { getChartSuccess } = chartsSlice.actions;
export default chartsSlice.reducer;
