import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiLink from "../api/apiLink";
import { toast } from "react-toastify";

const initialState = {
  mikrotik: {},
};

// POST mikrotik
export const postMikrotik = createAsyncThunk(
  "mikrotik/postMikrotik",
  async (data) => {
    console.log("MI data: ", data);
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
        toast("মাইক্রোটিক কনফিগারেশন সফল হয়েছে ");
      })
      .catch((err) => {
        if (err.response) {
          toast(err.response.data.message);
        }
      });
  }
);

// // PATCH area
// export const editArea = createAsyncThunk("area/postArea", async (data) => {
//   const { id } = data;
//   await apiLink({
//     url: `/v1/ispOwner/area/${data.ispOwner}/${id}`,
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     data: data,
//   })
//     .then(() => {
//       document.querySelector("#areaEditModal").click();
//       toast("এরিয়া এডিট সফল হয়েছে ");
//     })
//     .catch((err) => {
//       if (err.response) {
//         toast(err.response.data.message);
//       }
//     });
// });

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
  },
});

export const getMikrotik = (state) => state.mikrotik.mikrotik;

export default areaSlice.reducer;
