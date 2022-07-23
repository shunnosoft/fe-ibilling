import { toast } from "react-toastify";
import apiLink from "../api/apiLink";
import { createSupportTicket, getAllPaymentHistory, getAllSupportTicket } from "./finalClientSlice";
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
  } catch (error) {
    console.log(error.response);
  }
};

export const changePackageApi = async (data, setLoading) => {
  try {
    const confirm = window.confirm("Are you want to update your package");
    if (confirm) {
      setLoading(true)
      await apiLink.patch("/customer/package", data);
      toast.success("Your package has updated");
      document.getElementById("change_package_modal").click()
    }
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.message);
  }
  setLoading(false)
};

export const billPayment = async (data, setLoading) => {
  try {
    setLoading(true);
    const res = await apiLink.post("/customer/pg/monthlyBill", data);
    window.location.href = res.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const billPaymentHistory = async (dispatch,setLoading) => {
  setLoading(true)
  try {
    const res = await apiLink("/customer/paymentHistory");
    dispatch(getAllPaymentHistory(res.data.data));
  } catch (error) {
    console.log(error);
  }
  setLoading(false)
};

export const getAllSupportTicketApi=async(dispatch,setLoading)=>{
  setLoading(true)
  try {
    const res = await apiLink.get("/customer/supportTicket");
    dispatch(getAllSupportTicket(res.data.data));
  } catch (error) {
    console.log(error)
  }
  setLoading(false)
}
export const createSupportTicketApi=async(data,dispatch,setLoading,setSupportMessage)=>{
  setLoading(true)
  try {
    const res = await apiLink.post("/customer/supportTicket",data);
    dispatch(createSupportTicket(res.data.data));
    setSupportMessage("")
  } catch (error) {
    toast.error(error?.response?.data?.message);
    console.log(error)
  }
  setLoading(false)
}