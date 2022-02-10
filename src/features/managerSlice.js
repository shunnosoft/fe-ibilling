import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isFetching: false,
  manager: {},
  error: false,
};

const managerSlice = createSlice({
  name: "manager",
  initialState,
  reducers: {
    managerFetchStart: (state) => {
      state.isFetching = true;
    },
    managerFetchSuccess: (state, action) => {
      state.isFetching = false;
      state.manager = action.payload;
      
    },
    managerFetchFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
  },
});

export const { managerFetchStart, managerFetchSuccess, managerFetchFailure } =
  managerSlice.actions;

export default managerSlice.reducer;
