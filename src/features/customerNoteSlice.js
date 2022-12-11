import { createSlice } from "@reduxjs/toolkit";

const customerNoteSlice = createSlice({
  name: "customerNote",
  initialState: {
    customerNote: [],
  },
  reducers: {
    createNote: (state, { payload }) => {
      state.customerNote.push(payload);
    },
    getNotesSuccess: (state, { payload }) => {
      state.customerNote = payload;
    },
  },
});

export const { createNote, getNotesSuccess } = customerNoteSlice.actions;
export default customerNoteSlice.reducer;
