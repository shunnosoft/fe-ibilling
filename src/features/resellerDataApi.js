import apiLink from "../api/apiLink";
import { getResellerDataSuccess } from "./resellerDataSlice";

export const getResellerData = async (
  ispOwnerId,
  resellerId,
  setIsLoading,
  filterData,
  dispatch
) => {
  setIsLoading(true);
  let year = filterData.year || new Date().getFullYear(),
    month = filterData.month || new Date().getMonth() + 1;
  try {
    const res = await apiLink.get(
      `/reseller/data/${ispOwnerId}/${resellerId}?year=${year}&month=${month}`
    );
    dispatch(getResellerDataSuccess(res.data));
  } catch (error) {
    console.log(error);
  }
  setIsLoading(false);
};
