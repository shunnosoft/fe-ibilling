import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    alertModalShow: false,
    alertModalData: null,
    paymentUrl: "",
  },
  reducers: {
    showModal: (state, action) => {
      state.alertModalShow = true;
      state.alertModalData = action.payload;
      state.paymentUrl = action.payload?.paymentUrl;
    },
    hideModal: (state) => {
      state.alertModalShow = false;
      state.alertModalData = null;
      state.paymentUrl = null;
    },
  },
});

export const { showModal, hideModal } = uiSlice.actions;
export default uiSlice.reducer;
