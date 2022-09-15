import apiLink from "../../api/apiLink";
import { bulkDelete, bulkUpdate } from "../customerSlice";
import { toast } from "react-toastify";
import { bulkCustomerReturn } from "../resellerCustomerAdminSlice";

export const bulkDeleteCustomer = async (
  dispatch,
  data,
  mikrotik,
  setIsLoading
) => {
  try {
    setIsLoading(true);
    const res = await apiLink.delete(`/customer/bulk/?mikrotik=${mikrotik}`, {
      data,
    });
    console.log(res);
    dispatch(bulkDelete(res.data.data));
    document.querySelector("#bulkDeleteCustomer").click();
    setIsLoading(false);
    toast.success("কাস্টমার ডিলিট সফল হয়েছে!");
  } catch (err) {
    if (err.response) {
      setIsLoading(false);
      document.querySelector("#bulkDeleteCustomer").click();
      toast.error(err.response.data.message);
    }
  }
};
export const bulksubAreaEdit = async (dispatch, data, setIsLoading) => {
  try {
    setIsLoading(true);
    const res = await apiLink.patch("/customer/bulk-subArea", data);
    dispatch(bulkUpdate(res.data.data));
    document.querySelector("#customerBulkEdit").click();
    setIsLoading(false);
    toast.success("কাস্টমার সাবএরিয়া আপডেট সফল হয়েছে!");
  } catch (err) {
    if (err.response) {
      setIsLoading(false);
      document.querySelector("#customerBulkEdit").click();
      toast.error(err.response.data.message);
    }
  }
};

export const bulkStatusEdit = async (dispatch, data, setIsLoading) => {
  try {
    setIsLoading(true);
    const res = await apiLink.patch("/customer/bulk-status", data);
    document.querySelector("#bulkStatusEdit").click();
    dispatch(bulkUpdate(res.data.data));
    toast.success("কাস্টমার স্টাটাস আপডেট সফল হয়েছে!");
    setIsLoading(false);
  } catch (err) {
    if (err.response) {
      setIsLoading(false);
      document.querySelector("#bulkStatusEdit").click();
      toast.error(err.response.data.message);
    }
  }
};
export const bulkBillingCycleEdit = async (dispatch, data, setIsLoading) => {
  try {
    setIsLoading(true);
    const res = await apiLink.patch("/customer/bulk-billing-cycle", data);
    dispatch(bulkUpdate(res.data.data));
    document.querySelector("#customerBillingCycle").click();
    setIsLoading(false);
    toast.success("কাস্টমার বিলিং সাইকেল আপডেট হয়েছে!");
  } catch (err) {
    if (err.response) {
      setIsLoading(false);
      document.querySelector("#customerBillingCycle").click();
      toast.error(err.response.data.message);
    }
  }
};

export const bulkPromiseDateEdit = async (dispatch, data, setIsLoading) => {
  try {
    setIsLoading(true);
    const res = await apiLink.patch("/customer/bulk-promise-date", data);
    dispatch(bulkUpdate(res.data.data));
    document.querySelector("#bulkPromiseDateEdit").click();
    setIsLoading(false);
    toast.success("কাস্টমার প্রমিস ডেট আপডেট হয়েছে!");
  } catch (err) {
    if (err.response) {
      setIsLoading(false);
      document.querySelector("#bulkPromiseDateEdit").click();
      toast.error(err.response.data.message);
    }
  }
};

export const bulkAutoConnectionEdit = async (dispatch, data, setIsLoading) => {
  try {
    setIsLoading(true);
    const res = await apiLink.patch("/customer/bulk-auto-disable", data);
    dispatch(bulkUpdate(res.data.data));
    document.querySelector("#autoDisableEditModal").click();
    setIsLoading(false);
    toast.success("কাস্টমার  আটো ডিজেবল আপডেট সফল হয়েছে!");
  } catch (err) {
    if (err.response) {
      setIsLoading(false);
      toast.error(err.response.data.message);
    }
  }
};

export const bulkCustomerTransfer = async (dispatch, data, setIsLoading) => {
  try {
    setIsLoading(true);
    const res = await apiLink.patch(
      `/customer/bulk-customer-transfer-to-reseller`,
      data
    );
    document.querySelector("#bulkTransferToReseller").click();
    dispatch(bulkDelete(res.data.data));
    setIsLoading(false);
    toast.success("Customer transfered successfully to reseller");
  } catch (err) {
    console.log(err);
    setIsLoading(false);
    toast.error("Failed to transfer");
  }
};

export const bulkCustomerReturnApi = async (
  dispatch,
  data,
  isAllCustomer,
  setIsLoading
) => {
  try {
    setIsLoading(true);
    const res = await apiLink.patch(
      `customer/bulk-customer-return-to-ispOwner`,
      data
    );
    document.querySelector("#returnCustomer").click();
    const responseData = {
      data: res.data.data,
      isAllCustomer,
    };
    dispatch(bulkCustomerReturn(responseData));
    setIsLoading(false);
    toast.success("Customer Return successfull");
  } catch (err) {
    console.log(err);
    setIsLoading(false);
    toast.error("Failed to return customer");
  }
};
