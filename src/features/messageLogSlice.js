import { createSlice } from "@reduxjs/toolkit";

export const messageLogSlice = createSlice({
  name: "messageLog",
  initialState: {
    messageLog: [],
  },
  reducers: {
    getMessageLogSlice: (state, action) => {
      state.messageLog = action.payload;
    },
  },
});

export const { getMessageLogSlice } = messageLogSlice.actions;
export default messageLogSlice.reducer;
