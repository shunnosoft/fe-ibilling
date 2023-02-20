import { createSlice } from "@reduxjs/toolkit";

const adminNetFeeSupportSlice = createSlice({
  name: "support",
  initialState: {
    adminSupport: [],
  },
  reducers: {
    getAdminSupport: (state, action) => {
      state.adminSupport = action.payload;
    },
    updateAdminSupport: (state, action) => {
      const supportFind = state.adminSupport.findIndex(
        (item) => item.id === action.payload.id
      );
      state.adminSupport[supportFind] = action.payload;
    },
    deleteAdminSupport: (state, action) => {
      state.adminSupport = state.adminSupport.filter(
        (item) => item.id !== action.payload.id
      );
    },
  },
});

export const { getAdminSupport, updateAdminSupport, deleteAdminSupport } =
  adminNetFeeSupportSlice.actions;
export default adminNetFeeSupportSlice.reducer;
