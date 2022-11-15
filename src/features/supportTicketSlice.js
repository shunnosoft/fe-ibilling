import { createSlice, current } from "@reduxjs/toolkit";

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
      console.log(action.payload.supportTicket);
      let index = state.supportTickets.findIndex(
        (singleTicket) => singleTicket.id === action.payload.supportTicket.id
      );
      console.log(index);
      console.log(current(state.supportTickets[index]));
      state.supportTickets[index] = {
        ...state.supportTickets[index],
        status: action.payload.supportTicket.status,
      };
    },

    deleteSupportTickets: (state, action) => {
      state.supportTickets = state.supportTickets.filter(
        (ticket) => ticket.id !== action.payload
      );
    },
  },
});

// Action creators are generated for each case reducer function
export const { getSupportTickets, editSupportTickets, deleteSupportTickets } =
  supportTicketSlice.actions;

export default supportTicketSlice.reducer;
