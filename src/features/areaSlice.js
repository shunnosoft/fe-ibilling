import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiLink from "../api/apiLink";
import { toast } from "react-toastify";

const initialState = {
  area: {},
};

export const postArea = createAsyncThunk("area/postArea", async (data) => {
  await apiLink({
    url: "/v1/ispOwner/area",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  }).catch((err) => {
    if (err.response) {
      toast(err.response.data.message);
    }
  });
});

export const fetchArea = createAsyncThunk(
  "area/fetchArea",
  async (ispOwnerId) => {
    const response = await apiLink({
      method: "GET",
      url: `/v1/ispOwner/area/${ispOwnerId}`,
      ContentType: "application/json",
    });
    const data = await response.data;
    return data;
  }
);

export const deleteArea = createAsyncThunk("area/deleteArea", async (IDs) => {
  await apiLink({
    method: "DELETE",
    url: `/v1/ispOwner/area/${IDs.ispOwner}/${IDs.id}`,
  }).catch((err) => {
    if (err.response) {
      toast(err.response.data.message);
    }
  });
});

export const areaSlice = createSlice({
  name: "area",
  initialState,
  extraReducers: {
    [fetchArea.pending]: () => {
      console.log("Area Pending");
    },

    [fetchArea.fulfilled]: (state, { payload }) => {
      console.log("Area Fetched Successfully!");
      return { ...state, area: payload };
    },

    [fetchArea.rejected]: () => {
      console.log("Area Rejected");
    },
  },
});

export default areaSlice.reducer;
