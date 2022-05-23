import { createSlice } from "@reduxjs/toolkit";

export const mikroTikSlice = createSlice({
  name: "mikrotik",
  initialState: {
    isLoading: false,
    mikrotik: [],
    pppoeUser: [],
    pppoeActiveUser: [],
    pppoePackage: [],
    mikrotikSyncUser: [],
    packagefromDatabase: [],
  },
  reducers: {
    mtkIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    //mikrotik
    getMikrotikSuccess: (state, action) => {
      state.mikrotik = action.payload;
    },
    editMikrotikSuccess: (state, action) => {
      state.mikrotik[
        state.mikrotik.findIndex((item) => item.id === action.payload.id)
      ] = action.payload;
    },
    addMikrotikSuccess: (state, action) => {
      state.mikrotik.push(action.payload);
    },
    deleteMikrotikSuccess: (state, action) => {
      state.mikrotik = state.mikrotik.filter(
        (item) => item.id !== action.payload
      );
    },
    //pppoeUser
    getpppoeUserSuccess: (state, action) => {
      state.pppoeUser = action.payload;
    },
    resetpppoeUser: (state, action) => {
      state.pppoeUser = [];
    },
    //syncuser
    fetchMikrotikSyncUserSuccess: (state, action) => {
      state.mikrotikSyncUser = action.payload;
    },
    //sync simple-queue user
    fetchMikrotikSyncSimpleQueueUserSuccess: (state, action) => {
      state.mikrotikSyncSimpleQueueUser = action.payload;
    },
    //pppoeActiveUser
    getpppoeActiveUserSuccess: (state, action) => {
      state.pppoeActiveUser = action.payload;
    },
    resetpppoeActiveUser: (state, action) => {
      state.pppoeActiveUser = [];
    },
    //pppoePackage
    getpppoePackageSuccess: (state, action) => {
      state.pppoePackage = action.payload;
    },
    resetpppoePackage: (state, action) => {
      state.pppoePackage = [];
    },
    getPackagefromDatabaseSuccess: (state, action) => {
      state.packagefromDatabase = action.payload;
      state.pppoePackage = action.payload;
    },
    resetPackagefromDatabase: (state, action) => {
      state.packagefromDatabase = [];
      state.pppoePackage = [];
    },
    editpppoePackageSuccess: (state, action) => {
      state.pppoePackage[
        state.pppoePackage.findIndex((item) => item.id === action.payload.id)
      ] = action.payload;
    },
    addpppoePackageSuccess: (state, action) => {
      state.pppoePackage.push(action.payload);
    },
    deletepppoePackageSuccess: (state, action) => {
      state.pppoePackage = state.pppoePackage.filter(
        (item) => item.id !== action.payload
      );
    },
    clearMikrotik: (state) => {
      state.mikrotik = [];
      state.pppoeActiveUser = [];
      state.pppoePackage = [];
      state.pppoeUser = [];
      state.mikrotikSyncUser = [];
    },
    resetMikrotikUserAndPackage: (state) => {
      state.pppoeActiveUser = [];
      state.pppoePackage = [];
      state.pppoeUser = [];
      state.packagefromDatabase = [];
    },
  },
});

export const {
  mtkIsLoading,
  clearMikrotik,
  getMikrotikSuccess,
  addMikrotikSuccess,
  editMikrotikSuccess,
  getpppoeUserSuccess,
  resetpppoeUser,
  deleteMikrotikSuccess,
  getpppoePackageSuccess,
  resetpppoePackage,
  addpppoePackageSuccess,
  editpppoePackageSuccess,
  deletepppoePackageSuccess,
  getpppoeActiveUserSuccess,
  resetpppoeActiveUser,
  fetchMikrotikSyncUserSuccess,
  getPackagefromDatabaseSuccess,
  resetPackagefromDatabase,
  resetMikrotikUserAndPackage,
  fetchMikrotikSyncSimpleQueueUserSuccess,
} = mikroTikSlice.actions;

export default mikroTikSlice.reducer;
