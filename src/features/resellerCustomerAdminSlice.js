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

    bulkUpdate: (state, { payload }) => {
      //get the user type
      const userType = payload[0].userType;
      let customers;
      //get the value from state based on userType
      if (userType === "pppoe") {
        customers = [...state.resellerCustomer];
      } else if (userType === "simple-queue" || userType === "firewall-queue") {
        customers = [...state.resellerCustomer];
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
        state.resellerCustomer = [...customers];
      } else if (userType === "simple-queue" || userType === "firewall-queue") {
        state.resellerCustomer = [...customers];
      }
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
  bulkUpdate,
} = resellerCustomerSlice.actions;
export default resellerCustomerSlice.reducer;
