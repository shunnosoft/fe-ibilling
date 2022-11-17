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
    createProduct: (state, { payload }) => {
      state.products = [...state.products, payload];
    },
  },
});

export const { getProducts, createProduct } = productSlice.actions;
export default productSlice.reducer;
