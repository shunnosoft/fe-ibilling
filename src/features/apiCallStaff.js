import apiLink from "../api/apiLink";
import { toast } from "react-toastify";

import { addStaffSuccess, editStaff, getStaffSuccess } from "./staffSlice";

// get all staff
export const getStaffs = async (dispatch, ownerId) => {
  try {
    const res = await apiLink.get("/staff/staffs/" + ownerId);
    console.log(res.data);
    dispatch(getStaffSuccess(res.data));
  } catch (err) {
    if (err.response) {
      toast.error(err.response.data.message);
    }
  }
};

// add new staff
export const addStaff = async (dispatch, data, setIsLoading) => {
  setIsLoading(true);
  try {
    const res = await apiLink.post("/staff", data);
    dispatch(addStaffSuccess(res.data));
    setIsLoading(false);
    document.querySelector("#staffModal").click();
    toast.success("কর্মচারী আড সফল হয়েছে");
  } catch (err) {
    if (err.response) {
      setIsLoading(false);
      toast.error(err.response.data.message);
    }
  }
};

export const updateStaffApi = async (dispatch, staffId, data, setIsLoading) => {
  setIsLoading(true);
  try {
    const res = await apiLink.patch("/staff/" + staffId, data);
    dispatch(editStaff(res.data));
    setIsLoading(false);
    document.querySelector("#staffEditModal").click();
    toast.success("কর্মচারী আপডেট সফল হয়েছে");
  } catch (err) {
    if (err.response) {
      setIsLoading(false);
      toast.error(err.response.data.message);
    }
  }
};
export const deleteStaffApi = async (dispatch, staffId, setIsLoading) => {
  setIsLoading(true);
  try {
    const res = await apiLink.delete("/staff/" + staffId);
    setIsLoading(false);
    toast.success("কর্মচারী ডিলিট সফল হয়েছে");
  } catch (err) {
    if (err.response) {
      setIsLoading(false);
      toast.error(err.response.data.message);
    }
  }
};
