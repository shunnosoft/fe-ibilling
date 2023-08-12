import apiLink from "../api/apiLink";
import { toast } from "react-toastify";
import {
  getSmsRequestHistorySuccess,
  acceptedStatusSuccess,
  getWithdrawalHistory,
  statusWithdrawalHistory,
} from "./resellerSmsRequestSlice";

export const getSmsRequestHistory = async (
  ispOwnerId,
  dispatch,
  setIsLoading
) => {
  try {
    setIsLoading(true);
    const res = await apiLink.get(
      "/ispOwner/smsPurchaseHistory/reseller/" + ispOwnerId
    );
    // console.log(res.data);
    dispatch(getSmsRequestHistorySuccess(res.data.smsPurchaseHistory));
  } catch (error) {
    console.log(error.response);
  }
  setIsLoading(false);
};

export const acceptedStatus = async (resellerId, dataId, data, dispatch) => {
  try {
    const res = await apiLink.patch(
      "/reseller/smsPurchase/" + resellerId + "/" + dataId,
      data
    );
    // console.log(res.data);
    dispatch(acceptedStatusSuccess(res.data.smsPurchase));
  } catch (error) {
    toast.error(error.response.data.message);
    console.log(error.response);
  }
};

//get reseller withdrawal payment request
export const getResellerWithdrawalRequest = async (
  dispatch,
  ispOwner,
  year,
  month,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(
      `ispOwner/payment/withdrawal/${ispOwner}?year=${year}&month=${month}`
    );
    dispatch(getWithdrawalHistory(res.data));
  } catch (error) {
    toast.error(error.response.data?.message);
  }
  setIsLoading(false);
};

//get reseller withdrawal payment request
export const patchResellerWithdrawalRequest = async (
  dispatch,
  id,
  data,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.patch(`ispOwner/withdrawal/payment/${id}`, data);
    dispatch(statusWithdrawalHistory(res.data));
  } catch (error) {
    toast.error(error.response.data?.message);
  }
  setIsLoading(false);
};
