import {createSlice } from "@reduxjs/toolkit";
 

const collectorSlice = createSlice({
  name: "collector",
  initialState: {
    collector: [],
  },
  reducers: {
    getCollectorSuccess: (state, action) => {
      state.collector = action.payload;
    },
    addCollectorSuccess: (state, action) => {
      state.collector.push(action.payload);
    },
    editCollectorSuccess: (state, action) => {
       
      state.collector[
        state.collector.findIndex((item) => item.id === action.payload.id)
      ] = action.payload;
    },
    deleteCollectorSuccess: (state, action) => {
      state.collector.splice(
        state.collector.findIndex((item) => item.id === action.payload),
        1
      );
    },
    clearCollector:(state)=>{
      state.collector=[]
    }
  },
});

export const {
  getCollectorSuccess,
  clearCollector,
  addCollectorSuccess,
  editCollectorSuccess,
  deleteCollectorSuccess,
} = collectorSlice.actions;

export default collectorSlice.reducer;
