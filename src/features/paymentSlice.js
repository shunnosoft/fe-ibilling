import { createSlice, current } from "@reduxjs/toolkit";

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    balance: "",
    previousBalance: "",
    allDeposit: [],
    collectorDeposite: [],
    allBills: [],
    myDeposit: [],
    customerInvoice: [],
    withdrawBalance: [],
  },
  reducers: {
    getTotalBalanceSuccess: (state, action) => {
      state.balance = action.payload.balance;
      state.previousBalance = action.payload.previousMonthBalance;
    },

    getDepositSuccess: (state, action) => {
      state.allDeposit = action.payload;
    },
    getCollectorDeposite: (state, action) => {
      state.collectorDeposite = action.payload;
    },

    addDepositSucces: (state, action) => {
      state.myDeposit.push(action.payload);
    },

    updateDepositSuccess: (state, action) => {
      state.allDeposit[
        state.allDeposit.findIndex((item) => item.id === action.payload.id)
      ] = action.payload;
    },

    getAllBillsSuccess: (state, action) => {
      state.allBills = action.payload;
    },

    editBillReportSuccess: (state, action) => {
      state.allBills[
        state.allBills.findIndex((item) => item.id === action.payload.id)
      ] = action.payload;
    },

    getmyDepositSucces: (state, action) => {
      state.myDeposit = action.payload;
    },

    clearBills: (state) => {
      state.balance = "";
      state.allBills = [];
      state.allDeposit = [];
    },
    getCustomerInvoice: (state, action) => {
      state.customerInvoice = action.payload;
    },
    updateCustomerInvoice: (state, { payload }) => {
      state.customerInvoice[
        state.customerInvoice.findIndex((item) => item.id === payload.id)
      ] = payload;
    },
    deleteCustomerInvoice: (state, action) => {
      state.customerInvoice = state.customerInvoice.filter(
        (item) => item.id !== action.payload.id
      );
    },

    // reseller online payment withdraw
    getWithdrawBalance: (state, action) => {
      state.withdrawBalance = action.payload;
    },

    postWithdrawBalance: (state, action) => {
      state.withdrawBalance.push(action.payload);
    },
  },
});

export const {
  clearBills,
  getmyDepositSucces,
  getAllBillsSuccess,
  editBillReportSuccess,
  getTotalBalanceSuccess,
  getDepositSuccess,
  updateDepositSuccess,
  addDepositSucces,
  getCollectorDeposite,
  getCustomerInvoice,
  updateCustomerInvoice,
  deleteCustomerInvoice,
  getWithdrawBalance,
  postWithdrawBalance,
} = paymentSlice.actions;
export default paymentSlice.reducer;
