import { createSlice, current } from "@reduxjs/toolkit";

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    balance: "",
    previousBalance: "",
    allDeposit: [],
    collectorDeposite: [],
    collectorDeposit: [],
    allBills: [],
    myDeposit: [],
    customerInvoice: [],
    withdrawBalance: [],
    billReport: [],
    webhookMessage: [],
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

    deleteBillReportSuccess: (state, action) => {
      state.allBills = state.allBills.filter(
        (item) => item.id !== action.payload.id
      );
    },

    getmyDepositSucces: (state, action) => {
      state.myDeposit = action.payload;
    },

    getDepositReportSuccess: (state, action) => {
      state.collectorDeposit = action.payload;
    },

    updateDepositReportSuccess: (state, action) => {
      state.collectorDeposit[
        state.collectorDeposit.findIndex(
          (item) => item.id === action.payload.id
        )
      ] = action.payload;
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

    //single customer all bill report action
    getCustomerBillReport: (state, action) => {
      state.billReport = action.payload;
    },

    deleteCustomerBillReport: (state, action) => {
      state.billReport = state.billReport.filter(
        (item) => item.id !== action.payload?.monthlyBill.id
      );
    },

    // webhook message action
    getAllWebhookMessageSuccess: (state, action) => {
      state.webhookMessage = action.payload;
    },

    // update webhook message reference action
    updateReferenceIDSuccess: (state, action) => {
      state.webhookMessage[
        state.webhookMessage.findIndex((item) => item.id === action.payload.id)
      ] = action.payload;
    },
  },
});

export const {
  clearBills,
  getmyDepositSucces,
  getAllBillsSuccess,
  editBillReportSuccess,
  deleteBillReportSuccess,
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
  getDepositReportSuccess,
  updateDepositReportSuccess,
  getCustomerBillReport,
  deleteCustomerBillReport,
  getAllWebhookMessageSuccess,
  updateReferenceIDSuccess,
} = paymentSlice.actions;
export default paymentSlice.reducer;
