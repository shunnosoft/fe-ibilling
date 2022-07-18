import apiLink from "../api/apiLink";
import { getOwnerUserSuccess } from "./getIspOwnerUsersSlice";
import { getpackageSuccess } from "./packageSlice";
// get isp owner all user
export const getOwnerUsers = async (dispatch, ispOwnerId) => {
  try {
    const res = await apiLink.get(`/ispOwner/user-map/${ispOwnerId}`);
    dispatch(getOwnerUserSuccess(res.data.usersMap));
  } catch (error) {
    console.log(error.response);
  }
};

export const getPackagesByIspOwer = async (dispatch) => {
  try {
    const res = await apiLink.get(`/customer/package`);
    dispatch(getpackageSuccess(res.data.data));
    console.log(res);
  } catch (error) {
    console.log(error.response);
  }
};
