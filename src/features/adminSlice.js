import { createSlice, current } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    ispOwners: [],
    singleComment: [],
    comments: [],
    ispOwnerIds: {},
  },
  reducers: {
    getIspOwnersSuccess: (state, action) => {
      state.ispOwners = action.payload;
      const ids = {};
      action.payload.map((ispOwner) => (ids[ispOwner.id] = ispOwner.company));
      state.ispOwnerIds = ids;
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
      state.comments = payload;
    },
    editCommentSuccess: (state, { payload }) => {
      // const ispOwner = state.ispOwners.find(
      //   (item) => item.id === payload.ownerId
      // );

      // ispOwner.comments = payload.data;
      state.comments[
        state.comments.findIndex((item) => item.id === payload.id)
      ] = state.comments;
      state.updateAdminSuccess = true;
    },
  },
});

export const {
  getIspOwnersSuccess,
  editOwner,
  addCommentSuccess,
  getSingleCommentSuccess,
  getCommentsSuccess,
  editCommentSuccess,
} = adminSlice.actions;

export default adminSlice.reducer;
