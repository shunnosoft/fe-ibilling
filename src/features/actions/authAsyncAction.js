import apiLink, { publicRequest } from "../../api/apiLink";
import { toast } from "react-toastify";
import {
  logInSuccess,
  // logOut,
} from "../../features/authSlice";
import { getUser } from "../userSlice";

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
      "iBillingToken",
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

export const userLogout = async () => {
  localStorage.removeItem("persist:root");
  localStorage.removeItem("iBillingToken");
  localStorage.removeItem("ib:textR");
  // localStorage.clear();
  window.location.reload();
};
