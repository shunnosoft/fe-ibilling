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
    getAdminActivityLogSuccess: (state, action) => {
      state.activityLog = action.payload;
    },
  },
});

export const {
  getActivityLogSlice,
  getCustomerActivityLogSlice,
  getAdminActivityLogSuccess,
} = activityLogSlice.actions;

export default activityLogSlice.reducer;
