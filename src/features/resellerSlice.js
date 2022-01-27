import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiLink from "../api/apiLink";
import { toast } from "react-toastify";

const initialState = {
  reseller: {},
};

// POST reseller
export const postReseller = createAsyncThunk(
  "reseller/postReseller",
  async (data) => {
    await apiLink({
      url: "/v1/ispOwner/reseller",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    })
      .then(() => {
        document.querySelector("#resellerModal").click();
        toast("রি-সেলার অ্যাড সফল হয়েছে !");
      })
      .catch((err) => {
        if (err.response) {
          toast(err.response.data.message);
        }
      });
  }
);

// GET reseller
export const fetchReseller = createAsyncThunk(
  "reseller/fetchReseller",
  async (ispOwner) => {
    const res = await apiLink({
      url: `/v1/ispOwner/reseller/${ispOwner}`,
      method: "GET",
    });
    const data = await res.data;
    return data;
  }
);

// Edit reseller
export const editReseller = createAsyncThunk(
  "reseller/editReseller",
  async (data) => {
    console.log("Edit slice: ", data);
    const { ispId, resellerId, ...rest } = data;
    await apiLink({
      url: `/v1/ispOwner/reseller/${ispId}/${resellerId}`,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      data: rest,
    })
      .then(() => {
        document.querySelector("#resellerModal").click();
        toast("রি-সেলার Edit সফল হয়েছে !");
      })
      .catch((err) => {
        if (err.response) {
          toast(err.response.data.message);
        }
      });
  }
);

// Delete reseller
export const deleteReseller = createAsyncThunk(
  "reseller/deleteReseller",
  async (IDs) => {
    const { ispId, resellerId } = IDs;
    console.log(ispId, resellerId);
    await apiLink({
      url: `/v1/ispOwner/reseller/${ispId}/${resellerId}`,
      method: "DELETE",
    })
      .then(() => {
        document.querySelector("#resellerModal").click();
        toast("রি-সেলার Delete সফল হয়েছে !");
      })
      .catch((err) => {
        if (err.response) {
          toast(err.response.data.message);
        }
      });
  }
);

export const resellerSlice = createSlice({
  name: "reseller",
  initialState,
  extraReducers: {
    [fetchReseller.fulfilled]: (state, { payload }) => {
      return { ...state, reseller: payload };
    },
    [fetchReseller.rejected]: () => {
      console.log("Reseeller Rejected");
    },
  },
});
export const getReseller = (state) => state.reseller.reseller;
export default resellerSlice.reducer;
