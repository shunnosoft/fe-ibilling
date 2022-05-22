import { createSlice } from "@reduxjs/toolkit";

const resellerParchaseSmsSlice = createSlice({
  name: "smsParchase",
  initialState: {
    smsParchase: [],
  },
  reducers: {
    getParchaseHistorySuccess: (state, actions) => {
      state.smsParchase = actions.payload;
    },
    parchaseSmsSuccess: (state, { payload }) => {
      console.log(payload);
      state.smsParchase.unshift(payload);
    },
  },
});

export const { parchaseSmsSuccess, getParchaseHistorySuccess } =
  resellerParchaseSmsSlice.actions;
export default resellerParchaseSmsSlice.reducer;
