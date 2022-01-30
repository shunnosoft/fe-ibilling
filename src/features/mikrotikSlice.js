import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiLink from "../api/apiLink";
import { toast } from "react-toastify";

const initialState = {
  mikrotik: {},
  singleMikrotik: {},
  pppoeUser: {},
  pppoeActiveUser: {},
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

// DELETE single mikrotik
export const mikrotikTesting = createAsyncThunk(
  "mikrotik/mikrotikTesting",
  async (IDs) => {
    await apiLink({
      method: "GET",
      url: `/v1/mikrotik/testConnection/${IDs.ispOwner}/${IDs.id}`,
    })
      .then(() => {
        toast("মাইক্রোটিক কানেকশন ঠিক আছে");
      })
      .catch(() => {
        toast("Error - মাইক্রোটিক কানেকশন !");
      });
  }
);

// get PPPoE user
export const fetchpppoeUser = createAsyncThunk(
  "ppporUser/fetchpppoeUser",
  async (IDs) => {
    const response = await apiLink({
      method: "GET",
      url: `/v1/mikrotik/PPPsecretUsers/${IDs.ispOwner}/${IDs.id}`,
    }).catch(() => {
      toast("PPPoE গ্রাহক পাওয়া যায়নি!");
    });
    const data = await response.data;
    return data;
  }
);

// get PPPoE user
export const fetchActivepppoeUser = createAsyncThunk(
  "ppporUser/fetchActivepppoeUser",
  async (IDs) => {
    const response = await apiLink({
      method: "GET",
      url: `/v1/mikrotik/PPPactiveUsers/${IDs.ispOwner}/${IDs.id}`,
    }).catch(() => {
      toast("এক্টিভ গ্রাহক পাওয়া যায়নি!");
    });
    const data = await response.data;
    return data;
  }
);

export const areaSlice = createSlice({
  name: "mikrotik",
  initialState,
  extraReducers: {
    [fetchMikrotik.fulfilled]: (state, { payload }) => {
      return { ...state, mikrotik: payload };
    },
    // single mikrotik
    [fetchSingleMikrotik.fulfilled]: (state, { payload }) => {
      return { ...state, singleMikrotik: payload };
    },
    // get pppor users
    [fetchpppoeUser.fulfilled]: (state, { payload }) => {
      return { ...state, pppoeUser: payload };
    },
    [fetchpppoeUser.rejected]: (state) => {
      return {
        ...state,
        pppoeUser: [{ name: "N/A", profile: "N/A", service: "N/A" }],
      };
    },

    // get active users
    [fetchActivepppoeUser.fulfilled]: (state, { payload }) => {
      console.log("Active user Fetched Successfully!");
      return { ...state, pppoeActiveUser: payload };
    },
    [fetchActivepppoeUser.rejected]: (state) => {
      console.log("Active User Rejected!");
      return {
        ...state,
        pppoeActiveUser: [{ name: "N/A", callerId: "N/A", address: "N/A" }],
      };
    },
  },
});

export const getMikrotik = (state) => state.mikrotik.mikrotik;
export const getSingleMikrotik = (state) => state.mikrotik.singleMikrotik;
export const getPPPoEuser = (state) => state.mikrotik.pppoeUser;
export const getActiveUser = (state) => state.mikrotik.pppoeActiveUser;

export default areaSlice.reducer;
