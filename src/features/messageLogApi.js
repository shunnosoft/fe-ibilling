import apiLink from "../api/apiLink";
import {
  getFixedNumberMessageLogSlice,
  getMaskingMessageLogSlice,
  getMessageLogSlice,
} from "./messageLogSlice";

// get all messge log

export const getMessageLog = async (dispatch, setIsLoading, senderId) => {
  setIsLoading(true);

  try {
    const res = await apiLink.get(`sms/sms-history/${senderId}`);
    dispatch(getMessageLogSlice(res.data.sms));
  } catch (error) {
    console.log(error);
  }
  setIsLoading(false);
};

// get masking messge log
export const getMaskingMessageLog = async (
  dispatch,
  setIsLoading,
  senderId
) => {
  setIsLoading(true);

  try {
    const res = await apiLink.get(
      `sms/sms-history/masking-and-fixed-number/${senderId}?sendBy=masking`
    );
    console.log(res.data.sms);
    dispatch(getMaskingMessageLogSlice(res.data.sms));
  } catch (error) {
    console.log(error);
  }
  setIsLoading(false);
};

// get masking messge log
export const getFixedNumberMessageLog = async (
  dispatch,
  setIsLoading,
  senderId
) => {
  setIsLoading(true);

  try {
    const res = await apiLink.get(
      `sms/sms-history/masking-and-fixed-number/${senderId}?sendBy=fixedNumber`
    );
    dispatch(getFixedNumberMessageLogSlice(res.data.sms));
  } catch (error) {
    console.log(error);
  }
  setIsLoading(false);
};
