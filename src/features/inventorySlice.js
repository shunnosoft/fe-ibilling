import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
  },
  reducers: {
    getProducts: (state, { payload }) => {
      state.products = payload;
    },
  },
});

export const { getProducts } = productSlice.actions;
export default productSlice.reducer;
