import { createSlice } from "@reduxjs/toolkit";

const customerSliec = createSlice({
  name: "customer",
  initialState: {
    customer: [],
    staticCustomer: [],
    staticActiveCustomer: [],
  },
  reducers: {
    getCustomerSuccess: (state, action) => {
      state.customer = action.payload;
    },
    addCustomerSuccess: (state, action) => {
      state.customer.push(action.payload);
    },
    editCustomerSuccess: (state, action) => {
      state.customer[
        state.customer.findIndex((item) => item.id === action.payload.id)
      ] = action.payload;
    },
    getStaticCustomerSuccess: (state, action) => {
      state.staticCustomer = action.payload;
    },
    getStaticCustomerActiveSuccess: (state, action) => {
      state.staticActiveCustomer = action.payload;
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
        customer.status = "active";
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
        customer.status = "active";
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
  getStaticCustomerActiveSuccess,
} = customerSliec.actions;

export default customerSliec.reducer;
