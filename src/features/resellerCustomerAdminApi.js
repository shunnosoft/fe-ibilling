import { toast } from "react-toastify";
import apiLink from "../api/apiLink";
import {
  editResellerCustomerSuccess,
  getResellerCustomerSuccess,
} from "./resellerCustomerAdminSlice";

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

export const editResellerCustomer = async (
  dispatch,
  sendingData,
  reseller,
  customerId,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.patch(
      `/reseller/customer/${reseller}/${customerId}`,
      sendingData
    );
    console.log(res.data);
    dispatch(editResellerCustomerSuccess(res.data));
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
