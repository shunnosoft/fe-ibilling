import { toast } from "react-toastify";
import apiLink from "../api/apiLink";
import {
  deleteReCustomer,
  editAllResellerCustomerSuccess,
  editResellerCustomerSuccess,
  getAllResellerCustomerSuccess,
  getResellerCustomerSuccess,
} from "./resellerCustomerAdminSlice";

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

//get all reseller customers
export const getAllResellerCustomer = async (
  dispatch,
  ispOwner,
  setIsloading
) => {
  setIsloading(true);
  try {
    const res = await apiLink.get(`/reseller/all-customer/${ispOwner}`);
    dispatch(getAllResellerCustomerSuccess(res.data.customers));
    setIsloading(false);
  } catch (error) {
    console.log(error.message);
    setIsloading(false);
  }
};

//Customers
export const getResellerCustomer = async (dispatch, reseller, setIsloading) => {
  setIsloading(true);
  try {
    const res = await apiLink.get(`/reseller/customer/${reseller}`);
    dispatch(getResellerCustomerSuccess(res.data));
    setIsloading(false);
  } catch (error) {
    console.log(error.message);
    setIsloading(false);
  }
};

// Static Customers
export const getStaticResellerCustomer = async (
  dispatch,
  reseller,
  setIsloading
) => {
  setIsloading(true);
  try {
    const res = await apiLink.get(`/reseller/static/customer/${reseller}`);
    dispatch(getResellerCustomerSuccess(res.data));
    setIsloading(false);
  } catch (error) {
    console.log(error.message);
    setIsloading(false);
  }
};

export const editResellerCustomer = async (
  dispatch,
  sendingData,
  reseller,
  customerId,
  setIsLoading,
  isAllCustomer = null
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.patch(
      `/reseller/customer/${reseller}/${customerId}`,
      sendingData
    );
    if (isAllCustomer) {
      dispatch(editAllResellerCustomerSuccess(res.data));
    } else {
      dispatch(editResellerCustomerSuccess(res.data));
    }
    setIsLoading(false);
    langMessage(
      "success",
      "কাস্টমার এডিট সফল হয়েছে",
      "Customer Updated Successfully"
    );
    document.querySelector("#CustomerEditModal").click();
  } catch (err) {
    if (err.response) {
      setIsLoading(false);
      toast.error(err.response.data.message);
    }
  }
};

export const deleteACustomer = async (dispatch, data, setIsLoading) => {
  try {
    setIsLoading(true);
    await apiLink.delete(
      `/ispOwner/customer/${data.ispID}/${data.customerID}?mikrotik=${data.mikrotik}`
    );
    dispatch(deleteReCustomer(data.customerID));
    document.querySelector("#customerDelete").click();
    setIsLoading(false);
    langMessage(
      "success",
      "কাস্টমার ডিলিট সফল হয়েছে",
      "Customer Deleted Successfully"
    );
  } catch (err) {
    if (err.response) {
      setIsLoading(false);
      document.querySelector("#customerDelete").click();
      toast.error(err.response.data.message);
    }
  }
};
