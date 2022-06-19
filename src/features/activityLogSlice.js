import { createSlice } from "@reduxjs/toolkit";

const activityLogSlice = createSlice({
  name: "activityLog",
  initialState: {
    activityLog: [],
  },
  reducers: {
    getActivityLogSlice: (state, action) => {
      state.activityLog = action.payload;
    },
  },
});

export const { getActivityLogSlice } = activityLogSlice.actions;

export default activityLogSlice.reducer;
