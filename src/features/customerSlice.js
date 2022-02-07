import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// internal imports
import apiLink from "../api/apiLink";

// redux
const initialState = {
  customer: {},
  singleCustomer: {},
};

// GET customer
export const fetchCustomer = createAsyncThunk(
  "customer/fetchCustomer",
  async (ispOwnerId) => {
    const response = await apiLink({
      method: "GET",
      url: `/v1/ispOwner/customer/${ispOwnerId}`,
      ContentType: "application/json",
    });
    const data = await response.data;
    return data;
  }
);

// POST
export const postCustomer = createAsyncThunk(
  "customer/postCustomer",
  async (data) => {
    await apiLink({
      url: "/v1/ispOwner/customer",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    })
      .then((res) => {
        if (res.status === 200) {
          toast("কাস্টমার অ্যাড সফল হয়েছে! ");
          document.querySelector("#customerModal").click();
        }
      })
      .catch((err) => {
        if (err.response) {
          toast(err.response.data.message);
        }
      });
  }
);

// EDIT patch
export const editCustomer = createAsyncThunk(
  "customer/editCustomer",
  async (data) => {
    const { singleCustomerID, ispID, ...sendingData } = data;
    await apiLink({
      url: `/v1/ispOwner/customer/${ispID}/${singleCustomerID}`,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      data: sendingData,
    })
      .then((res) => {
        if (res.status === 200) {
          toast("কাস্টমার এডিট সফল হয়েছে! ");
        }
      })
      .catch((err) => {
        if (err.response) {
          toast(err.response.data.message);
        }
      });
  }
);

// DELETE
export const deleteSingleCustomer = createAsyncThunk(
  "customer/deleteSingleCustomer",
  async (IDs) => {
    await apiLink({
      url: `/v1/ispOwner/customer/${IDs.ispID}/${IDs.customerID}`,
      method: "DELETE",
    })
      .then(() => {
        toast("কাস্টমার ডিলিট সফল হয়েছে! ");
      })
      .catch(() => toast("Server error!"));
  }
);

const customerSliec = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setSingleCustomer: (state, { payload }) => {
      state.singleCustomer = payload;
    },
  },
  extraReducers: {
    [fetchCustomer.pending]: () => {
      console.log("Customer Pending");
    },

    [fetchCustomer.fulfilled]: (state, { payload }) => {
      console.log("Customer Fetched Successfully!");
      return { ...state, customer: payload };
    },

    [fetchCustomer.rejected]: () => {
      console.log("Customer Rejected");
    },
  },
});

export const { setCustomer, setSingleCustomer } = customerSliec.actions;
export const getCustomer = (state) => state.customer.customer;
export default customerSliec.reducer;
