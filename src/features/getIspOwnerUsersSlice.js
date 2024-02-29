import { createSlice } from "@reduxjs/toolkit";

const getOwnerUserSlice = createSlice({
  name: "ownerUser",
  initialState: {
    ownerUser: [],
    userStaff: [],
  },
  reducers: {
    getOwnerUserSuccess: (state, action) => {
      state.ownerUser = action.payload;
    },

    getUserStaffSuccess: (state, action) => {
      state.userStaff = action.payload;
    },
  },
});

export const { getOwnerUserSuccess, getUserStaffSuccess } =
  getOwnerUserSlice.actions;

export default getOwnerUserSlice.reducer;
