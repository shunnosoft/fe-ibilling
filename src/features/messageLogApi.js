import apiLink from "../api/apiLink";
import { getMessageLogSlice } from "./messageLogSlice";

// get all messge log

export const getMessageLog = async (dispatch, setIsLoading, senderId) => {
  setIsLoading(true);

  try {
    const res = await apiLink.get(`sms/sms-history/${senderId}`);
    console.log(res.data.sms);
    dispatch(getMessageLogSlice(res.data.sms));
  } catch (error) {
    console.log(error);
  }
  setIsLoading(false);
};
