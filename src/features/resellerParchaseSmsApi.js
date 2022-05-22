import apiLink from "../api/apiLink";
import { toast } from "react-toastify";
import {
  parchaseSmsSuccess,
  getParchaseHistorySuccess,
} from "./resellerParchaseSmsSlice";

// get sms
export const getParchaseHistory = async (resellerId, dispatch) => {
  try {
    const res = await apiLink.get("/reseller/smsPurchase/" + resellerId);
    console.log(res.data.smsPurchaseHistory);
    dispatch(getParchaseHistorySuccess(res.data.smsPurchaseHistory));
  } catch (error) {
    console.log(error?.response?.data?.message);
    toast.error(error?.response?.data?.message);
  }
};

// parchase SMS
export const parchaseSms = async (data, setIsLoading, dispatch) => {
  setIsLoading(true);
  try {
    const res = await apiLink.post("/reseller/smsPurchase", data);
    console.log(res.data.resellerSmsPurchase);
    dispatch(parchaseSmsSuccess(res.data.resellerSmsPurchase));
    setIsLoading(false);
    toast.success("সাবমিট সফল হয়েছে");
    document.querySelector("#smsRechargeModal").click();
  } catch (err) {
    console.log(err);
    if (err.response) {
      setIsLoading(false);
      toast.error(err.response.data.message);
    }
  }
};
