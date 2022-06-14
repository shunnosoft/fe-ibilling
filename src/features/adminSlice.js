import { createSlice, current } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    ispOwners: [],
    singleComment: [],
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
    getSingleCommentSuccess: (state, { payload }) => {
      state.singleComment = payload;
    },
    addCommentSuccess: (state, { payload }) => {
      console.log(current(state));
      state.singleComment.results.push(payload);
    },

    getCommentsSuccess: (state, { payload }) => {
      console.log(current(state));
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
  getSingleCommentSuccess,
  getCommentsSuccess,
} = adminSlice.actions;

export default adminSlice.reducer;
