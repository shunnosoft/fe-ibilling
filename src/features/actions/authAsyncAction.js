import apiLink from "../../api/apiLink";
import { toast } from "react-toastify";
import {
  loginFailure,
  logInStart,
  logInSuccess,
  logOut,
} from "../../features/authSlice";
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
        toast(err.response.data.message);
      }
    });
};

export const asyncLogin = async (dispatch, loginData) => {
  // display loader
  document.querySelector(".Loader").style.display = "block";

  // apiCall
  dispatch(logInStart());
  await apiLink({
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
          toast("সার্ভার Error!");
        } else {
          dispatch(logInSuccess(res.data));
          window.location.href = "/home";
        }
      } else {
        toast("সার্ভার Error!");
      }
    })
    .catch((err) => {
      document.querySelector(".Loader").style.display = "none";
      console.log(err.response);
      dispatch(loginFailure());
      if (err.response) {
        const errorMessage = err.response.data.message;
        toast(errorMessage);
      } else {
        toast("Server Error!");
      }
    });
};

// LOGOUT
export const userLogout = async (dispatch) => {
  await apiLink({
    url: "/v1/auth/logout",
    method: "POST",
  })
    .then(() => {
      dispatch(logOut());
      window.location.href = "/";
    })
    .catch((error) => {
      dispatch(logOut());
      window.location.href = "/";
      console.log(error);
    });
};
