import { createSlice } from "@reduxjs/toolkit";

const expenditureSlice = createSlice({
  name: "expenditure",
  initialState: {
    allExpenditures: [],
    expenditurePourposes: [],
  },
  reducers: {
    getExpenditureSuccess: (state, { payload }) => {
      state.allExpenditures = payload;
    },
    addExpenditureSuccess: (state, { payload }) => {
      state.allExpenditures.push(payload);
    },
    editExpenditureSuccess: (state, { payload }) => {
      state.allExpenditures[
        state.allExpenditures.findIndex((item) => item.id === payload.id)
      ] = payload;
    },
    deleteExpenditureSuccess: (state, { payload }) => {
      state.allExpenditures = state.allExpenditures.filter(
        (item) => item.id !== payload
      );
    },
    getExpenditureSectorsSuccess: (state, { payload }) => {
      state.expenditurePourposes = payload;
    },
    addExpenditureSectorsSuccess: (state, { payload }) => {
      state.expenditurePourposes.push(payload);
    },
    editExpenditureSectorsSuccess: (state, { payload }) => {
      state.expenditurePourposes[
        state.expenditurePourposes.findIndex((item) => item.id === payload.id)
      ] = payload;
    },
  },
});

export const {
  getExpenditureSuccess,
  addExpenditureSuccess,
  editExpenditureSuccess,
  deleteExpenditureSuccess,
  editExpenditureSectorsSuccess,
  getExpenditureSectorsSuccess,
  addExpenditureSectorsSuccess,
} = expenditureSlice.actions;
export default expenditureSlice.reducer;
