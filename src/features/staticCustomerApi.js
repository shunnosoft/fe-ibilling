import { toast } from "react-toastify";
import apiLink from "../api/apiLink";
import {
  addStaticCustomerSuccess,
  editStaticCustomerSuccess,
} from "./customerSlice";

const netFeeLang = localStorage.getItem("netFee:lang");
const langMessage = (color, bangla, english) => {
  // Notification for english language
  if (netFeeLang === "bn") {
    if (color === "success") {
      return toast.success(bangla);
    } else {
      return toast.error(bangla);
    }
  }

  // Notification for Bangla language
  if (netFeeLang === "en") {
    if (color === "success") {
      return toast.success(english);
    } else {
      return toast.error(english);
    }
  }
};

export const addStaticCustomerApi = async (
  dispatch,
  data,
  setIsloading,
  setShow,
  resetForm
) => {
  setIsloading(true);
  try {
    const res = await apiLink.post(
      "ispOwner/static-customer/" + data.ispOwner,
      data
    );
    dispatch(addStaticCustomerSuccess(res.data.customer));
    setShow(false);
    langMessage(
      "success",
      "কাস্টমার এড সফল হয়েছে",
      "Customer Added Successfully"
    );
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
  setIsloading(false);
};

export const updateStaticCustomerApi = async (
  customerId,
  dispatch,
  data,
  setIsloading,
  setShow
) => {
  setIsloading(true);
  try {
    const res = await apiLink.patch(
      `/ispOwner/static-customer/${data.ispOwner}/${customerId}`,
      data
    );
    dispatch(editStaticCustomerSuccess(res.data.customer));
    setShow(false);
    langMessage(
      "success",
      "কাস্টমার আপডেট সফল হয়েছে",
      "Customer Updated Successfully"
    );
  } catch (error) {
    toast.error(error.response?.data?.message);
    console.log(error.response?.data?.message);
  }
  setIsloading(false);
};
