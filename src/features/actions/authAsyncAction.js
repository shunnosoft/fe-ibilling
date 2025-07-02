import apiLink, { publicRequest } from "../../api/apiLink";
import { toast } from "react-toastify";
import {
  logInSuccess,
  // logOut,
} from "../../features/authSlice";
import { getUser } from "../userSlice";
// import { clearCustomer } from "../customerSlice";
// import { clearArea } from "../areaSlice";
// import { clearManager } from "../managerSlice";
// import { clearCollector } from "../collectorSlice";
// import { clearMikrotik } from "../mikrotikSlice";
// import { clearBills } from "../paymentSlice";
// import { clearChart } from "../chartsSlice";
// import { clearReseller } from "../resellerSlice";
// registration handle
export const asyncRegister = async (userData, setLoading) => {
  setLoading(true);
  try {
    // const res = await publicRequest.post("/auth/register", userData);
    const res = await publicRequest.post(
      "/auth/registerWithoutPayment",
      userData
    );
    setLoading(false);
    // window.location.href = res.data.paymentUrl;
    toast.success(res.data?.message);
    // console.log(res);
    setTimeout(() => {
      // window.location.href("https://netfeebd.com/login");
      window.location.href = "/login";
    }, 5000);
  } catch (err) {
    setLoading(false);
    if (err.response) {
      toast.error(err.response?.data.message);
    }
  }
};
export const asyncLogin = async (dispatch, loginData) => {
  document.querySelector(".Loader").style.display = "block";

  try {
    const res = await publicRequest.post("/auth/login", loginData);
    localStorage.setItem(
      "netFeeToken",
      JSON.stringify(res.data?.access?.token)
    );
    document.querySelector(".Loader").style.display = "none";
    dispatch(logInSuccess(res.data));
  } catch (error) {
    document.querySelector(".Loader").style.display = "none";
    toast.error(error.message);
  }
};

export const getUserApi = async (dispatch, userId) => {
  const { data } = await apiLink("users/" + userId);
  localStorage.setItem("nfAUsr", JSON.stringify(data));
  dispatch(getUser(data));
};

// export const asyncLogin = async (dispatch, loginData) => {
//   // display loader

//   // apiCall
//   dispatch(logInStart());
//   await publicRequest
//     .post("/auth/login", loginData)
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
  localStorage.removeItem("persist:root");
  localStorage.removeItem("netFeeToken");
  localStorage.removeItem("nf:textR");
  // localStorage.clear();
  window.location.reload();
};
