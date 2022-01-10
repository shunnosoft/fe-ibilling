import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// internal imports
import apiLink from "../api/apiLink";

export const fetchCustomer = createAsyncThunk(
  "ispOwner/fetchCustomer",
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

// redux
const initialState = {
  customer: {},
  singleCustomer: {},
};

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

// customer actions

// POST
export const postCustomer = async (data) => {
  console.log("Customer data form: ", data);
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
        document.querySelector("#customerModal").click();
        alert("কাস্টমার অ্যাড সফল হয়েছে! ");
        window.location.reload();
      }
    })
    .catch((err) => {
      if (err.response) {
        toast(err.response.data.message);
      }
    });
};

// EDIT patch
export const editCustomer = async (data) => {
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
        document.querySelector("#customerEditModal").click();
        alert("কাস্টমার এডিট সফল হয়েছে! ");
        window.location.reload();
      }
    })
    .catch((err) => {
      if (err.response) {
        toast(err.response.data.message);
      }
    });
};

// DELETE
export const deleteSingleCustomer = async (IDs) => {
  await apiLink({
    url: `/v1/ispOwner/customer/${IDs.ispID}/${IDs.customerID}`,
    method: "DELETE",
  })
    .then(() => window.location.reload())
    .catch((err) => alert("Cannot Delete Customer."));
};
