import { createSlice } from "@reduxjs/toolkit";

const customerSliec = createSlice({
  name: "customer",
  initialState: {
    customer: [],
  },
  reducers: {
    getCustomerSuccess: (state, action) => {
      state.customer = action.payload.results;
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
    deleteCustomerSuccess: (state, action) => {
      // Example
      // const months = ['Jan', 'March', 'April', 'June'];
      // months.splice(1,1);
      // console.log(months);
      // ["Jan", "April", "June"]
      state.customer.splice(
        state.customer.findIndex((item) => item.id === action.payload),
        1
      );
    },
    clearCustomer: (state) => {
      state.customer = [];
    },
  },
});

export const {
  getCustomerSuccess,
  clearCustomer,
  addCustomerSuccess,
  editCustomerSuccess,
  deleteCustomerSuccess,
} = customerSliec.actions;

export default customerSliec.reducer;
