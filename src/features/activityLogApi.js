import apiLink from "../api/apiLink";
import { getActivityLogSlice } from "./activityLogSlice";

export const getActvityLog = async (dispatch, setIsLoading, ispOwnerId) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(
      `ispOwner/activity-log/${ispOwnerId}?limit=${1000}&sortBy=${"Desc"}`
    );
    console.log(res.data?.results);
    setIsLoading(false);
    dispatch(getActivityLogSlice(res.data?.results));
  } catch (error) {
    console.log(error.response);
    setIsLoading(false);
  }
};
