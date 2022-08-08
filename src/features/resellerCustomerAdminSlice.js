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
      state.allResellerCustomer = state.allResellerCustomer.filter(
        (item) => item.id !== actions.payload
      );
    },
    bulkCustomerReturn: (state, { payload }) => {
      console.log({ payload });
      let customers = [];
      if (payload.isAllCustomer) {
        customers = [...state.allResellerCustomer];
      } else {
        customers = [...state.resellerCustomer];
      }
      const updatedCustomer = [];
      //loop through existing customer
      for (let i = 0; i < customers.length; i++) {
        const element = customers[i];
        const found = payload.data.find((item) => item.id === element.id);
        if (!found) updatedCustomer.push(element);
      }
      if (payload.isAllCustomer) {
        state.allResellerCustomer = updatedCustomer;
      } else {
        state.resellerCustomer = updatedCustomer;
      }
    },
  },
});

export const {
  getResellerCustomerSuccess,
  editResellerCustomerSuccess,
  deleteReCustomer,
  getAllResellerCustomerSuccess,
  editAllResellerCustomerSuccess,
  bulkCustomerReturn,
} = resellerCustomerSlice.actions;
export default resellerCustomerSlice.reducer;
