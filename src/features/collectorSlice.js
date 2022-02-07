import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// internal imports
import apiLink from "../api/apiLink";

const initialState = {
  collector: {},
};

// POST
export const postCollector = createAsyncThunk(
  "collector/postCollector",
  async (data) => {
    await apiLink({
      url: "v1/ispOwner/collector ",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    })
      .then((res) => {
        if (res.status === 200) {
          toast("কালেক্টর অ্যাড সফল হয়েছে! ");
          document.querySelector("#collectorModal").click();
        }
      })
      .catch((err) => {
        if (err.response) {
          toast(err.response.data.message);
        }
      });
  }
);

// GET collector
export const fetchCollector = createAsyncThunk(
  "collector/fetchCollector",
  async (ispOwnerId) => {
    const response = await apiLink({
      method: "GET",
      url: `/v1/ispOwner/collector/${ispOwnerId}`,
      ContentType: "application/json",
    });
    const data = await response.data;
    return data;
  }
);

// Edit
export const editCollector = createAsyncThunk(
  "collector/editCollector",
  async (data) => {
    const { ispOwnerId, collectorId, ...rest } = data;
    await apiLink({
      url: `v1/ispOwner/collector/${ispOwnerId}/${collectorId}`,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      data: rest,
    })
      .then((res) => {
        if (res.status === 200) {
          toast("কালেক্টর এডিট সফল হয়েছে! ");
          document.querySelector("#collectorEditModal").click();
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
export const deleteCollector = createAsyncThunk(
  "collector/deleteCollector",
  async (IDs) => {
    const { ispOwnerId, collectorId } = IDs;
    await apiLink({
      url: `v1/ispOwner/collector/${ispOwnerId}/${collectorId}`,
      method: "DELETE",
    })
      .then((res) => {
        if (res.status === 204) {
          toast("কালেক্টর ডিলিট সফল হয়েছে! ");
        }
      })
      .catch((err) => {
        if (err.response) {
          toast(err.response.data.message);
        }
      });
  }
);

//   collector Slice
const collectorSlice = createSlice({
  name: "collector",
  initialState,
  extraReducers: {
    [fetchCollector.pending]: () => {
      console.log("collector Pending");
    },

    [fetchCollector.fulfilled]: (state, { payload }) => {
      console.log("collector Fetched Successfully!");
      return { ...state, collector: payload };
    },

    [fetchCollector.rejected]: () => {
      console.log("collector Rejected");
    },
  },
});

export const getCollector = (state) => state.collector.collector;
export default collectorSlice.reducer;
