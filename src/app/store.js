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
import ispOwnerInvoiceSlice from "../features/ispOwnerInvoiceSlice";
import uiSlice from "../features/uiSlice";
import expenditureSlice from "../features/expenditureSlice";
import staffSlice from "../features/staffSlice";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import resellerParchaseSmsSlice from "../features/resellerParchaseSmsSlice";
import resellerSmsRequestSlice from "../features/resellerSmsRequestSlice";
import resellerCustomerAdminSlice from "../features/resellerCustomerAdminSlice";
import activityLogSlice from "../features/activityLogSlice";
import getIspOwnerUsersSlice from "../features/getIspOwnerUsersSlice";
import finalClientSlice from "../features/finalClientSlice";
import messageLogSlice from "../features/messageLogSlice";
import supportTicketSlice from "../features/supportTicketSlice";
import hotspotSlice from "../features/hotspotSlice";
// import persistCombineReducers from "redux-persist/es/persistCombineReducers";
const persistConfig = {
  key: "root",
  version: 1,
  storage,
};
const rootReducer = combineReducers({
  auth: authReducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: {
    persistedReducer,
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
    staff: staffSlice,
    smsHistory: resellerParchaseSmsSlice,
    resellerSmsRequest: resellerSmsRequestSlice,
    resellerCustomer: resellerCustomerAdminSlice,
    companyName: adminSlice,
    activityLog: activityLogSlice,
    ownerUsers: getIspOwnerUsersSlice,
    ui: uiSlice,
    package: packageSlice,
    admin: adminSlice,
    ownerInvoice: ispOwnerInvoiceSlice,
    expenditure: expenditureSlice,
    client: finalClientSlice,
    messageLog: messageLogSlice,
    supportTicket: supportTicketSlice,
    hotspotPackage: hotspotSlice,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
export const persistor = persistStore(store);
