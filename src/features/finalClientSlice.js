import { createSlice } from "@reduxjs/toolkit";

const clientSlice = createSlice({
  name: "client",
  initialState: {
    paymentHistory: [],
    supportTicket:[]
  },
  reducers: {
    getAllPaymentHistory: (state, action) => {
      state.paymentHistory = action.payload;
    },
    getAllSupportTicket:(state,action)=>{
      state.supportTicket=action.payload
    },
    createSupportTicket:(state,action)=>{
      state.supportTicket=[action.payload,...state.supportTicket]
    }
  },
});

export const { getAllPaymentHistory,getAllSupportTicket,createSupportTicket } = clientSlice.actions;

export default clientSlice.reducer;
