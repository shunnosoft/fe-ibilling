import { createSlice } from "@reduxjs/toolkit";

const activityLogSlice = createSlice({
  name: "activityLog",
  initialState: {
    activityLog: [],
    customerActivityLog: [],
  },
  reducers: {
    getActivityLogSlice: (state, action) => {
      state.activityLog = action.payload;
    },
    getCustomerActivityLogSlice: (state, action) => {
      state.customerActivityLog = action.payload;
    },
  },
});

export const { getActivityLogSlice, getCustomerActivityLogSlice } =
  activityLogSlice.actions;

export default activityLogSlice.reducer;
