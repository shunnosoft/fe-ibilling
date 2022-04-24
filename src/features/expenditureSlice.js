import { createSlice } from "@reduxjs/toolkit";

const expenditureSlice = createSlice({
  name: "expenditure",
  initialState: {
    allExpenditures: [],
    expenditureSectors:[]
     
  },
  reducers: {
    getExpenditureSuccess: (state, { payload }) => {
      state.allExpenditures = payload;
    },
    getExpenditureSectorsSuccess: (state, { payload }) => {
      state.expenditureSectors = payload;
    },
     
  },
});

export const { getExpenditureSuccess ,getExpenditureSectorsSuccess } =
  expenditureSlice.actions;
export default expenditureSlice.reducer;
