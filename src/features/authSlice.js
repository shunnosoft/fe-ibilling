import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuth: false,
  accessToken: "",
  ispOwner: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, { payload }) => {
      state.isAuth = payload;
    },
    setAccessToken: (state, { payload }) => {
      state.accessToken = payload;
    },
    setIspOwner: (state, { payload }) => {
      state.ispOwner = payload;
    },
  },
});

export const { setAuth, accessToken, setIspOwner } = authSlice.actions;
export default authSlice.reducer;
