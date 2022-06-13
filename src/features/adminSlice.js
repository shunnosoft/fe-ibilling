import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    ispOwners: [],
    comments: [],
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
    addCommentSuccess: (state, { payload }) => {
      state.comments.push(payload);
    },
    getCommentsSuccess: (state, { payload }) => {
      state.comments = payload;
    },
    // updateComment: (state, { payload }) => {
    //   const ispOwner = state.ispOwners.find(
    //     (item) => item.id === payload.ownerId
    //   );

    //   ispOwner.comments = payload.data;
    //   state.ispOwners[
    //     state.ispOwners.findIndex((item) => item.id === payload.ownerId)
    //   ] = ispOwner;
    //   state.updateAdminSuccess = true;
    // },
  },
});

export const {
  getIspOwnersSuccess,
  editOwner,
  addCommentSuccess,
  getCommentsSuccess,
} = adminSlice.actions;

export default adminSlice.reducer;
