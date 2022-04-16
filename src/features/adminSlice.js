import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    ispOwners: [],
  },
  reducers: {
    getIspOwnersSuccess: (state, action) => {
      state.ispOwners = action.payload;
    },
  },
});

export const { getIspOwnersSuccess } = adminSlice.actions;

export default adminSlice.reducer;
