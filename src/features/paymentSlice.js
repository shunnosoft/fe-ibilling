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
    getIspOwnerCustomerInvoice: (state, action) => {
      state.customerInvoice = action.payload;
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
  getIspOwnerCustomerInvoice,
} = paymentSlice.actions;
export default paymentSlice.reducer;
