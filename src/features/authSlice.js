import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  role: null,
  ispOwnerId: "",
  userData: {},
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
      state.role = action.payload?.user.role;
      action.payload?.user.role === "ispOwner"
        ? (state.ispOwnerId = action.payload?.ispOwner?.id) &&
          (state.userData = action.payload?.ispOwner)
        : action.payload?.user.role === "manager"
        ? (state.ispOwnerId = action.payload.manager.ispOwner) &&
          (state.userData = action.payload?.manager)
        : action.payload?.user.role === "collector"
        ? (state.ispOwnerId = action.payload.collector.ispOwner) &&
          (state.userData = action.payload?.collector)
        : (state.ispOwnerId = "");
    },
    loginFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    updateProfile: (state, action) => {
      if (state.role === "ispOwner") {
        state.currentUser.ispOwner = action.payload;
        state.userData=action.payload
      } else if (state.role === "manager") {
        state.currentUser.manager = action.payload;
        state.userData=action.payload
      } else if (state.role === "collector") {
        state.currentUser.collector = action.payload;
        state.userData=action.payload
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
