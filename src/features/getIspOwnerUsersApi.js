import { toast } from "react-toastify";
import apiLink from "../api/apiLink";
import { getAllPaymentHistory } from "./finalClientSlice";
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

export const changePackageApi = async (data, loading) => {
  try {
    const confirm = window.confirm("Are you want to update your package");
    if (confirm) {
      await apiLink.patch("/customer/package", data);
      toast.success("Your package has updated");
    }
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.message);
  }
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

export const billPaymentHistory = async (dispatch) => {
  try {
    const res = await apiLink("/customer/paymentHistory");
    console.log(res);
    dispatch(getAllPaymentHistory(res.data.data));
  } catch (error) {
    console.log(error);
  }
};
