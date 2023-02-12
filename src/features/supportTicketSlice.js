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
    getAllCustomer: (state, action) => {
      state.supportTickets = action.payload;
    },

    createSupportTicket: (state, { payload }) => {
      state.supportTickets = [payload, ...state.supportTickets];
    },

    editSupportTickets: (state, action) => {
      let index = state.supportTickets.findIndex(
        (singleTicket) => singleTicket.id === action.payload.id
      );
      state.supportTickets[index] = action.payload;
      // state.supportTickets[
      //   state.supportTickets.findIndex((item) => item.id === action.payload.id)
      // ] = action.payload;
    },
    editCollectorSupportTickets: (state, action) => {
      console.log(action.payload);
      let index = state.supportTickets.findIndex(
        (singleTicket) => singleTicket.id === action.payload.id
      );
      state.supportTickets[index] = action.payload;
    },

    deleteSupportTickets: (state, action) => {
      state.supportTickets = state.supportTickets.filter(
        (ticket) => ticket.id !== action.payload
      );
    },
    deleteCollectorSupportTicket: (state, action) => {
      state.supportTickets = state.supportTickets.filter(
        (ticket) => ticket.id !== action.payload
      );
    },

    getCollectorSupportTickets: (state, action) => {
      state.supportTickets = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  getSupportTickets,
  getAllCustomer,
  createSupportTicket,
  editSupportTickets,
  deleteSupportTickets,
  getCollectorSupportTickets,
  editCollectorSupportTickets,
  deleteCollectorSupportTicket,
} = supportTicketSlice.actions;

export default supportTicketSlice.reducer;
