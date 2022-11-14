import { createSlice } from "@reduxjs/toolkit";

export const supportTicketSlice = createSlice({
  name: "supportTicket",
  initialState: {
    supportTickets: [],
  },
  reducers: {
    getSupportTickets: (state, action) => {
      state.supportTickets = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { getSupportTickets } = supportTicketSlice.actions;

export default supportTicketSlice.reducer;
