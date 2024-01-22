import { createSlice } from "@reduxjs/toolkit";

const chartsSlice = createSlice({
  name: "chart",
  initialState: {
    charts: [],
    customerStat: {},
    dashboardOverview: {},
    dashboardBelowAdminCardData: {},
    dashboardBelowManagerCardData: {},
    dashboardBelowResellerCardData: {},
    dashboardBelowCollectorCardData: {},
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

    getDashboardOverViewData: (state, { payload }) => {
      state.dashboardOverview = payload;
    },
    getBelowAdminCardData: (state, { payload }) => {
      state.dashboardBelowAdminCardData = payload;
    },
    getBelowManagerCardData: (state, { payload }) => {
      state.dashboardBelowManagerCardData = payload;
    },
    getBelowManagerCardData: (state, { payload }) => {
      state.dashboardBelowManagerCardData = payload;
    },
    getBelowCollectorCardData: (state, { payload }) => {
      state.dashboardBelowCollectorCardData = payload;
    },
    getBelowResellerCardData: (state, { payload }) => {
      state.dashboardBelowResellerCardData = payload;
    },
  },
});

export const {
  getChartSuccess,
  clearChart,
  getCardDataSuccess,
  getBelowAdminCardData,
  getBelowManagerCardData,
  getDashboardOverViewData,
  getBelowResellerCardData,
  getBelowCollectorCardData,
} = chartsSlice.actions;
export default chartsSlice.reducer;
