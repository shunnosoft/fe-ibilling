import { createSlice } from "@reduxjs/toolkit";

export const netFeeSupportSlice = createSlice({
  name: "netFeeSupport",
  initialState: {
    netFeeSupport: [],
    ispOwnerSupport: [],
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
  },
});

export const {
  AddNetFeeSupport,
  getNetFeeSupport,
  updateNetFeeSupport,
  deleteNetFeeSupport,
  getIspOwnerSupports,
  postIspOwnerSupports,
} = netFeeSupportSlice.actions;
export default netFeeSupportSlice.reducer;
