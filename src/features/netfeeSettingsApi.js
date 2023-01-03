import { publicRequest } from "../api/apiLink";
import { getNetfeeSettingsSuccess } from "./netfeeSettinsSlice";

export const getNetfeeSettings = async (dispatch, setSettingsLoading) => {
  setSettingsLoading(true);
  try {
    const res = await publicRequest.get(`auth/getNetfeeSettings`);
    dispatch(getNetfeeSettingsSuccess(res.data));
  } catch (error) {
    console.log(error);
  }
  setSettingsLoading(false);
};
