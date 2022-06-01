import { createSlice } from "@reduxjs/toolkit";

const resellerCustomerSlice = createSlice({
  name: "resellerCustomer",
  initialState: {
    resellerCustomer: [],
  },
  reducers: {
    getResellerCustomerSuccess: (state, actions) => {
      console.log(actions.payload);
      state.resellerCustomer = actions.payload;
    },
  },
});

export const { getResellerCustomerSuccess } = resellerCustomerSlice.actions;
export default resellerCustomerSlice.reducer;
