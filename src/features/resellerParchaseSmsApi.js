import apiLink from "../api/apiLink";
import { toast } from "react-toastify";
import {
  parchaseSmsSuccess,
  getParchaseHistorySuccess,
  parchaseSmsNetFeeSuccess,
  getInvoiceHistorySuccess,
} from "./resellerParchaseSmsSlice";

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

// get sms
export const getParchaseHistory = async (
  resellerId,
  dispatch,
  setIsLoading
) => {
  try {
    setIsLoading(true);
    const res = await apiLink.get("/reseller/smsPurchase/" + resellerId);
    // console.log(res.data.smsPurchaseHistory);
    dispatch(getParchaseHistorySuccess(res.data.smsPurchaseHistory));
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
  setIsLoading(false);
};
// get sms
export const getInvoiceHistory = async (resellerId, dispatch, setIsLoading) => {
  try {
    setIsLoading(true);
    const res = await apiLink.get("/reseller/invoice/" + resellerId);
    dispatch(getInvoiceHistorySuccess(res.data.invoices));
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
  setIsLoading(false);
};

// parchase SMS
export const parchaseSms = async (data, setIsLoading, dispatch) => {
  setIsLoading(true);
  try {
    const res = await apiLink.post("/reseller/smsPurchase", data);
    dispatch(parchaseSmsSuccess(res.data.resellerSmsPurchase));
    setIsLoading(false);
    langMessage(
      "success",
      "সাবমিট সফল হয়েছে",
      "Expenditure Type Added Successfully"
    );
    document.querySelector("#smsRechargeModal").click();
  } catch (err) {
    console.log(err);
    if (err.response) {
      setIsLoading(false);
      toast.error(err.response.data.message);
    }
  }
};

export const purchaseSmsNetfee = async (data, setIsloading, dispatch) => {
  setIsloading(true);
  try {
    const res = await apiLink.post(`/sms`, data);
    dispatch(parchaseSmsNetFeeSuccess(res.data));
    document.querySelector("#smsRechargeModal").click();
    setIsloading(false);
    langMessage(
      "success",
      "এসএমএস ইনভয়েস তৈরি সফল হয়েছে। কনফার্ম করতে হলে পেমেন্ট করুন।",
      "SMS Invoice Generation is Successful. Make Payment to Confirm"
    );
  } catch (err) {
    setIsloading(false);
    console.log("SMS purchase error: ", err);
  }
};
