import { createSlice } from "@reduxjs/toolkit";

const collectorSlice = createSlice({
  name: "collector",
  initialState: {
    collector: [],
    collectorBill: [],
    collectorReport: [],
  },
  reducers: {
    getCollectorSuccess: (state, action) => {
      state.collector = action.payload;
    },
    addCollectorSuccess: (state, action) => {
      state.collector.push(action.payload);
    },
    editCollectorSuccess: (state, action) => {
      state.collector[
        state.collector.findIndex((item) => item.id === action.payload.id)
      ] = action.payload;
    },
    deleteCollectorSuccess: (state, action) => {
      state.collector.splice(
        state.collector.findIndex((item) => item.id === action.payload),
        1
      );
    },
    getCollectorBills: (state, action) => {
      state.collectorBill = action.payload;
    },
    clearCollector: (state) => {
      state.collector = [];
      state.collectorBill = [];
    },
    getCollectorReportSuccess: (state, action) => {
      state.collectorReport = action.payload;
    },
  },
});

export const {
  getCollectorSuccess,
  getCollectorBills,
  clearCollector,
  addCollectorSuccess,
  editCollectorSuccess,
  deleteCollectorSuccess,
  getCollectorReportSuccess,
} = collectorSlice.actions;

export default collectorSlice.reducer;
