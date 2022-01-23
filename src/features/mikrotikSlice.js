import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiLink from "../api/apiLink";
import { toast } from "react-toastify";

const initialState = {
  mikrotik: {},
  singleMikrotik: {},
};

// POST mikrotik
export const postMikrotik = createAsyncThunk(
  "mikrotik/postMikrotik",
  async (data) => {
    await apiLink({
      url: "/v1/mikrotik",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    })
      .then((res) => {
        console.log("Mikrotik res: ", res);
        document.querySelector("#MikrotikModal").click();
        toast("মাইক্রোটিক অ্যাড সফল হয়েছে ");
      })
      .catch((err) => {
        if (err.response) {
          toast(err.response.data.message);
        }
      });
  }
);

// PATCH mikrotik
export const editSingleMikrotik = createAsyncThunk(
  "mikrotik/editSingleMikrotik",
  async (data) => {
    const { ispId, id, ...rest } = data;

    await apiLink({
      url: `/v1/mikrotik/${ispId}/${id}`,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      data: rest,
    })
      .then((res) => {
        document.querySelector("#configMikrotikModal").click();
        toast("মাইক্রোটিক এডিট সফল হয়েছে ");
      })
      .catch((err) => {
        if (err.response) {
          toast(err.response.data.message);
        }
      });
  }
);

// GET mikrotik
export const fetchMikrotik = createAsyncThunk(
  "mikrotik/fetchMikrotik",
  async (ispOwnerId) => {
    const response = await apiLink({
      method: "GET",
      url: `/v1/mikrotik/${ispOwnerId}`,
    });
    const data = await response.data;
    return data;
  }
);

// GET single mikrotik
export const fetchSingleMikrotik = createAsyncThunk(
  "mikrotik/fetchSingleMikrotik",
  async (IDs) => {
    const response = await apiLink({
      method: "GET",
      url: `/v1/mikrotik/${IDs.ispOwner}/${IDs.id}`,
    }).catch(() => {
      window.location.href = "/mikrotik";
    });
    const data = await response.data;
    return data;
  }
);

// DELETE single mikrotik
export const deleteSingleMikrotik = createAsyncThunk(
  "mikrotik/deleteSingleMikrotik",
  async (IDs) => {
    await apiLink({
      method: "DELETE",
      url: `/v1/mikrotik/${IDs.ispOwner}/${IDs.id}`,
    })
      .then(() => {
        // toast("মাইক্রোটিক ডিলিট সফল হয়েছে");
      })
      .catch(() => {
        toast("Server Error!");
      });
  }
);

export const areaSlice = createSlice({
  name: "mikrotik",
  initialState,
  extraReducers: {
    [fetchMikrotik.pending]: () => {
      console.log("Mikrotik Pending");
    },

    [fetchMikrotik.fulfilled]: (state, { payload }) => {
      console.log("Mikrotik Fetched Successfully!");
      return { ...state, mikrotik: payload };
    },

    [fetchMikrotik.rejected]: () => {
      console.log("Mikrotik Rejected");
    },

    // single mikrotik
    [fetchSingleMikrotik.pending]: () => {
      console.log("Single mikrotik Pending");
    },

    [fetchSingleMikrotik.fulfilled]: (state, { payload }) => {
      console.log("Single mikrotik Fetched Successfully!");
      return { ...state, singleMikrotik: payload };
    },

    [fetchSingleMikrotik.rejected]: () => {
      console.log("Single mikrotik Rejected");
    },
  },
});

export const getMikrotik = (state) => state.mikrotik.mikrotik;
export const getSingleMikrotik = (state) => state.mikrotik.singleMikrotik;

export default areaSlice.reducer;
