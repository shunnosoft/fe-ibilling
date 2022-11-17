import { toast } from "react-toastify";
import apiLink from "../api/apiLink";
import {
  addCustomerSuccess,
  getCustomerSuccess,
  getHotspotCustomerSuccess,
  getPackageSuccess,
  getSyncPackageSuccess,
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
    console.log(err.response.data);
    toast.error(err.response.data.message);
  }
  setHotspotPackageLoading(false);
};

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

export const syncHotspotCustomer = async (
  dispatch,
  ispOwner,
  mikrotikId,
  setHotspotCustomerLoading,
  popUpToast = null
) => {
  setHotspotCustomerLoading(true);
  try {
    const res = await apiLink.get(
      `hotspot/sync/customers/${ispOwner}/${mikrotikId}`
    );
    dispatch(getHotspotCustomerSuccess(res.data.updatedCustomers));
    if (popUpToast) {
      langMessage(
        "success",
        "গ্রাহক সিঙ্ক সফল হয়েছে!",
        "Customer sync Successfully"
      );
    }
  } catch (err) {
    console.log(err.response?.data);
    toast.error(err.response?.data?.message);
  }
  setHotspotCustomerLoading(false);
};

export const addHotspotCustomer = async (dispatch, data, setIsLoading) => {
  setIsLoading(true);
  try {
    const res = await apiLink.post(`hotspot`, data);
    dispatch(addCustomerSuccess(res.data.updatedCustomers));

    langMessage(
      "success",
      "গ্রাহক এড সফল হয়েছে!",
      "Customer Added Successfully"
    );
  } catch (err) {
    console.log(err.response?.data);
    toast.error(err.response?.data?.message);
  }
  setIsLoading(false);
};
export const getHotspotCustomer = async (
  dispatch,
  ispOwnerId,
  setGetCustomerLoading
) => {
  setGetCustomerLoading(true);
  try {
    const res = await apiLink.get(`hotspot/${ispOwnerId}`);
    console.log(res.data.hotspotCustomers);
    dispatch(getCustomerSuccess(res.data.hotspotCustomers));
  } catch (err) {
    console.log(err.response?.data);
    toast.error(err.response?.data?.message);
  }
  setGetCustomerLoading(false);
};
