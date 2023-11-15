import { toast } from "react-toastify";
import apiLink from "../api/apiLink";
import {
  addCustomerSuccess,
  getCustomerSuccess,
  getHotspotCustomerSuccess,
  getPackageSuccess,
  getSyncPackageSuccess,
  editCustomerSuccess,
  deleteCustomerSuccess,
  editHotspotPackageSuccess,
  deleteHotspotPackageSuccess,
  getHotspotActiveCustomerSuccess,
} from "./hotspotSlice";

const netFeeLang = localStorage.getItem("netFee:lang");
const langMessage = (color, bangla, english) => {
  // Notification for english language for
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

export const syncHotspotPackage = async (
  dispatch,
  ispOwner,
  mikrotikId,
  setHotspotPackageLoading,
  popUpToast = null
) => {
  setHotspotPackageLoading(true);
  try {
    const res = await apiLink.get(
      `hotspot/sync/package/${ispOwner}/${mikrotikId}`
    );
    dispatch(getSyncPackageSuccess(res.data.updatedPackages));
    if (popUpToast) {
      langMessage(
        "success",
        " প্যাকেজ সিঙ্ক সফল হয়েছে!",
        " Package sync Successfully"
      );
    }
  } catch (err) {
    console.log(err.response?.data);
    toast.error(err.response?.data?.message);
  }
  setHotspotPackageLoading(false);
};

// sync hotspot customer
export const syncHotspotCustomer = async (
  dispatch,
  ispOwner,
  mikrotikId,
  inActiveCustomer,
  setInActiveCustomer,
  setHotspotCustomerLoading
) => {
  setHotspotCustomerLoading(true);
  try {
    const res = await apiLink.get(
      `hotspot/sync/customers/${ispOwner}/${mikrotikId}?inActiveCustomer=${inActiveCustomer}`
    );
    dispatch(getHotspotCustomerSuccess(res.data.updatedCustomers));
    document.querySelector("#hotspotCustomerSync").click();
    setInActiveCustomer(false);

    langMessage(
      "success",
      "গ্রাহক সিঙ্ক সফল হয়েছে!",
      "Customer sync Successfully"
    );
  } catch (err) {
    console.log(err.response?.data);
    toast.error(err.response?.data?.message);
  }
  setHotspotCustomerLoading(false);
};

// add hotspot customer
export const addHotspotCustomer = async (
  dispatch,
  data,
  setIsLoading,
  setShow
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.post(`hotspot/`, data);
    dispatch(addCustomerSuccess(res.data.newCustomer));
    setShow(false);
    langMessage(
      "success",
      "গ্রাহক এড সফল হয়েছে!",
      "Customer Added Successfully"
    );
  } catch (err) {
    toast.error(err.response?.data?.message);
  }
  setIsLoading(false);
};

// edit hotspot customer
export const editHotspotCustomer = async (
  dispatch,
  data,
  customerId,
  setIsLoading,
  setShow,
  status
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.patch(`hotspot/${customerId}`, data);

    dispatch(editCustomerSuccess(res.data.customer));

    if (status === "status") {
      langMessage(
        "success",
        "কাস্টমার স্টাটাস আপডেট সফল হয়েছে",
        "Customer Status Updated Successfully"
      );
    } else {
      langMessage(
        "success",
        "গ্রাহক এডিট সফল হয়েছে!",
        "Customer Edited Successfully"
      );
    }

    setShow(false);
  } catch (err) {
    toast.error(err.response?.data?.message);
  }
  setIsLoading(false);
};

// delete hotspot customer
export const deleteHotspotCustomer = async (
  dispatch,
  data,
  setDeleteLoading,
  setShow
) => {
  setDeleteLoading(true);
  try {
    await apiLink.delete(
      `hotspot/${data?.customerID}?removeFromMikrotik=${data?.mikrotik}`
    );
    dispatch(deleteCustomerSuccess(data?.customerID));
    setShow(false);

    langMessage(
      "success",
      "গ্রাহক ডিলিট সফল হয়েছে!",
      "Customer Deleted Successfully"
    );
    document.querySelector("#hotsportCustomerDelete").click();
  } catch (err) {
    console.log(err.response?.data);
    toast.error(err.response?.data?.message);
  }
  setDeleteLoading(false);
};

