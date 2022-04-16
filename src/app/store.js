import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import customerSlice from "../features/customerSlice";
import areaSlice from "../features/areaSlice";
import mikrotikSlice from "../features/mikrotikSlice";
import resellerSlice from "../features/resellerSlice";
import collectorSlice from "../features/collectorSlice";
import paymentSlice from "../features/paymentSlice";
import managerSlice from "../features/managerSlice";
import chartsSlice from "../features/chartsSlice";
import rechargeSlice from "../features/rechargeSlice";
import invoiceSlice from "../features/invoiceSlice";
import packageSlice from "../features/packageSlice";
import adminSlice from "../features/adminSlice";
import uiSlice from "../features/uiSlice";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// import persistCombineReducers from "redux-persist/es/persistCombineReducers";
const persistConfig = {
  key: "root",
  version: 1,
  storage,
};
const rootReducer = combineReducers({
  auth: authReducer,
  customer: customerSlice,
  area: areaSlice,
  mikrotik: mikrotikSlice,
  reseller: resellerSlice,
  collector: collectorSlice,
  manager: managerSlice,
  payment: paymentSlice,
  chart: chartsSlice,
  recharge: rechargeSlice,
  invoice: invoiceSlice,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: {
    persistedReducer,
    ui: uiSlice,
    package: packageSlice,
    admin: adminSlice,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

export default store;
export const persistor = persistStore(store);
