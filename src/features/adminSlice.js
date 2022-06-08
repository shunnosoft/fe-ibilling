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
      state.ispOwners[
        state.ispOwners.findIndex((item) => item.id === actions.payload.id)
      ] = actions.payload;
      state.updateAdminSuccess = true;
    },
    updateComment: (state, { payload }) => {
      console.log(payload);
      const ispOwner = state.ispOwners.find(
        (item) => item.id === payload.ownerId
      );

      ispOwner.comments = payload.data;
      state.ispOwners[
        state.ispOwners.findIndex((item) => item.id === payload.ownerId)
      ] = ispOwner;
      state.updateAdminSuccess = true;
    },
  },
});

export const { getIspOwnersSuccess, editOwner, updateComment } =
  adminSlice.actions;

export default adminSlice.reducer;
