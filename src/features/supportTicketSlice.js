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
    editSupportTickets: (state, action) => {
      let filteredData = state.supportTickets.find(
        (singleTicket) => singleTicket.id === action.payload.id
      );

      state.supportTickets = {
        ...filteredData,
        status: action.payload.data,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { getSupportTickets, editSupportTickets } =
  supportTicketSlice.actions;

export default supportTicketSlice.reducer;
