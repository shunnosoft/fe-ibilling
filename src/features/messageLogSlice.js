import { createSlice } from "@reduxjs/toolkit";

export const messageLogSlice = createSlice({
  name: "messageLog",
  initialState: {
    messageLog: [],
    masking: [],
    fixedNumber: [],
  },
  reducers: {
    getMessageLogSlice: (state, action) => {
      state.messageLog = action.payload;
    },
    getMaskingMessageLogSlice: (state, action) => {
      state.masking = action.payload;
    },
    getFixedNumberMessageLogSlice: (state, action) => {
      state.fixedNumber = action.payload;
    },
  },
});

export const {
  getMessageLogSlice,
  getMaskingMessageLogSlice,
  getFixedNumberMessageLogSlice,
} = messageLogSlice.actions;
export default messageLogSlice.reducer;
