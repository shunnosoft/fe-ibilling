import { createSlice } from "@reduxjs/toolkit";

const customerSliec = createSlice({
  name: "customer",
  initialState: {
    customer: [],
    staticCustomer: [],
  },
  reducers: {
    getCustomerSuccess: (state, action) => {
      state.customer = action.payload;
    },
    addCustomerSuccess: (state, action) => {
      state.customer.push(action.payload);
    },
    editCustomerSuccess: (state, action) => {
      //example
      // const array1 = [5, 12, 8, 130, 44];
      // array1[array1.findIndex(item=>item===12)]=120
      // console.log(array1)
      //[5, 120, 8, 130, 44]

      state.customer[
        state.customer.findIndex((item) => item.id === action.payload.id)
      ] = action.payload;
    },
    getStaticCustomerSuccess: (state, action) => {
      state.staticCustomer = action.payload;
    },
    addStaticCustomerSuccess: (state, action) => {
      state.staticCustomer.push(action.payload);
    },
    editStaticCustomerSuccess: (state, action) => {
      state.staticCustomer[
        state.staticCustomer.findIndex((item) => item.id === action.payload.id)
      ] = action.payload;
    },
    updateBalance: (state, action) => {
      const customer = state.customer.find(
        (item) => item.id === action.payload.customer
      );

      customer.balance += action.payload.amount;
      if (customer.balance >= customer.monthlyFee) {
        customer.paymentStatus = "paid";
      }

      state.customer[
        state.customer.findIndex((item) => item.id === customer.id)
      ] = customer;
    },
    updateBalanceStaticCustomer: (state, action) => {
      const customer = state.staticCustomer.find(
        (item) => item.id === action.payload.customer
      );

      customer.balance += action.payload.amount;
      if (customer.balance >= customer.monthlyFee) {
        customer.paymentStatus = "paid";
      }

      state.staticCustomer[
        state.staticCustomer.findIndex((item) => item.id === customer.id)
      ] = customer;
    },
    deleteCustomerSuccess: (state, action) => {
      state.customer.splice(
        state.customer.findIndex((item) => item.id === action.payload),
        1
      );
    },
    deleteStaticCustomerSuccess: (state, action) => {
      state.staticCustomer.splice(
        state.staticCustomer.findIndex((item) => item.id === action.payload),
        1
      );
    },
    clearCustomer: (state) => {
      state.customer = [];
      state.staticCustomer = [];
    },
  },
});

export const {
  getCustomerSuccess,
  clearCustomer,
  addCustomerSuccess,
  editCustomerSuccess,
  deleteCustomerSuccess,
  updateBalance,
  updateBalanceStaticCustomer,
  getStaticCustomerSuccess,
  addStaticCustomerSuccess,
  editStaticCustomerSuccess,
  deleteStaticCustomerSuccess,
} = customerSliec.actions;

export default customerSliec.reducer;
