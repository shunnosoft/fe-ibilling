import { toast } from "react-toastify";
import apiLink from "../api/apiLink";
import {
  bulkUpdate,
  deleteReCustomer,
  editAllResellerCustomerSuccess,
  editResellerCustomerSuccess,
  getAllResellerCustomerSuccess,
  getDashboardActiveCustomer,
  getDueCustomerSuccess,
  getInactiveCustomerSuccess,
  getNewCustomerSuccess,
  getResellerCustomerBillReportSuccess,
  getResellerCustomerSuccess,
} from "./resellerCustomerAdminSlice";

const netFeeLang = localStorage.getItem("iBilling:lang");
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
  } catch (error) {
    console.log(error.message);
  }
  setIsloading(false);
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

export const bulkBillingCycleEdit = async (
  dispatch,
  data,
  setIsLoading,
  setShow
) => {
  try {
    setIsLoading(true);
    const res = await apiLink.patch("/customer/bulk-billing-cycle", data);
    dispatch(bulkUpdate(res.data.data));
    setShow(false);
    setIsLoading(false);
    toast.success("কাস্টমার বিলিং সাইকেল আপডেট হয়েছে!");
  } catch (err) {
    if (err.response) {
      setIsLoading(false);
      toast.error(err.response.data.message);
    }
  }
};

export const deleteACustomer = async (
  dispatch,
  data,
  setIsLoading,
  setShow
) => {
  try {
    setIsLoading(true);
    await apiLink.delete(
      `/ispOwner/customer/${data.ispID}/${data.customerID}?mikrotik=${data.mikrotik}`
    );
    dispatch(deleteReCustomer(data.customerID));
    setShow(false);
    langMessage(
      "success",
      "কাস্টমার ডিলিট সফল হয়েছে",
      "Customer Deleted Successfully"
    );
  } catch (err) {
    toast.error(err.response?.data?.message);
  }
  setIsLoading(false);
};

// get single cusomer bill report
export const getResellerCustomerReport = async (
  dispatch,
  customerId,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await apiLink(`/reseller/bills/customer/${customerId}`);
    dispatch(getResellerCustomerBillReportSuccess(res.data));
  } catch (err) {
    toast.error("Error to get report: ", err);
  }
  setIsLoading(false);
};

// get reseller dashboadr active customer
export const getActiveCustomer = async (
  dispatch,
  resellerId,
  year,
  month,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(
      `reseller/active/customer/${resellerId}?year=${year}&month=${month}`
    );
    dispatch(getDashboardActiveCustomer(res.data));
  } catch (error) {
    toast.error(error.response?.data.message);
  }
  setIsLoading(false);
};

// get reseller new customer
export const getResellerNewCustomer = async (
  dispatch,
  resellerId,
  year,
  month,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(
      `reseller/new/customer/${resellerId}?year=${year}&month=${month}`
    );
    dispatch(getNewCustomerSuccess(res.data));
  } catch (error) {
    toast.error(error.response?.data.message);
  }
  setIsLoading(false);
};

// get reseller inactive customer
export const getResellerInactiveCustomer = async (
  dispatch,
  resellerId,
  year,
  month,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(
      `reseller/inactive/customer/${resellerId}?year=${year}&month=${month}`
    );
    dispatch(getInactiveCustomerSuccess(res.data));
  } catch (error) {
    toast.error(error.response?.data.message);
  }
  setIsLoading(false);
};

// get reseller inactive customer
export const getResellerDueCustomer = async (
  dispatch,
  resellerId,
  year,
  month,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(
      `reseller/due/customer/${resellerId}?year=${year}&month=${month}`
    );
    dispatch(getDueCustomerSuccess(res.data));
  } catch (error) {
    toast.error(error.response?.data.message);
  }
  setIsLoading(false);
};
