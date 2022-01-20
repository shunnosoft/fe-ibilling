import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/authSlice";
import customerSlice from "../features/customerSlice";
import linemanSlice from "../features/linemanSlice";
import areaSlice from "../features/areaSlice";
import mikrotikSlice from "../features/mikrotikSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    customer: customerSlice,
    lineman: linemanSlice,
    area: areaSlice,
    mikrotik: mikrotikSlice,
  },
});
