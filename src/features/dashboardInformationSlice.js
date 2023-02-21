import { createSlice } from "@reduxjs/toolkit";

const dashboardInformation = createSlice({
  name: "dashboardInformation",
  initialState: {
    inactiveCustomer: [],
  },
  reducers: {
    getInactiveCustomerSuccess: (state, action) => {
      state.inactiveCustomer = action.payload;
    },
  },
});

export const { getInactiveCustomerSuccess } = dashboardInformation.actions;

export default dashboardInformation.reducer;
