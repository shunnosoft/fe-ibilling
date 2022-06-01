import { createSlice } from "@reduxjs/toolkit";

export const resellerSlice = createSlice({
  name: "reseller",
  initialState: {
    reseller: [],
    allMikrotikPakages: [],
  },
  reducers: {
    getResellerrSuccess: (state, action) => {
      state.reseller = action.payload;
    },
    addResellerSuccess: (state, action) => {
      state.reseller.push(action.payload);
    },
    editResellerSuccess: (state, action) => {
      console.log(action.payload);
      state.reseller[
        state.reseller.findIndex((item) => item.id === action.payload.id)
      ] = action.payload;
    },
    editResellerforRecharge: (state, action) => {
      const findR = state.reseller.find(
        (r) => r.id === action.payload.reseller
      );
      // console.log(findR)
      state.reseller[
        state.reseller.findIndex((item) => item.id === action.payload.reseller)
      ] = {
        ...findR,
        rechargeBalance: findR.rechargeBalance + action.payload.amount,
      };
    },
    deleteResellerSuccess: (state, action) => {
      state.reseller.splice(
        state.reseller.findIndex((item) => item.id === action.payload),
        1
      );
    },
    clearReseller: (state) => {
      state.reseller = [];
    },
    getAllMikrotikPakages: (state, action) => {
      // console.log(action.payload);
      state.allMikrotikPakages = action.payload;
    },
  },
});
export const {
  getResellerrSuccess,
  addResellerSuccess,
  editResellerSuccess,
  deleteResellerSuccess,
  editResellerforRecharge,
  clearReseller,
  getAllMikrotikPakages,
} = resellerSlice.actions;
export default resellerSlice.reducer;
