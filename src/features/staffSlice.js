import { createSlice } from "@reduxjs/toolkit";

const staffSlice = createSlice({
  name: "staff",
  initialState: {
    staff: [],
    salary: [],
  },
  reducers: {
    getStaffSuccess: (state, action) => {
      state.staff = action.payload;
    },
    addStaffSuccess: (state, action) => {
      state.staff.push(action.payload);
    },
    editStaff: (state, action) => {
      state.staff[
        state.staff.findIndex((item) => item.id === action.payload.id)
      ] = action.payload;
    },
    deleteStaffSuccess: (state, action) => {
      state.staff = state.staff.filter((item) => item.id !== action.payload);
    },

    getSalarySuccess: (state, action) => {
      state.salary = action.payload;
    },
    addSalarySuccess: (state, action) => {
      state.salary.push(action.payload);
    },
    deleteSalarySuccess: (state, action) => {
      state.salary = state.salary.filter((item) => item.id !== action.payload);
    },
  },
});

export const {
  getStaffSuccess,
  addStaffSuccess,
  editStaff,
  deleteStaffSuccess,
  getSalarySuccess,
  addSalarySuccess,
  deleteSalarySuccess,
} = staffSlice.actions;

export default staffSlice.reducer;
