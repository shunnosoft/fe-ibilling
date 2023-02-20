import { createSlice } from "@reduxjs/toolkit";

export const netFeeSupportSlice = createSlice({
  name: "netFeeSupport",
  initialState: {
    netFeeSupport: [],
  },
  reducers: {
    AddNetFeeSupport: (state, action) => {
      state.netFeeSupport.push(action.payload);
    },
    getNetFeeSupport: (state, action) => {
      state.netFeeSupport = action.payload;
    },
    updateNetFeeSupport: (state, action) => {
      const supportFind = state.netFeeSupport.findIndex(
        (item) => item.id === action.payload.id
      );
      state.netFeeSupport[supportFind] = action.payload;
    },
    deleteNetFeeSupport: (state, action) => {
      state.netFeeSupport = state.netFeeSupport.filter(
        (item) => item.id !== action.payload.id
      );
    },
  },
});

export const {
  AddNetFeeSupport,
  getNetFeeSupport,
  updateNetFeeSupport,
  deleteNetFeeSupport,
} = netFeeSupportSlice.actions;
export default netFeeSupportSlice.reducer;
