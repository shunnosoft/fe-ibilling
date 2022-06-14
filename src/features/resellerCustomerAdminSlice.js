import { createSlice } from "@reduxjs/toolkit";

const resellerCustomerSlice = createSlice({
  name: "resellerCustomer",
  initialState: {
    resellerCustomer: [],
  },
  reducers: {
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
} = resellerCustomerSlice.actions;
export default resellerCustomerSlice.reducer;
