import apiLink from "../api/apiLink";
import { getResellerDataSuccess } from "./resellerDataSlice";

export const getResellerData = async (
  ispOwnerId,
  resellerId,
  setIsLoading,
  dispatch
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(`/reseller/data/${ispOwnerId}/${resellerId}`);
    dispatch(getResellerDataSuccess(res.data));
  } catch (error) {
    console.log(error);
  }
  setIsLoading(false);
};
