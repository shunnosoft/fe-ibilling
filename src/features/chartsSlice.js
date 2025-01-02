import { createSlice } from "@reduxjs/toolkit";

const chartsSlice = createSlice({
  name: "chart",
  initialState: {
    charts: [],
    customerStat: {},
    dashboardOverview: {},
    dashboardOverviewCustomer: {},
    dashboardBelowAdminCardData: {},
    dashboardBelowManagerCardData: {},
    dashboardBelowResellerCardData: {},
    dashboardBelowCollectorCardData: {},
    dashboardOverviewManagerCustomer: {},
    dashboardOverviewManagerCollection: {},
  },
  reducers: {
    getChartSuccess: (state, { payload }) => {
      state.charts = payload;
    },
    getCardDataSuccess: (state, { payload }) => {
      state.customerStat = payload;
    },
    getDashboardOverviewManagerCollectionDataSuccess: (state, { payload }) => {
      state.dashboardOverviewManagerCollection = payload;
    },
    getDashboardOverviewManagerCustomerDataSuccess: (state, { payload }) => {
      state.dashboardOverviewManagerCustomer = payload;
    },
    clearChart: (state) => {
      state.charts = [];
    },

    getDashboardOverViewData: (state, { payload }) => {
      state.dashboardOverview = payload;
    },
    getDashboardOverViewCustomerData: (state, { payload }) => {
      state.dashboardOverviewCustomer = payload;
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
  getDashboardOverViewCustomerData,
  getBelowResellerCardData,
  getBelowCollectorCardData,
  getDashboardOverviewManagerCustomerDataSuccess,
  getDashboardOverviewManagerCollectionDataSuccess,
} = chartsSlice.actions;
export default chartsSlice.reducer;
