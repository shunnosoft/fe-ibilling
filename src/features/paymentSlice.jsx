import { createSlice } from "@reduxjs/toolkit";

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    balance: "",
    allDeposit: [],
    allBills:[]
  },
  reducers: {
    getTotalBalanceSuccess: (state, action) => {
      state.balance = action.payload.balance;
    },
    getDepositSuccess: (state, action) => {
      state.allDeposit = action.payload;
    },
    updateDepositSuccess: (state, action) => {
      state.allDeposit[
        state.allDeposit.findIndex((item) => item.id === action.payload.id)
      ] = action.payload;
    },
    getAllBillsSuccess:(state,action) =>{
      state.allBills=action.payload
    },
    clearBills:(state) =>{
      state.balance=""
      state.allBills=[]
      state.allDeposit=[]
    }
  },
});

export const {clearBills, getAllBillsSuccess,getTotalBalanceSuccess, getDepositSuccess , updateDepositSuccess} =
  paymentSlice.actions;
export default paymentSlice.reducer;
