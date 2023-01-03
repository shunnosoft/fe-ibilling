import { createSlice } from "@reduxjs/toolkit";

const netfeeSettingsSlice = createSlice({
  name: "netfeeSettings",
  initialState: {
    netfeeSettings: [],
  },
  reducers: {
    getNetfeeSettingsSuccess: (state, action) => {
      state.netfeeSettings = action.payload;
    },
  },
});

export const { getNetfeeSettingsSuccess } = netfeeSettingsSlice.actions;

export default netfeeSettingsSlice.reducer;
