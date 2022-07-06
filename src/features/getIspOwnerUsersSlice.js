import { createSlice } from "@reduxjs/toolkit";

const getOwnerUserSlice = createSlice({
  name: "ownerUser",
  initialState: {
    ownerUser: [],
  },
  reducers: {
    getOwnerUserSuccess: (state, action) => {
      state.ownerUser = action.payload;
    },
  },
});

export const { getOwnerUserSuccess } = getOwnerUserSlice.actions;

export default getOwnerUserSlice.reducer;
