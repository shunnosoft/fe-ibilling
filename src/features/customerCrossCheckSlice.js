import { createSlice } from "@reduxjs/toolkit";

const customerCrossCheckSlice = createSlice({
  name: "customer",
  initialState: {
    netFeeCustomer: [],
    netFeeStaticCustomer: [],
    mikrotikCustomer: [],
    mikrotikStaticCustomer: [],
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

    getNetFeeStaticCustomerSuccess: (state, { payload }) => {
      state.netFeeStaticCustomer = payload;
    },

    getMikrotikStaticCustomerSuccess: (state, { payload }) => {
      state.mikrotikStaticCustomer = payload;
    },
  },
});

export const {
  getNetFeeCustomerSuccess,
  getMikrotikCustomerSuccess,
  deleteNetFeeCustomerSuccess,
  deleteMikrotikCustomerSuccess,
  getNetFeeStaticCustomerSuccess,
  getMikrotikStaticCustomerSuccess,
} = customerCrossCheckSlice.actions;
export default customerCrossCheckSlice.reducer;
