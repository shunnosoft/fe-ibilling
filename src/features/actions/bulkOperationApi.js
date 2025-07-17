import apiLink from "../../api/apiLink";
import { bulkDelete, bulkUpdate } from "../customerSlice";
import { toast } from "react-toastify";
import {
  bulkCustomerReturn,
  bulkResellerDelete,
} from "../resellerCustomerAdminSlice";
import { bulkDeleteSuccess, bulkUpdateSuccess } from "../hotspotSlice";

export const bulkDeleteCustomer = async (
  dispatch,
  data,
  mikrotik,
  setIsLoading,
  setShow
) => {
  try {
    setIsLoading(true);
    const res = await apiLink.delete(`/customer/bulk/?mikrotik=${mikrotik}`, {
      data,
    });
    dispatch(bulkDelete(res.data.data));
    setShow(false);
    toast.success("কাস্টমার ডিলিট সফল হয়েছে!");
  } catch (err) {
    if (err.response) {
      toast.error(err.response.data.message);
    }
  }
  setIsLoading(false);
};

export const hotspotBulkDeleteCustomer = async (
  dispatch,
  data,
  mikrotik,
  setIsLoading,
  setShow
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.delete(
      `/hotspot/bulk/delete?deleteFromMikrotik=${mikrotik}`,
      { data }
    );
    dispatch(bulkDeleteSuccess(res.data));
    setShow(false);
    toast.success("কাস্টমার ডিলিট সফল হয়েছে!");
  } catch (err) {
    if (err.response) {
      toast.error(err.response.data.message);
    }
  }
  setIsLoading(false);
};

export const bulksubAreaEdit = async (
  dispatch,
  data,
  setIsLoading,
  setShow
) => {
  try {
    setIsLoading(true);
    const res = await apiLink.patch("/customer/bulk-subArea", data);
    dispatch(bulkUpdate(res.data.data));
    setShow(false);
    setIsLoading(false);
    toast.success("কাস্টমার সাবএরিয়া আপডেট সফল হয়েছে!");
  } catch (err) {
    if (err.response) {
      setIsLoading(false);
      toast.error(err.response.data.message);
    }
  }
};

export const bulkBalanceEdit = async (
  dispatch,
  data,
  setIsLoading,
  setShow
) => {
  try {
    setIsLoading(true);
    const res = await apiLink.patch("/customer/bulk-customer-balance", data);
    setShow(false);
    dispatch(bulkUpdate(res.data.data));
    toast.success("কাস্টমার ব্যলেন্স আপডেট সফল হয়েছে!");
    setIsLoading(false);
  } catch (err) {
    if (err.response) {
      setIsLoading(false);
      toast.error(err.response.data.message);
    }
  }
};
export const bulkStatusEdit = async (dispatch, data, setIsLoading, setShow) => {
  setIsLoading(true);
  try {
    const res = await apiLink.patch("/customer/bulk-status", data);
    dispatch(bulkUpdate(res.data.data));

    setShow(false);
    toast.success("কাস্টমার স্টাটাস আপডেট সফল হয়েছে!");
  } catch (error) {
    toast.error(error.message);
  }
  setIsLoading(false);
};

export const bulkCustomerUserTypeUpdate = async (
  dispatch,
  data,
  setIsLoading,
  setShow
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.patch(
      "/customer/bulk-customer-userType-update",
      data
    );
    dispatch(bulkUpdate(res.data.data));

    setShow(false);
    toast.success(res?.data.message);
  } catch (err) {
    if (err.response) {
      toast.error(err.response.data.message);
    }
  }
  setIsLoading(false);
};

// hostpot customer bulk status update
export const hostpotBulkStatusEdit = async (
  dispatch,
  data,
  setIsLoading,
  setShow
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.patch(`hotspot/bulk/status/update`, data);
    dispatch(bulkUpdateSuccess(res.data));
    setShow(false);
    toast.success("কাস্টমার স্টাটাস আপডেট সফল হয়েছে!");
  } catch (err) {
    if (err.response) {
      toast.error(err.response.data.message);
    }
  }
  setIsLoading(false);
};

//bulk Payment Status Edit
export const bulkPaymentStatusEdit = async (
  dispatch,
  data,
  setIsLoading,
  setShow
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.patch("/customer/bulk-payment-status", data);
    dispatch(bulkUpdate(res.data.data));
    setShow(false);
    toast.success("কাস্টমার স্টাটাস আপডেট সফল হয়েছে!");
  } catch (err) {
    if (err.response) {
      toast.error(err.response.data.message);
    }
  }
  setIsLoading(false);
};

