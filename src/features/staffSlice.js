import { createSlice } from "@reduxjs/toolkit";

const staffSlice = createSlice({
  name: "staff",
  initialState: {
    staff: [],
  },
  reducers: {
    getStaffSuccess: (state, action) => {
      state.staff = action.payload;
    },
    addStaffSuccess: (state, action) => {
      state.staff.push(action.payload);
    },
    // editCustomerSuccess: (state, action) => {
    //   //example
    //   // const array1 = [5, 12, 8, 130, 44];
    //   // array1[array1.findIndex(item=>item===12)]=120
    //   // console.log(array1)
    //   //[5, 120, 8, 130, 44]

    //   state.customer[
    //     state.customer.findIndex((item) => item.id === action.payload.id)
    //   ] = action.payload;
    // },
    // updateBalance: (state, action) => {
    //   const customer = state.customer.find(
    //     (item) => item.id === action.payload.customer
    //   );

    //   customer.balance += action.payload.amount;
    //   if (customer.balance >= customer.monthlyFee) {
    //     customer.paymentStatus = "paid";
    //   }

    //   state.customer[
    //     state.customer.findIndex((item) => item.id === customer.id)
    //   ] = customer;
    // },
    // deleteCustomerSuccess: (state, action) => {
    //   // Example
    //   // const months = ['Jan', 'March', 'April', 'June'];
    //   // months.splice(1,1);
    //   // console.log(months);
    //   // ["Jan", "April", "June"]
    //   state.customer.splice(
    //     state.customer.findIndex((item) => item.id === action.payload),
    //     1
    //   );
    // },
    // clearCustomer: (state) => {
    //   state.customer = [];
    // },
  },
});

export const { getStaffSuccess, addStaffSuccess } = staffSlice.actions;

export default staffSlice.reducer;
