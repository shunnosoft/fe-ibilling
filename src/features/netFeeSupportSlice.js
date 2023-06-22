import { createSlice } from "@reduxjs/toolkit";

export const netFeeSupportSlice = createSlice({
  name: "netFeeSupport",
  initialState: {
    netFeeSupport: [],
    ispOwnerSupport: [],
    packageChangeRequest: [],
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

    deleteIspOwnerPackageChangeRequest: (state, action) => {
      state.packageChangeRequest = state.packageChangeRequest.filter(
        (item) => item.id !== action.payload.id
      );
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
} = netFeeSupportSlice.actions;
export default netFeeSupportSlice.reducer;
