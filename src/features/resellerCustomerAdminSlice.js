import { createSlice } from "@reduxjs/toolkit";

const resellerCustomerSlice = createSlice({
  name: "resellerCustomer",
  initialState: {
    resellerCustomer: [],
    allResellerCustomer: [],
  },
  reducers: {
    getAllResellerCustomerSuccess: (state, actions) => {
      state.allResellerCustomer = actions.payload;
    },
    getResellerCustomerSuccess: (state, actions) => {
      state.resellerCustomer = actions.payload;
    },
    editResellerCustomerSuccess: (state, action) => {
      state.resellerCustomer[
        state.resellerCustomer.findIndex(
          (item) => item.id === action.payload.id
        )
      ] = action.payload;
    },
    editAllResellerCustomerSuccess: (state, action) => {
      state.allResellerCustomer[
        state.allResellerCustomer.findIndex(
          (item) => item.id === action.payload.id
        )
      ] = action.payload;
    },
    deleteReCustomer: (state, actions) => {
      state.resellerCustomer = state.resellerCustomer.filter(
        (item) => item.id !== actions.payload
      );
    },
  },
});

export const {
  getResellerCustomerSuccess,
  editResellerCustomerSuccess,
  deleteReCustomer,
  getAllResellerCustomerSuccess,
  editAllResellerCustomerSuccess,
} = resellerCustomerSlice.actions;
export default resellerCustomerSlice.reducer;
