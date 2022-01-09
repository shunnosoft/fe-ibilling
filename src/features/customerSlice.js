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
  isUpdate: false,
};

const customerSliec = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setIsUpdate: (state, { payload }) => {
      state.isUpdate = payload;
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

export const { setCustomer, setIsUpdate } = customerSliec.actions;
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
