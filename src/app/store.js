import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/authSlice";
import customerSlice from "../features/customerSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    customer: customerSlice,
  },
});