//bulk Payment Status Edit
export const hotspotBulkPaymentStatusEdit = async (
  dispatch,
  data,
  setIsLoading,
  setShow
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.patch(`/hotspot/bulk/payment-status`, data);
    dispatch(bulkUpdateSuccess(res.data));
    setShow(false);
    toast.success("কাস্টমার স্টাটাস আপডেট সফল হয়েছে!");
  } catch (err) {
    if (err.response) {
      toast.error(err.response.data.message);
    }
  }
  setIsLoading(false);
};

export const bulkPackageEdit = async (
  dispatch,
  data,
  setIsLoading,
  setShow
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.patch(
      "/customer/bulk-mikrotik-package-pppoe",
      data
    );
    setShow(false);
    toast.success("কাস্টমার প্যকেজ আপডেট সফল হয়েছে!");
    dispatch(bulkUpdate(res.data.data));
  } catch (error) {
    toast.error(error.message);
  }
  setIsLoading(false);
};

export const bulkResellerRecharge = async (
  dispatch,
  data,
  setIsLoading,
  setShow
) => {
  try {
    setIsLoading(true);
    const res = await apiLink.post("/customer/bulk-customer-recharge", data);
    setShow(false);
    dispatch(bulkUpdate(res.data.data));
    toast.success("কাস্টমার বাল্ক রিচার্জ সফল হয়েছে!");
    setIsLoading(false);
  } catch (err) {
    if (err.response) {
      setIsLoading(false);
      toast.error(err.response.data.message);
    }
  }
};

export const bulkCustomerRecharge = async (
  dispatch,
  data,
  setIsLoading,
  setShow
) => {
  try {
    setIsLoading(true);
    const res = await apiLink.post("/customer/bulk-customer-recharge", data);
    dispatch(bulkUpdate(res.data.data));
    setShow(false);
    toast.success("কাস্টমার বাল্ক রিচার্জ সফল হয়েছে!");
    setIsLoading(false);
  } catch (err) {
    if (err.response) {
      setIsLoading(false);
      toast.error(err.response.data.message);
    }
  }
};

export const bulkMikrotikUpdate = async (
  dispatch,
  data,
  setIsLoading,
  setShow
) => {
  try {
    setIsLoading(true);
    const res = await apiLink.patch("/customer/bulk-mikrotik-update", data);
    setShow(false);
    dispatch(bulkUpdate(res.data.data));
    toast.success("কাস্টমার মাইক্রোটিক আপডেট সফল হয়েছে!");
  } catch (err) {
    if (err.response) {
      toast.error(err.response.data.message);
    }
  }
  setIsLoading(false);
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

export const bulkPromiseDateEdit = async (
  dispatch,
  data,
  setIsLoading,
  setShow
) => {
  try {
    setIsLoading(true);
    const res = await apiLink.patch("/customer/bulk-promise-date", data);
    dispatch(bulkUpdate(res.data.data));
    setShow(false);
    setIsLoading(false);
    toast.success("কাস্টমার প্রমিস ডেট আপডেট হয়েছে!");
  } catch (err) {
    if (err.response) {
      setIsLoading(false);
      toast.error(err.response.data.message);
    }
  }
};

export const bulkAutoConnectionEdit = async (
  dispatch,
  data,
  setIsLoading,
  setShow
) => {
  try {
    setIsLoading(true);
    const res = await apiLink.patch("/customer/bulk-auto-disable", data);
    dispatch(bulkUpdate(res.data.data));
    setShow(false);
    setIsLoading(false);
    toast.success("কাস্টমার  আটো ডিজেবল আপডেট সফল হয়েছে!");
  } catch (err) {
    if (err.response) {
      setIsLoading(false);
      toast.error(err.response.data.message);
    }
  }
};

export const bulkCustomerTransfer = async (
  dispatch,
  data,
  setIsLoading,
  setShow,
  customerType
) => {
  try {
    setIsLoading(true);
    const res = await apiLink.patch(
      `/customer/bulk-customer-transfer-to-reseller`,
      data
    );
    if (customerType === "resellerCustomer") {
      dispatch(bulkResellerDelete(res.data.data));
    } else {
      dispatch(bulkDelete(res.data.data));
    }
    setShow(false);
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
  setIsLoading,
  setShow
) => {
  try {
    setIsLoading(true);
    const res = await apiLink.patch(
      `customer/bulk-customer-return-to-ispOwner`,
      data
    );
    setShow(false);
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
