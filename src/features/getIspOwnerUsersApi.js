import apiLink from "../api/apiLink";
import { getOwnerUserSuccess } from "./getIspOwnerUsersSlice";

// get isp owner all user
export const getOwnerUsers = async (dispatch, ispOwnerId) => {
  try {
    const res = await apiLink.get(`/ispOwner/user-map/${ispOwnerId}`);
    dispatch(getOwnerUserSuccess(res.data.usersMap));
  } catch (error) {
    console.log(error.response);
  }
};
