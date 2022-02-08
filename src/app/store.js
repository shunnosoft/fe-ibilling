import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import customerSlice from "../features/customerSlice";
import linemanSlice from "../features/linemanSlice";
import areaSlice from "../features/areaSlice";
import mikrotikSlice from "../features/mikrotikSlice";
import resellerSlice from "../features/resellerSlice";
import collectorSlice from "../features/collectorSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import managerSlice from "../features/managerSlice";
// import persistCombineReducers from "redux-persist/es/persistCombineReducers";

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
}
const rootReducer=  combineReducers(
  {
    auth: authReducer,
    customer: customerSlice,
    lineman: linemanSlice,
    area: areaSlice,
    mikrotik: mikrotikSlice,
    reseller: resellerSlice,
    collector: collectorSlice,
    manager:managerSlice
  }
)
const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store ; 
export const persistor = persistStore(store)



// import { configureStore } from "@reduxjs/toolkit";


// import authSlice from "../features/authSlice";
// import customerSlice from "../features/customerSlice";
// import linemanSlice from "../features/linemanSlice";
// import areaSlice from "../features/areaSlice";
// import mikrotikSlice from "../features/mikrotikSlice";
// import resellerSlice from "../features/resellerSlice";
// import collectorSlice from "../features/collectorSlice";

// export const store = configureStore({
//   reducer: {
//     auth: authSlice,
//     customer: customerSlice,
//     lineman: linemanSlice,
//     area: areaSlice,
//     mikrotik: mikrotikSlice,
//     reseller: resellerSlice,
//     collector: collectorSlice,
//   },
// });
