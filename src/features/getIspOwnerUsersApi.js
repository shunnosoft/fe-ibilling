import { toast } from "react-toastify";
import apiLink from "../api/apiLink";
import {
  createSupportTicket,
  getAllPaymentHistory,
  getAllSupportTicket,
} from "./finalClientSlice";
import {
  getOwnerUserSuccess,
  getUserStaffSuccess,
} from "./getIspOwnerUsersSlice";
import { getHotspotPackageSuccess, getpackageSuccess } from "./packageSlice";
// get isp owner all user
export const getOwnerUsers = async (dispatch, ispOwnerId) => {
  try {
    const res = await apiLink.get(`/ispOwner/user-map/${ispOwnerId}`);
    dispatch(getOwnerUserSuccess(res.data.usersMap));
  } catch (error) {
    console.log(error.response.data.message);
  }
};

export const getPackagesByIspOwer = async (dispatch) => {
  try {
    const res = await apiLink.get(`/customer/package`);
    dispatch(getpackageSuccess(res.data.data));
  } catch (error) {
    console.log(error.response);
  }
};

export const changePackageApi = async (data, setLoading) => {
  try {
    const confirm = window.confirm("Are you want to update your package");
    if (confirm) {
      setLoading(true);
      await apiLink.post("/customer/package", data);
      toast.success("Waiting for Admin Acceptance");
      document.getElementById("change_package_modal").click();
    }
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.message);
  }
  setLoading(false);
};

export const billPayment = async (data, setLoading) => {
  try {
    setLoading(true);
    const res = await apiLink.post("/customer/pg/monthlyBill", data);
    window.location.href = res.data.data;
  } catch (error) {
    toast.error("Failed to payment");
    console.log(error);
  }
  document.querySelector("#billPaymentModal").click();
};

export const billPaymentHistory = async (dispatch, setLoading) => {
  setLoading(true);
  try {
    const res = await apiLink("/customer/paymentHistory");
    dispatch(getAllPaymentHistory(res.data.data));
  } catch (error) {
    console.log(error);
  }
  setLoading(false);
};

export const getAllSupportTicketApi = async (dispatch, setLoading) => {
  setLoading(true);
  try {
    const res = await apiLink.get("/customer/supportTicket");
    dispatch(getAllSupportTicket(res.data.data));
  } catch (error) {
    console.log(error);
  }
  setLoading(false);
};
export const createSupportTicketApi = async (
  data,
  dispatch,
  setLoading,
  setSupportMessage
) => {
  setLoading(true);
  try {
    const res = await apiLink.post("/customer/supportTicket", data);
    dispatch(createSupportTicket(res.data.data));
    setSupportMessage("");
  } catch (error) {
    toast.error(error?.response?.data?.message);
    console.log(error);
  }
  setLoading(false);
};

export const resellerRecharge = async (data, setLoading) => {
  setLoading(true);
  try {
    const res = await apiLink.post(`reseller/bkash-create-recharge`, data);
    console.log(res);
    window.location.href = res.data.bkashURL;
  } catch (error) {
    toast.error("Failed to payment");
    console.log(error);
  }
  setLoading(false);
};

// ispOwner support numbers
export const ispOwnerSupportNumbers = async (
  dispatch,
  ispOwner,
  setLoading,
  setSupport
) => {
  setLoading(true);
  try {
    const res = await apiLink.get(`customer/customer/support/${ispOwner}`);
    setSupport(res.data);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    console.log(error);
  }
  setLoading(false);
};

// customer change package
export const customerPackage = async (customerId, setChangePackage) => {
  try {
    const res = await apiLink.get(`customer/get/changes/package/${customerId}`);
    setChangePackage(res.data);
  } catch (error) {
    console.log(error);
  }
};

// hotspot customer package
export const hotspotCustomerPackage = async (dispatch, ispOwnerId) => {
  try {
    const res = await apiLink.get(`hotspot/package/${ispOwnerId}`);
    dispatch(getHotspotPackageSuccess(res.data?.hotspotPackages));
  } catch (error) {
    console.log(error);
  }
};

// user staff
export const userStaffs = async (dispatch) => {
  try {
    const res = await apiLink.get(`/ispOwner/staffs`);
    console.log(res.data);
    dispatch(getUserStaffSuccess(res.data));
  } catch (error) {
    console.log(error.response.data.message);
  }
};
