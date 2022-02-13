// import { createAsyncThunk } from "@reduxjs/toolkit";
// import apiLink from "../api/apiLink";
// import { toast } from "react-toastify";

// // POST sub area
// export const postSubarea = createAsyncThunk(
//   "subArea/postSubarea",
//   async (data) => {
//     await apiLink({
//       url: "/v1/ispOwner/subArea",
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       data: data,
//     })
//       .then(() => {
//         document.querySelector("#subAreaModal").click();
//         toast("সাব-এরিয়া অ্যাড সফল হয়েছে ");
//       })
//       .catch((err) => {
//         if (err.response) {
//           toast(err.response.data.message);
//         }
//       });
//   }
// );

// // PATCH sub area
// export const editSubArea = createAsyncThunk(
//   "subArea/editSubArea",
//   async (data) => {
//     const { ispOwnerID, id, ...rest } = data;
//     await apiLink({
//       url: `/v1/ispOwner/subArea/${ispOwnerID}/${id}`,
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       data: rest,
//     })
//       .then(() => {
//         document.querySelector("#subAreaEditModal").click();
//         toast("সাব-এরিয়া Edit সফল হয়েছে ");
//       })
//       .catch((err) => {
//         if (err.response) {
//           toast(err.response.data.message);
//         }
//       });
//   }
// );

// // DELETE sub area
// export const deleteSubArea = createAsyncThunk(
//   "subArea/deleteSubArea",
//   async (data) => {
//     const { ispOwner, id } = data;
//     await apiLink({
//       url: `/v1/ispOwner/subArea/${ispOwner}/${id}`,
//       method: "DELETE",
//     })
//       .then(() => {
//         document.querySelector("#subAreaModal").click();
//         toast("সাব-এরিয়া Delete সফল হয়েছে ");
//       })
//       .catch((err) => {
//         if (err.response) {
//           toast(err.response.data.message);
//         }
//       });
//   }
// );
