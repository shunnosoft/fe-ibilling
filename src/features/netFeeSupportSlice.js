import { createSlice } from "@reduxjs/toolkit";

export const netFeeSupportSlice = createSlice({
  name: "netFeeSupport",
  initialState: {
    bulletin: [],
    supportCall: [],
    netFeeSupport: [],
    ispOwnerSupport: [],
    supportNumbers: [],
    packageChangeRequest: [],
    resellerChangeRequest: [],
  },
  reducers: {
    AddNetFeeSupport: (state, action) => {
      state.netFeeSupport.push(action.payload);
    },
    getNetFeeSupport: (state, action) => {
      state.netFeeSupport = action.payload;
    },
    updateNetFeeSupport: (state, action) => {
      const supportFind = state.netFeeSupport.findIndex(
        (item) => item.id === action.payload.id
      );
      state.netFeeSupport[supportFind] = action.payload;
    },
    deleteNetFeeSupport: (state, action) => {
      state.netFeeSupport = state.netFeeSupport.filter(
        (item) => item.id !== action.payload.id
      );
    },

    // ispOwner support number
    getIspOwnerSupports: (state, action) => {
      state.ispOwnerSupport = action.payload;
    },
    postIspOwnerSupports: (state, action) => {
      state.ispOwnerSupport.push(action.payload);
    },
    updateIspOwnerSupports: (state, action) => {
      const supportFind = state.ispOwnerSupport.findIndex(
        (item) => item.id === action.payload.id
      );
      state.ispOwnerSupport[supportFind] = action.payload;
    },
    deleteIspOwnerSupports: (state, action) => {
      state.ispOwnerSupport = state.ispOwnerSupport.filter(
        (item) => item.id !== action.payload.id
      );
    },

    // ispOwner package change request
    getIspOwnerPackageChangeRequest: (state, action) => {
      state.packageChangeRequest = action.payload;
    },

    updatePackageChangeRequest: (state, action) => {
      const supportRequestIndex = state.packageChangeRequest.findIndex(
        (item) => item.id === action.payload.id
      );
      state.packageChangeRequest[supportRequestIndex] = action.payload;
    },

    // reseller change package
    getResellerChangePackageRequest: (state, action) => {
      state.resellerChangeRequest = action.payload;
    },

    updateResellerChangePackageRequest: (state, action) => {
      const changeRequest = state.resellerChangeRequest.findIndex(
        (item) => item.id === action.payload.id
      );
      state.resellerChangeRequest[changeRequest] = action.payload;
    },

    // netFee support numbers
    getSupportNumbers: (state, action) => {
      state.supportNumbers = action.payload;
    },
    postSupportNumbers: (state, action) => {
      state.supportNumbers.push(action.payload);
    },
    deleteSupportNumbers: (state, action) => {
      state.supportNumbers = state.supportNumbers.filter(
        (item) => item.id !== action.payload.id
      );
    },
    updateSupportNumbers: (state, action) => {
      const changeRequest = state.supportNumbers.findIndex(
        (item) => item.id === action.payload.id
      );
      state.supportNumbers[changeRequest] = action.payload;
    },

    // netFee bulletin
    getBulletinSuccess: (state, action) => {
      state.bulletin = action.payload;
    },
    postBulletinSuccess: (state, action) => {
      state.bulletin.push(action.payload);
    },
    patchBulletinSuccess: (state, action) => {
      const changeRequest = state.bulletin.findIndex(
        (item) => item.id === action.payload.id
      );
      state.bulletin[changeRequest] = action.payload;
    },
    deleteBulletinSuccess: (state, action) => {
      state.bulletin = state.bulletin.filter(
        (item) => item.id !== action.payload
      );
    },

    // ispOwner support call number
    getSupportCall: (state, action) => {
      state.supportCall = action.payload;
    },
  },
});

export const {
  AddNetFeeSupport,
  getNetFeeSupport,
  updateNetFeeSupport,
  deleteNetFeeSupport,
  getIspOwnerSupports,
  postIspOwnerSupports,
  updateIspOwnerSupports,
  deleteIspOwnerSupports,
  getIspOwnerPackageChangeRequest,
  deleteIspOwnerPackageChangeRequest,
  updatePackageChangeRequest,
  getResellerChangePackageRequest,
  updateResellerChangePackageRequest,
  getSupportNumbers,
  postSupportNumbers,
  deleteSupportNumbers,
  getBulletinSuccess,
  postBulletinSuccess,
  patchBulletinSuccess,
  deleteBulletinSuccess,
  getSupportCall,
  updateSupportNumbers,
} = netFeeSupportSlice.actions;
export default netFeeSupportSlice.reducer;
