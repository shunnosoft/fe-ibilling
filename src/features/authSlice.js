import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isFetching: false,
  currentUser: null,
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
    },
    loginFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },

    logOut: (state) => {
      state.currentUser = null;
    },
  },
});

export const { logInStart, logInSuccess, loginFailure, logOut } =
  authSlice.actions;

export default authSlice.reducer;

// const initialState = {
//   isAuth: false,
//   accessToken: "",
//   ispOwner: {},
//   manager: {},
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setAuth: (state, { payload }) => {
//       state.isAuth = payload;
//     },
//     setAccessToken: (state, { payload }) => {
//       state.accessToken = payload;
//     },
//     setIspOwner: (state, { payload }) => {
//       state.ispOwner = payload;
//     },
//   },
//   extraReducers: {
//     [fetchAsyncManager.pending]: () => {
//       console.log("Pending");
//     },

//     [fetchAsyncManager.fulfilled]: (state, { payload }) => {
//       console.log("Fetched Successfully!");
//       return { ...state, manager: payload };
//     },

//     [fetchAsyncManager.rejected]: () => {
//       console.log("Rejected");
//     },
//   },
// });

// export const { setAuth, accessToken, setIspOwner } = authSlice.actions;
// export const getManager = (state) => state.auth.manager;
// export default authSlice.reducer;
