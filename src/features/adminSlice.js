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
    editOwner: (state, actions) => {

      state.Owner[
        state.Owner.findIndex((item) => item.id === actions.payload.id)
      ] = actions.payload;
      state.updateOwnerSuccess = true;
    },
  },
});

export const { getIspOwnersSuccess, editOwner } = adminSlice.actions;

export default adminSlice.reducer;
