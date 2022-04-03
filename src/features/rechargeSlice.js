import { createSlice } from "@reduxjs/toolkit";

export const rechargeSlice = createSlice({
  name: "recharge",
  initialState: {
    allRecharge: [],
  },
  reducers: {
    getAllrecharge: (state, action) => {
      state.allRecharge = action.payload;
    },
  },
});

export const { getAllrecharge } = rechargeSlice.actions;
export default rechargeSlice.reducer;
