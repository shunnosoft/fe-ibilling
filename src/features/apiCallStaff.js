import apiLink from "../api/apiLink";
import { toast } from "react-toastify";

import {
  addStaffSuccess,
  editStaff,
  getStaffSuccess,
  addSalarySuccess,
  getSalarySuccess,
  updateSalarySuccess,
  deleteSalarySuccess,
  deleteStaffSuccess,
} from "./staffSlice";

const netFeeLang = localStorage.getItem("netFee:lang");
const langMessage = (color, bangla, english) => {
  // Notification for english language
  if (netFeeLang === "bn") {
    if (color === "success") {
      return toast.success(bangla);
    } else {
      return toast.error(bangla);
    }
  }

  // Notification for Bangla language
  if (netFeeLang === "en") {
    if (color === "success") {
      return toast.success(english);
    } else {
      return toast.error(english);
    }
  }
};

// get all staff
export const getStaffs = async (dispatch, ownerId, setTableLoading) => {
  setTableLoading(true);
  try {
    const res = await apiLink.get("/staff/staffs/" + ownerId);
    dispatch(getStaffSuccess(res.data));
    setTableLoading(false);
  } catch (err) {
    if (err.response) {
      toast.error(err.response.data.message);
    }
  }
};

// add new staff
export const addStaff = async (dispatch, data, setIsLoading, setShow) => {
  setIsLoading(true);
  try {
    const res = await apiLink.post("/staff", data);
    dispatch(addStaffSuccess(res.data));

    setShow(false);
    langMessage(
      "success",
      "কর্মচারী এড সফল হয়েছে!",
      "Staff Added Successfully"
    );
  } catch (err) {
    toast.error(err.response.data.message);
  }
  setIsLoading(false);
};

export const updateStaffApi = async (
  dispatch,
  staffId,
  data,
  setIsLoading,
  setShow
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.patch("/staff/" + staffId, data);
    dispatch(editStaff(res.data));

    setShow(false);
    langMessage(
      "success",
      "কর্মচারী আপডেট সফল হয়েছে",
      "Staff Updated Successfully"
    );
  } catch (err) {
    toast.error(err.response.data.message);
  }
  setIsLoading(false);
};
export const deleteStaffApi = async (
  dispatch,
  staffId,
  setIsLoading,
  setShow
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.delete("/staff/" + staffId);
    dispatch(deleteStaffSuccess(staffId));

    setShow(false);
    langMessage(
      "success",
      "কর্মচারী ডিলিট সফল হয়েছে",
      "Staff Deleted Successfully"
    );
  } catch (err) {
    toast.error(err.response.data.message);
  }
  setIsLoading(false);
};

export const addSalaryApi = async (
  dispatch,
  data,
  resetForm,
  setIsLoading,
  setShow
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.post("/staff/salary", data);
    dispatch(addSalarySuccess(res.data));

    setShow(false);
    langMessage(
      "success",
      "স্যালারি অ্যাড সফল হয়েছে",
      "Salary Added Successfully"
    );
    resetForm();
  } catch (err) {
    if (err.response) {
      setIsLoading(false);
      toast.error(err.response.data.message);
    }
  }
};

export const getSalaryApi = async (dispatch, staffId, setIsLoading) => {
  try {
    setIsLoading(true);
    const res = await apiLink.get("/staff/staffs/salary/" + staffId);
    dispatch(getSalarySuccess(res.data));
  } catch (err) {
    if (err.response) {
      toast.error(err.response.data.message);
      console.log(err.response);
    }
  }
  setIsLoading(false);
};

export const deleteSalary = async (
  dispatch,
  setIsLoading,
  salaryId,
  setShow
) => {
  setIsLoading(true);
  try {
    await apiLink.delete("/staff/salary/" + salaryId);
    dispatch(deleteSalarySuccess(salaryId));

    setShow(false);
    langMessage(
      "success",
      "স্যালারি ডিলিট সফল হয়েছে",
      "Salary Deleted Successfully"
    );
  } catch (error) {
    toast.error(error.response.data.message);
  }

  setIsLoading(false);
};
