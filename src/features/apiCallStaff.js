import apiLink from "../api/apiLink";
import { toast } from "react-toastify";

import {
  addStaffSuccess,
  editStaff,
  getStaffSuccess,
  addSalarySuccess,
  getSalarySuccess,
  updateSalarySuccess,
} from "./staffSlice";

// get all staff
export const getStaffs = async (dispatch, ownerId) => {
  try {
    const res = await apiLink.get("/staff/staffs/" + ownerId);
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
    console.log("Clicked");
    dispatch(addStaffSuccess(res.data));
    setIsLoading(false);
    document.querySelector("#staffModal").click();
    toast.success("কর্মচারী আড সফল হয়েছে");
  } catch (err) {
    console.log(err);
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

export const addSalaryApi = async (dispatch, data, resetForm, setIsLoading) => {
  setIsLoading(true);
  try {
    const res = await apiLink.post("/staff/salary", data);
    dispatch(addSalarySuccess(res.data));
    setIsLoading(false);
    document.querySelector("#addSalaryPostModal").click();
    toast.success("স্যালারি অ্যাড সফল হয়েছে");
    resetForm();
  } catch (err) {
    if (err.response) {
      setIsLoading(false);
      toast.error(err.response.data.message);
    }
  }
};

export const getSalaryApi = async (dispatch, staffId) => {
  try {
    const res = await apiLink.get("/staff/staffs/salary/" + staffId);
    dispatch(getSalarySuccess(res.data));
  } catch (err) {
    if (err.response) {
      toast.error(err.response.data.message);
      console.log(err.response);
    }
  }
};

export const updateSalary = async (dispatch, salaryId, data, setIsLoading) => {
  setIsLoading(true);
  try {
    const res = await apiLink.patch("/staff/salary/" + salaryId, data);
    console.log(res.data);
    dispatch(updateSalarySuccess(res.data));
    document.querySelector("#editSalaryPostModal").click();
    setIsLoading(false);
  } catch (err) {
    if (err.response) {
      toast.error(err.response.data.message);
      console.log(err.response);
    }
    setIsLoading(false);
  }
};
