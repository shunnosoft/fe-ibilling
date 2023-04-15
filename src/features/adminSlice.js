import { createSlice, current } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    ispOwners: [],
    singleComment: [],
    comments: [],
    ispOwnerIds: {},
    invoices: [],
    staffs: [],
    singleIspOwner: [],
  },
  reducers: {
    getIspOwnersSuccess: (state, action) => {
      state.ispOwners = action.payload;
      const ids = {};
      action.payload.map(
        (ispOwner) =>
          (ids[ispOwner.id] = {
            company: ispOwner.company,
            netFeeId: ispOwner.netFeeId,
            name: ispOwner.name,
            mobile: ispOwner.mobile,
          })
      );
      state.ispOwnerIds = ids;
    },
    getIspOwnerStaffsSuccess: (state, action) => {
      state.staffs = action.payload;
    },
    editOwner: (state, actions) => {
      state.ispOwners[
        state.ispOwners.findIndex((item) => item.id === actions.payload.id)
      ] = actions.payload;
      state.updateAdminSuccess = true;
    },
    getSingleCommentSuccess: (state, { payload }) => {
      state.singleComment = payload;
    },
    addCommentSuccess: (state, { payload }) => {
      state.singleComment.results.push(payload);
    },

    getCommentsSuccess: (state, { payload }) => {
      state.comments = payload;
    },
    editCommentSuccess: (state, { payload }) => {
      // ispOwner.comments = payload.data;
      state.comments[
        state.comments.findIndex((item) => item.id === payload.id)
      ] = payload;
    },
    getInvoicesSuccess: (state, { payload }) => {
      state.invoices = payload;
    },
    editInvoiceSuccessSuper: (state, actions) => {
      state.invoices[
        state.invoices.findIndex((item) => item.id === actions.payload.id)
      ] = actions.payload;
    },
    //single ispOwner
    getSingleIspOwnerData: (state, action) => {
      state.singleIspOwner = action.payload;
    },

    //change number for manager collector and reseller of ISPOnwer from admin page
    changeStaffsMobile: (state, action) => {
      const id = action.payload.profileId;
      const role = action.payload.role;
      const mobile = action.payload.mobile;
      if (role === "manager") state.staffs.manager.mobile = mobile;
      if (role === "collector") {
        const newCollectors = state.staffs.collectors.map((collector) => {
          if (collector.id === id) collector.mobile = mobile;
          return collector;
        });
        state.staffs.collectors = newCollectors;
      }
      if (role === "reseller") {
        const newResellers = state.staffs.resellerCustomerCount.map(
          (reseller) => {
            if (reseller.id === id) reseller.mobile = mobile;
            return reseller;
          }
        );
        state.staffs.resellerCustomerCount = newResellers;
      }
    },
  },
});

export const {
  getIspOwnersSuccess,
  getIspOwnerStaffsSuccess,
  editOwner,
  addCommentSuccess,
  getSingleCommentSuccess,
  getCommentsSuccess,
  editCommentSuccess,
  getInvoicesSuccess,
  editInvoiceSuccessSuper,
  getSingleIspOwnerData,
  changeStaffsMobile,
} = adminSlice.actions;

export default adminSlice.reducer;
