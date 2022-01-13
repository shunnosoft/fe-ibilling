import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// internal imports
import apiLink from "../api/apiLink";

// get linemans
export const fetchLineman = createAsyncThunk(
  "ispOwner/fetchLineman",
  async (ispOwnerId) => {
    const response = await apiLink({
      method: "GET",
      url: `/v1/ispOwner/lineman/${ispOwnerId}`,
      ContentType: "application/json",
    });
    const data = await response.data;
    return data;
  }
);

// redux
const initialState = {
  lineman: {},
  singleLineman: {},
};

const linemanSlice = createSlice({
  name: "lineman",
  initialState,
  reducers: {
    setSingleLineman: (state, { payload }) => {
      state.singleLineman = payload;
    },
  },
  extraReducers: {
    [fetchLineman.pending]: () => {
      console.log("Lineman Pending");
    },

    [fetchLineman.fulfilled]: (state, { payload }) => {
      console.log("Lineman Fetched Successfully!");
      return { ...state, lineman: payload };
    },

    [fetchLineman.rejected]: () => {
      console.log("Lineman Rejected");
    },
  },
});

export const { setSingleLineman } = linemanSlice.actions;
export const getLineman = (state) => state.lineman.lineman;
export default linemanSlice.reducer;

// lineman actions

// POST
export const postLineman = async (data) => {
  await apiLink({
    url: "/v1/ispOwner/lineman",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  })
    .then((res) => {
      console.log("Response: ", res);
      if (res.status === 200) {
        console.log("Hoiche");
        document.querySelector("#linemanModal").click();
        alert("লাইন-ম্যান অ্যাড সফল হয়েছে! ");
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
export const editLineman = async (data) => {
  const { linemanID, ispID, ...sendingData } = data;
  await apiLink({
    url: `/v1/ispOwner/lineman/${ispID}/${linemanID}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    data: sendingData,
  })
    .then((res) => {
      if (res.status === 200) {
        document.querySelector("#linemanEditModal").click();
        alert("লাইন-ম্যান এডিট সফল হয়েছে! ");
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
export const deleteSingleLineman = async (IDs) => {
  await apiLink({
    url: `/v1/ispOwner/lineman/${IDs.ispID}/${IDs.linemanID}`,
    method: "DELETE",
  })
    .then(() => window.location.reload())
    .catch((err) => alert("Cannot Delete Customer."));
};
