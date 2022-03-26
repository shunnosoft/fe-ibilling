import apiLink, { publicRequest } from "../../api/apiLink";
import { toast } from "react-toastify";
import {
   
  logInSuccess,
  // logOut,
} from "../../features/authSlice";
// import { clearCustomer } from "../customerSlice";
// import { clearArea } from "../areaSlice";
// import { clearManager } from "../managerSlice";
// import { clearCollector } from "../collectorSlice";
// import { clearMikrotik } from "../mikrotikSlice";
// import { clearBills } from "../paymentSlice";
// import { clearChart } from "../chartsSlice";
// import { clearReseller } from "../resellerSlice";
// registration handle
export const asyncRegister = async (userData) => {
  await apiLink({
    url: "/v1/auth/register",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: userData,
  })
    .then((res) => {
      window.location.href = res.data.paymentUrl;
      document.querySelector(".Loader").style.display = "none";
    })
    .catch((err) => {
      document.querySelector(".Loader").style.display = "none";
      if (err.response) {
        toast.error(err.response.data.message);
      }
    });
};
export const asyncLogin =async (dispatch,loginData) =>{
  document.querySelector(".Loader").style.display = "block";

  try {
    const res = await publicRequest.post("/v1/auth/login", loginData)
    localStorage.setItem("netFeeToken",JSON.stringify(res.data?.access?.token))
    document.querySelector(".Loader").style.display = "none";
    // window.location.reload()
    dispatch(logInSuccess(res.data));
  } catch (error) {
    document.querySelector(".Loader").style.display = "none";
    toast.error("Login Failed")
  }
}
// export const asyncLogin = async (dispatch, loginData) => {
//   // display loader

//   // apiCall
//   dispatch(logInStart());
//   await publicRequest
//     .post("/v1/auth/login", loginData)
//     .then((res) => {
//       if (res.status === 200) {
//         if (res.data.ispOwner === null) {
//           toast.error("সার্ভার Error!");
//         } else {
         
//           localStorage.setItem("netFeeToken",JSON.stringify(res.data?.access?.token))
//           dispatch(logInSuccess(res.data));
//           // window.location.reload();
//           // window.location.href = "/home";
//         }
//       } else {
//         toast.error("সার্ভার Error!");
//       }
//     })
//     .catch((err) => {
//       document.querySelector(".Loader").style.display = "none";
//       dispatch(loginFailure());
//       if (err.response) {
//         const errorMessage = err.response.data.message;
//         toast.error(errorMessage);
//       } else {
//         toast.error("Server Error!");
//       }
//     });
// };

 

export const userLogout = async () => {
  try {
    await apiLink.post("/v1/auth/logout");

    // dispatch(clearCustomer());
    // dispatch(clearArea());
    // dispatch(clearManager());
    // dispatch(clearCollector());
    // dispatch(clearMikrotik());
    // dispatch(clearChart());
    // dispatch(clearBills());
    // dispatch(clearReseller());
    // dispatch(logOut());
    localStorage.clear()
    window.location.reload()

  } catch (error) {
    // dispatch(clearCustomer());
    // dispatch(clearArea());
    // dispatch(clearManager());
    // dispatch(clearCollector());
    // dispatch(clearMikrotik());
    // dispatch(clearChart());
    // dispatch(clearBills());
    // dispatch(clearReseller());
    // dispatch(logOut());
    localStorage.clear()
    window.location.reload()
  }
};
