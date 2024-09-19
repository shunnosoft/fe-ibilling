import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  devices: [],
  outputs: [],
  diagram: {},
};

const networkSlice = createSlice({
  name: "network",
  initialState,
  reducers: {
    getNetworkDeviceSuccess: (state, action) => {
      state.devices = action.payload;
    },

    getNetworkDeviceOutputSuccess: (state, action) => {
      state.outputs = action.payload;
    },

    postNetworkDeviceSuccess: (state, action) => {
      state.devices.push(action.payload);
    },

    updateNetworkDeviceSuccess: (state, action) => {
      const { updatedDevice, networkDeviceOutput } = action.payload;

      // Find the index of the main device to be updated
      const deviceIndex = state.devices.findIndex(
        (device) => device.id === updatedDevice.id
      );

      if (deviceIndex !== -1) {
        // Update the existing device in the devices array
        state.devices[deviceIndex] = {
          ...state.devices[deviceIndex],
          ...updatedDevice,
        };

        // Update the network device output array if it exists
        if (networkDeviceOutput && networkDeviceOutput.length > 0) {
          state.outputs = state.outputs.map((output) => {
            // Find the corresponding updated output by id
            const updatedOutput = networkDeviceOutput.find(
              (item) => item.id === output.id
            );
            // If the output matches, update it, otherwise return the original output
            return updatedOutput ? { ...output, ...updatedOutput } : output;
          });
        }
      }
    },

    getNetworkDiagramDeviceSuccess: (state, action) => {
      state.diagram = action.payload;
    },
  },
});

export const {
  getNetworkDeviceSuccess,
  getNetworkDeviceOutputSuccess,
  postNetworkDeviceSuccess,
  updateNetworkDeviceSuccess,
  getNetworkDiagramDeviceSuccess,
} = networkSlice.actions;

export default networkSlice.reducer;