// bill collect
export const billCollect = async (
  dispatch,
  billData,
  setLoading,
  resetForm = null
) => {
  setLoading(true);
  try {
    const res = await apiLink.post("/hotspot/bill/monthlyBill", billData);
    dispatch(editCustomerSuccess(res.data.customer));
    langMessage(
      "success",
      "বিল গ্রহণ সফল হয়েছে।",
      "Bill Acceptance is Successful."
    );
    document.querySelector("#customerRecharge").click();
    resetForm();
  } catch (error) {
    document.querySelector("#customerRecharge").click();
    toast.error(error.response?.data.message);
  }
  setLoading(true);
};

// get hotspot customer
export const getHotspotCustomer = async (
  dispatch,
  ispOwnerId,
  setGetCustomerLoading
) => {
  setGetCustomerLoading(true);
  try {
    const res = await apiLink.get(`hotspot/${ispOwnerId}`);
    dispatch(getCustomerSuccess(res.data.hotspotCustomers));
  } catch (err) {
    console.log(err.response?.data);
    toast.error(err.response?.data?.message);
  }
  setGetCustomerLoading(false);
};

// active hotspot customer
export const getHotspotActiveCustomer = async (
  dispatch,
  ispOwnerId,
  mikrotikId,
  setHotspotActiveLoading
) => {
  setHotspotActiveLoading(false);
  try {
    const res = await apiLink.get(
      `hotspot/active-users/${ispOwnerId}/${mikrotikId}`
    );
    console.log(res.data);
    dispatch(getHotspotActiveCustomerSuccess(res.data.hotspotCustomer));
  } catch (err) {
    console.log(err.response?.data);
    toast.error(err.response?.data?.message);
  }
};

// get hotspot package
export const getHotspotPackage = async (
  dispatch,
  ispOwner,
  setHotspotPackageLoading
) => {
  setHotspotPackageLoading(true);
  try {
    const res = await apiLink.get(`hotspot/package/${ispOwner}`);
    dispatch(getPackageSuccess(res.data.hotspotPackages));
  } catch (err) {
    console.log(err.response?.data);
    toast.error(err.response?.data?.message);
  }
  setHotspotPackageLoading(false);
};

// edit hotspot package
export const hotspotPackageEdit = async (
  dispatch,
  mikrotikId,
  packageId,
  data,
  setEditLoading
) => {
  setEditLoading(true);
  try {
    const res = await apiLink.patch(
      `hotspot/package/${mikrotikId}/${packageId}`,
      data
    );
    console.log(res.data.hotspotPackage);
    dispatch(editHotspotPackageSuccess(res.data.hotspotPackage));
    document.querySelector("#hotspotPackageEdit").click();
    langMessage(
      "success",
      "প্যকেজ এডিট সফল হয়েছে!",
      "Package Edited Successfully"
    );
  } catch (err) {
    console.log(err.response?.data);
    toast.error(err.response?.data?.message);
  }
  setEditLoading(false);
};

// delete hotspot package
export const hotspotPackageDelete = async (
  dispatch,
  mikrotikId,
  packageId,
  setDeleteLoading
) => {
  setDeleteLoading(true);
  try {
    await apiLink.delete(`hotspot/package/${mikrotikId}/${packageId}`);
    dispatch(deleteHotspotPackageSuccess(packageId));

    langMessage(
      "success",
      "প্যকেজ ডিলিট সফল হয়েছে!",
      "Package Deleted Successfully"
    );
  } catch (err) {
    console.log(err.response?.data);
    toast.error(err.response?.data?.message);
  }
  setDeleteLoading(false);
};

// get customer single recharge report
export const getCustomerRechargeReport = async (
  setCustomerReport,
  customerData,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(`bill/hotspot-customer/${customerData.id}`);
    setCustomerReport(res.data);
  } catch (err) {
    toast.error(err.response?.data?.message);
  }
  setIsLoading(false);
};

// get customer single recharge report
export const deleteCustomerSingleReport = async (
  dispatch,
  customerReport,
  setCustomerReport,
  reportId
) => {
  try {
    const res = await apiLink.delete(`/bill/monthlyBill/${reportId}`);

    const updatedState = customerReport.filter((item) => item.id !== reportId);
    setCustomerReport(updatedState);
    dispatch(editCustomerSuccess(res.data.customer));

    langMessage(
      "success",
      "রিপোর্ট ডিলিট সফল হয়েছে!",
      "Report Deleted Successfully"
    );
  } catch (err) {
    toast.error(err.response?.data?.message);
  }
};
