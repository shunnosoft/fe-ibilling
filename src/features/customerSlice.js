import { createSlice } from "@reduxjs/toolkit";

// // internal imports
// import apiLink from "../api/apiLink";

// // GET customer
// export const fetchCustomer = createAsyncThunk(
//   "customer/fetchCustomer",
//   async (ispOwnerId) => {
//     const response = await apiLink({
//       method: "GET",
//       url: `/v1/ispOwner/customer/${ispOwnerId}`,
//       ContentType: "application/json",
//     });
//     const data = await response.data;
//     return data;
//   }
// );

// // POST
// export const postCustomer = createAsyncThunk(
//   "customer/postCustomer",
//   async (data) => {
//     await apiLink({
//       url: "/v1/ispOwner/customer",
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       data: data,
//     })
//       .then((res) => {
//         if (res.status === 200) {
//           toast("কাস্টমার অ্যাড সফল হয়েছে! ");
//           document.querySelector("#customerModal").click();
//         }
//       })
//       .catch((err) => {
//         if (err.response) {
//           toast(err.response.data.message);
//         }
//       });
//   }
// );

// // EDIT patch
// export const editCustomer = createAsyncThunk(
//   "customer/editCustomer",
//   async (data) => {
//     const { singleCustomerID, ispID, ...sendingData } = data;
//     await apiLink({
//       url: `/v1/ispOwner/customer/${ispID}/${singleCustomerID}`,
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       data: sendingData,
//     })
//       .then((res) => {
//         if (res.status === 200) {
//           toast("কাস্টমার এডিট সফল হয়েছে! ");
//         }
//       })
//       .catch((err) => {
//         if (err.response) {
//           toast(err.response.data.message);
//         }
//       });
//   }
// );

// // DELETE
// export const deleteSingleCustomer = createAsyncThunk(
//   "customer/deleteSingleCustomer",
//   async (IDs) => {
//     await apiLink({
//       url: `/v1/ispOwner/customer/${IDs.ispID}/${IDs.customerID}`,
//       method: "DELETE",
//     })
//       .then(() => {
//         toast("কাস্টমার ডিলিট সফল হয়েছে! ");
//       })
//       .catch(() => toast("Server error!"));
//   }
// );

const customerSliec = createSlice({
  name: "customer",
  initialState: {
    customer: [],
  },
  reducers: {
    getCustomerSuccess: (state, action) => {
      state.customer = action.payload.results;
    },
    addCustomerSuccess: (state, action) => {
      state.customer.push(action.payload);
    },
    editCustomerSuccess: (state, action) => {
      //example
      // const array1 = [5, 12, 8, 130, 44];
      // array1[array1.findIndex(item=>item===12)]=120
      // console.log(array1)
      //[5, 120, 8, 130, 44]

      state.customer[
        state.customer.findIndex((item) => item.id === action.payload.id)
      ] = action.payload;
    },
    deleteCustomerSuccess: (state, action) => {
      //Example
      // const months = ['Jan', 'March', 'April', 'June'];
      // months.splice(1,1);
      // console.log(months);
      // ["Jan", "April", "June"]
      state.customer.splice(
        state.customer.findIndex((item) => item.id === action.payload),
        1
      );
    },
    clearCustomer: (state) => {
      state.customer = [];
    },
  },
});

export const {
  getCustomerSuccess,
  clearCustomer,
  addCustomerSuccess,
  editCustomerSuccess,
  deleteCustomerSuccess,
} = customerSliec.actions;

export default customerSliec.reducer;
