import apiLink, { publicRequest } from "../../api/apiLink";
import { toast } from "react-toastify";
import {
  loginFailure,
  logInStart,
  logInSuccess,
  logOut,
} from "../../features/authSlice";
import { clearCustomer } from "../customerSlice";
import { clearArea } from "../areaSlice";
import { clearManager } from "../managerSlice";
import { clearCollector } from "../collectorSlice";
import { clearMikrotik } from "../mikrotikSlice";
import { clearBills } from "../paymentSlice";
import { clearChart } from "../chartsSlice";
import { clearReseller } from "../resellerSlice";
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

export const asyncLogin = async (dispatch, loginData) => {
  // display loader
  document.querySelector(".Loader").style.display = "block";

  // apiCall
  dispatch(logInStart());
  await publicRequest({
    url: "/v1/auth/login",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: loginData,
  })
    .then((res) => {
      document.querySelector(".Loader").style.display = "none";
      if (res.status === 200) {
        if (res.data.ispOwner === null) {
          toast.error("সার্ভার Error!");
        } else {
          dispatch(logInSuccess(res.data));
          window.location.href = "/home";
        }
      } else {
        toast.error("সার্ভার Error!");
      }
    })
    .catch((err) => {
      document.querySelector(".Loader").style.display = "none";
      console.log(err.response);
      dispatch(loginFailure());
      if (err.response) {
        const errorMessage = err.response.data.message;
        toast.error(errorMessage);
      } else {
        toast.error("Server Error!");
      }
    });
};

// LOGOUT
// export const userLogout = async (dispatch) => {
//   await apiLink({
//     url: "/v1/auth/logout",
//     method: "POST",
//   })
//     .then(() => {
//       localStorage.removeItem("persist:root");
//       dispatch(logOut());
//       window.location.href = "/";
//     })
//     .catch((error) => {
//       localStorage.removeItem("persist:root");
//       dispatch(logOut());

//       window.location.href = "/";
//      console.log(error)
//     });
// };

export const userLogout = async (dispatch) => {
  dispatch(clearCustomer());
  dispatch(clearArea());
  dispatch(clearManager());
  dispatch(clearCollector());
  dispatch(clearMikrotik());
  dispatch(clearChart())
  dispatch(clearBills())
  dispatch(clearReseller())
  dispatch(logOut());
};
