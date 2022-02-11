import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiLink from "../api/apiLink";

export const fetchAsyncManager = createAsyncThunk(
  "ispOwner/fetchAsyncManager",
  async (managerId) => {
    const response = await apiLink.get(`/v1/ispOwner/manager/${managerId}`);
    const data = await response.data;
    return data;
  }
);

const initialState = {
  isAuth: false,
  accessToken: "",
  ispOwner: {},
  manager: {},
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
  extraReducers: {
    [fetchAsyncManager.pending]: () => {
      console.log("Pending");
    },

    [fetchAsyncManager.fulfilled]: (state, { payload }) => {
      console.log("Fetched Successfully!");
      return { ...state, manager: payload };
    },

    [fetchAsyncManager.rejected]: () => {
      console.log("Rejected");
    },
  },
});

export const { setAuth, accessToken, setIspOwner } = authSlice.actions;
export const getManager = (state) => state.auth.manager;
export const ispOwner = (state) => state.auth.ispOwner;
export default authSlice.reducer;
