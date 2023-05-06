import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isPending: false,
  manager: [],
  error: false,
};

const managerSlice = createSlice({
  name: "manager",
  initialState,
  reducers: {
    //get
    managerFetchStart: (state) => {
      state.isPending = true;
    },
    managerFetchSuccess: (state, action) => {
      state.isPending = false;
      state.manager = action.payload;
    },
    managerFetchFailure: (state) => {
      state.isPending = false;
      state.error = true;
    },

    managerEditSuccess: (state, action) => {
      state.isPending = false;

      state.manager[
        state.manager.findIndex((item) => item.id === action.payload.id)
      ] = action.payload;
    },

    managerAddSuccess: (state, action) => {
      state.isPending = false;
      state.manager.push(action.payload);
    },

    managerDeleteSuccess: (state, action) => {
      state.isPending = false;
      state.manager = {};
    },
    clearManager: (state) => {
      state.manager = {};
    },
  },
});

export const {
  managerAddSuccess,
  managerDeleteSuccess,
  managerEditSuccess,
  managerFetchFailure,
  managerFetchStart,
  managerFetchSuccess,
  clearManager,
} = managerSlice.actions;

export default managerSlice.reducer;
