import { createSlice } from "@reduxjs/toolkit";

export const mikroTikSlice = createSlice({
  name: "mikrotik",
  initialState: {
    mikrotik: [],
    pppoeUser: [],
    pppoeActiveUser: [],
    pppoePackage: [],
    mikrotikSyncUser:[]
  },
  reducers: {
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
      state.pppoeActiveUser = action.payload;
    },
    //syncuser
    fetchMikrotikSyncUserSuccess:(state,action)=>{
      state.mikrotikSyncUser=action.payload

    },
    //pppoeActiveUser
    getpppoeActiveUserSuccess: (state, action) => {
      state.pppoeUser = action.payload;
    },
    //pppoePackage
    getpppoePackageSuccess: (state, action) => {
      state.pppoePackage = action.payload;
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
    clearMikrotik:(state)=>{
      state.mikrotik=[]
      state.pppoeActiveUser=[]
      state.pppoePackage=[]
      state.pppoeUser=[]
    }
  },
});

export const {
  clearMikrotik,
  getMikrotikSuccess,
  addMikrotikSuccess,
  editMikrotikSuccess,
  getpppoeUserSuccess,
  deleteMikrotikSuccess,
  getpppoePackageSuccess,
  addpppoePackageSuccess,
  editpppoePackageSuccess,
  deletepppoePackageSuccess,
  getpppoeActiveUserSuccess,
  fetchMikrotikSyncUserSuccess
} =mikroTikSlice.actions;

export default mikroTikSlice.reducer;

