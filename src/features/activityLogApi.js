import apiLink from "../api/apiLink";
import {
  getActivityLogSlice,
  getCustomerActivityLogSlice,
} from "./activityLogSlice";

export const getActivityLog = async (dispatch, setIsLoading, ispOwnerId) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(
      `ispOwner/activity-log/${ispOwnerId}?limit=${1000}&sortBy=${"createdAt:desc"}`
    );
    setIsLoading(false);
    dispatch(getActivityLogSlice(res.data?.results));
  } catch (error) {
    console.log(error.response);
    setIsLoading(false);
  }
};

// single customer activity log api
export const getCustomerActivityLog = async (
  dispatch,
  setIsLoading,
  customer
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(`ispOwner/activity-log-customer/${customer}`);
    setIsLoading(false);
    dispatch(getCustomerActivityLogSlice(res.data));
  } catch (error) {
    setIsLoading(false);
  }
};
