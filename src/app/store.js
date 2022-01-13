import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/authSlice";
import customerSlice from "../features/customerSlice";
import linemanSlice from "../features/linemanSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    customer: customerSlice,
    lineman: linemanSlice,
  },
});
