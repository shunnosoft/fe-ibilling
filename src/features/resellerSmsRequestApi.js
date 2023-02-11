import apiLink from "../api/apiLink";
import { toast } from "react-toastify";
import {
  getSmsRequestHistorySuccess,
  acceptedStatusSuccess,
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
