import apiLink from "../api/apiLink";
import { toast } from "react-toastify";
import {
  parchaseSmsSuccess,
  getParchaseHistorySuccess,
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
    console.log(error?.response?.data?.message);
    toast.error(error?.response?.data?.message);
  }
  setIsLoading(false);
};

// parchase SMS
export const parchaseSms = async (data, setIsLoading, dispatch) => {
  setIsLoading(true);
  try {
    const res = await apiLink.post("/reseller/smsPurchase", data);
    // console.log(res.data.resellerSmsPurchase);
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
