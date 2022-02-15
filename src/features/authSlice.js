import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  role: null,
  isFetching: false,
  error: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logInStart: (state) => {
      state.isFetching = true;
    },
    logInSuccess: (state, action) => {
      state.isFetching = false;
      state.currentUser = action.payload;
      state.role = action.payload.user.role;
    },
    loginFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    updateProfile: (state, action) => {
      if (state.role === "ispOwner") {
        state.currentUser.ispOwner = action.payload;
      } else if (state.role === "manager") {
        state.currentUser.manager = action.payload;
      } else if (state.role === "collector") {
        state.currentUser.collector = action.payload;
      }
    },

    logOut: (state) => {
      state.currentUser = null;
    },
  },
});

export const { updateProfile, logInStart, logInSuccess, loginFailure, logOut } =
  authSlice.actions;

export default authSlice.reducer;
