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
        customer.billingCycle = action.payload.billingCycle;
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
    bulkDelete: (state, { payload }) => {
      //get the user type
      const userType = payload[0].userType;
      let customers;
      //get the value from state based on userType
      if (userType === "pppoe") {
        customers = [...state.customer];
      } else if (userType === "simple-queue") {
        customers = [...state.staticCustomer];
      }
      const updatedCustomer = [];
      //loop through existing customer
      for (let i = 0; i < customers.length; i++) {
        const element = customers[i];
        console.log({ element, payload });
        for (let j = 0; j < payload.length; j++) {
          if (element.id !== payload[j].id) {
            updatedCustomer.push(element);
          }
        }
      }
      //update the state based on userType with modified state
      if (userType === "pppoe") {
        state.customer = [...updatedCustomer];
      } else if (userType === "simple-queue" || userType === "firewall-queue") {
        state.staticCustomer = [...updatedCustomer];
      }
    },
    bulkUpdate: (state, { payload }) => {
      //get the user type
      const userType = payload[0].userType;
      let customers;
      //get the value from state based on userType
      if (userType === "pppoe") {
        customers = [...state.customer];
      } else if (userType === "simple-queue") {
        customers = [...state.staticCustomer];
      }
      for (let i = 0; i < customers.length; i++) {
        const element = customers[i];
        for (let j = 0; j < payload.length; j++) {
          if (element.id === payload[j].id) {
            customers[i] = payload[j];
          }
        }
      }
      //update the state based on userType with modified state
      if (userType === "pppoe") {
        state.customer = [...customers];
      } else if (userType === "simple-queue" || userType === "firewall-queue") {
        state.staticCustomer = [...customers];
      }
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
  bulkDelete,
  bulkUpdate,
} = customerSliec.actions;

export default customerSliec.reducer;
