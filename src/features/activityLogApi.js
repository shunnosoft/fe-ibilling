import apiLink from "../api/apiLink";
import {
  getActivityLogSlice,
  getCustomerActivityLogSlice,
} from "./activityLogSlice";

export const getActivityLog = async (dispatch, setIsLoading, id) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(
      `ispOwner/activity-log/${id}?limit=${1000}&sortBy=${"createdAt:desc"}`
    );
    dispatch(getActivityLogSlice(res.data));
  } catch (error) {
    console.log(error.response);
  }
  setIsLoading(false);
};

// single user activity log api
export const getUserActivityLog = async (
  dispatch,
  setIsLoading,
  role,
  customer
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(
      `ispOwner/user/activity-log?${role}=${customer}`
    );
    setIsLoading(false);
    dispatch(getCustomerActivityLogSlice(res.data));
  } catch (error) {
    setIsLoading(false);
  }
};
