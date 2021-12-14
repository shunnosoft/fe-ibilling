import apiLink from "../api/apiLink";
import { toast } from "react-toastify";

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

// login handle
export const asyncLogin = async (loginData) => {
  // display loader
  document.querySelector(".Loader").style.display = "block";

  // apiCall
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
        const bayannoAccess = res.data.access;
        const ispWoner = res.data.ispOwner;
        localStorage.setItem("token", JSON.stringify(bayannoAccess));
        localStorage.setItem("ispWoner", JSON.stringify(ispWoner));
        window.location.href = "/";
        // window.location.reload();
      } else {
        // show toast
        toast("Something went wrong here !");
      }
    })
    .catch((err) => {
      // show toast
      document.querySelector(".Loader").style.display = "none";
      console.log(err.response);
      if (err.response) {
        const errorMessage = err.response.data.message;
        toast(errorMessage);
      } else {
        toast("Server Error!");
      }
    });

  setTimeout(() => {}, 1000);
};
