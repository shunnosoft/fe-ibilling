import apiLink from "../api/apiLink";
import { toast } from "react-toastify";
import { getIspOwnersSuccess, editOwner } from "./adminSlice";

export const getIspOwners = async (dispatch) => {
  try {
    const res = await apiLink.get(`/admin/getIspOwners`);
    dispatch(getIspOwnersSuccess(res.data));
    // console.log(res.data);
  } catch (error) {
    console.log(error);
  }
};

// update owner
export const updateOwner = async (ispOwnerId, data, dispatch) => {
  try {
    const res = await apiLink.patch("/ispOwner/" + ispOwnerId, data);
    console.log(res.data);
    dispatch(editOwner(res.data.owner));
    toast.success(res.data?.message);
    document.querySelector("#clientEditModal").click();
  } catch (err) {
    toast.error(err.response?.message);
  }
};
