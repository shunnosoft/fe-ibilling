import apiLink from "../api/apiLink";
import { toast } from "react-toastify";
import { getIspOwnersSuccess } from "./adminSlice";

export const getIspOwners = async (dispatch) => {
  try {
    const res = await apiLink.get(`/admin/getIspOwners`);
    dispatch(getIspOwnersSuccess(res.data));
    // console.log(res.data);
  } catch (error) {
    console.log(error);
  }
};
