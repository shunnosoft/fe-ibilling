import { createSlice } from "@reduxjs/toolkit";

const adminNetFeeSupportSlice = createSlice({
  name: "support",
  initialState: {
    adminSupport: [],
    ispOwnerSupport: [],
    bulletinPermission: [],
  },
  reducers: {
    getAdminSupport: (state, action) => {
      state.adminSupport = action.payload;
    },
    updateAdminSupport: (state, action) => {
      const supportFind = state.adminSupport.findIndex(
        (item) => item.id === action.payload.id
      );
      state.adminSupport[supportFind] = action.payload;
    },
    deleteAdminSupport: (state, action) => {
      state.adminSupport = state.adminSupport.filter(
        (item) => item.id !== action.payload.id
      );
    },
    getIspOwnerSupport: (state, action) => {
      state.ispOwnerSupport = action.payload;
    },
    updateIspOwnerSupport: (state, action) => {
      const supportIndex = state.ispOwnerSupport.findIndex(
        (item) => item.id === action.payload.id
      );
      state.ispOwnerSupport[supportIndex] = action.payload;
    },
    deleteIspOwnerSupport: (state, action) => {
      state.ispOwnerSupport = state.ispOwnerSupport.filter(
        (item) => item.id !== action.payload.id
      );
    },

    bulletinPermissionSuccess: (state, action) => {
      state.bulletinPermission = action.payload;
    },

    updatePermissionSuccess: (state, action) => {
      const permissionIndex = state.bulletinPermission.findIndex(
        (item) => item.id === action.payload.id
      );
      state.bulletinPermission[permissionIndex] = action.payload;
    },
  },
});

export const {
  getAdminSupport,
  updateAdminSupport,
  deleteAdminSupport,
  getIspOwnerSupport,
  deleteIspOwnerSupport,
  updateIspOwnerSupport,
  bulletinPermissionSuccess,
  updatePermissionSuccess,
} = adminNetFeeSupportSlice.actions;
export default adminNetFeeSupportSlice.reducer;
