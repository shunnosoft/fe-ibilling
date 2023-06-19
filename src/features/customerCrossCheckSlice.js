import { createSlice } from "@reduxjs/toolkit";

const customerCrossCheckSlice = createSlice({
  name: "customer",
  initialState: {
    netFeeCustomer: [],
    mikrotikCustomer: [],
  },
  reducers: {
    getNetFeeCustomerSuccess: (state, { payload }) => {
      state.netFeeCustomer = payload;
    },
    getMikrotikCustomerSuccess: (state, { payload }) => {
      state.mikrotikCustomer = payload;
    },
    deleteNetFeeCustomerSuccess: (state, action) => {
      state.netFeeCustomer.splice(
        state.netFeeCustomer.findIndex((item) => item.id === action.payload),
        1
      );
    },
    deleteMikrotikCustomerSuccess: (state, action) => {
      state.mikrotikCustomer.splice(
        state.mikrotikCustomer.findIndex(
          (item) => item.name === action.payload
        ),
        1
      );
    },
  },
});

export const {
  getNetFeeCustomerSuccess,
  getMikrotikCustomerSuccess,
  deleteNetFeeCustomerSuccess,
  deleteMikrotikCustomerSuccess,
} = customerCrossCheckSlice.actions;
export default customerCrossCheckSlice.reducer;
