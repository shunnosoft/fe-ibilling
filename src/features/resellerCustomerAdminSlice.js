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
    deleteReCustomer: (state, actions) => {
      state.resellerCustomer = state.resellerCustomer.filter(
        (item) => item.id !== actions.payload
      );
    },
  },
});

export const { getResellerCustomerSuccess, deleteReCustomer } =
  resellerCustomerSlice.actions;
export default resellerCustomerSlice.reducer;
