import { createSlice} from "@reduxjs/toolkit";
 

export const resellerSlice = createSlice({
  name: "reseller",
  initialState: {
    reseller: [],
  },
  reducers: {
    getResellerrSuccess: (state, action) => {
      state.reseller = action.payload;
    },
    addResellerSuccess: (state, action) => {
      state.reseller.push(action.payload);
    },
    editResellerSuccess: (state, action) => {
      state.reseller[
        state.reseller.findIndex((item) => item.id === action.payload.id)
      ] = action.payload;
    },
    deleteResellerSuccess: (state, action) => {
      state.reseller.splice(
        state.reseller.findIndex((item) => item.id === action.payload),
        1
      );
    },
    clearReseller: (state) => {
      state.reseller = [];
    },
  },
});
export const {
  getResellerrSuccess,
  addResellerSuccess,
  editResellerSuccess,
  deleteResellerSuccess,
  clearReseller
} = resellerSlice.actions;
export default resellerSlice.reducer;
