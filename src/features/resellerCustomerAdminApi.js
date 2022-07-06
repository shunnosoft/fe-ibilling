import { toast } from "react-toastify";
import apiLink from "../api/apiLink";
import {
  editAllResellerCustomerSuccess,
  editResellerCustomerSuccess,
  getAllResellerCustomerSuccess,
  getResellerCustomerSuccess,
} from "./resellerCustomerAdminSlice";

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
    toast.success("কাস্টমার এডিট সফল হয়েছে!");
    document.querySelector("#CustomerEditModal").click();
  } catch (err) {
    if (err.response) {
      setIsLoading(false);
      toast.error(err.response.data.message);
    }
  }
};
