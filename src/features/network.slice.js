import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  devices: [],
  diagram: {},
};

const networkSlice = createSlice({
  name: "network",
  initialState,
  reducers: {
    getNetworkDeviceSuccess: (state, action) => {
      state.devices = action.payload;
    },

    postNetworkDeviceSuccess: (state, action) => {
      state.devices.push(action.payload);
    },

    getNetworkDiagramDeviceSuccess: (state, action) => {
      state.diagram = action.payload;
    },
  },
});

export const {
  getNetworkDeviceSuccess,
  postNetworkDeviceSuccess,
  getNetworkDiagramDeviceSuccess,
} = networkSlice.actions;

export default networkSlice.reducer;
