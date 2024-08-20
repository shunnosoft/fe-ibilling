import apiLink from "../api/apiLink";
import { toast } from "react-toastify";
import {
  getIspOwnersSuccess,
  editOwner,
  addCommentSuccess,
  getCommentsSuccess,
  getSingleCommentSuccess,
  editCommentSuccess,
  getInvoicesSuccess,
  editInvoiceSuccessSuper,
  getIspOwnerStaffsSuccess,
  getSingleIspOwnerData,
} from "./adminSlice";
import {
  getIspOwnerInvoicesSuccess,
  editInvoiceSuccess,
} from "./ispOwnerInvoiceSlice";
import {
  bulletinPermissionSuccess,
  deleteAdminSupport,
  deleteIspOwnerSupport,
  getAdminSupport,
  getIspOwnerSupport,
  updateAdminSupport,
  updateIspOwnerSupport,
} from "./adminNetFeeSupportSlice";
import axios from "axios";

// get owners
export const getIspOwners = async (dispatch, setIsLoading) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(`/admin/getIspOwners`);
    dispatch(getIspOwnersSuccess(res.data));
  } catch (error) {
    console.log(error);
  }
  setIsLoading(false);
};

// get owners
export const resetSerialNumber = async (ispOwnerId) => {
  try {
    const res = await apiLink.get(
      `/admin/reset-unique-identifier/${ispOwnerId}`
    );
    toast.success(res.data.msg);
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
};

// get single ispOwner
export const getSingleIspOwner = async (ispOwnerId, dispatch, setIsLoading) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(`/admin/getIspOwner/${ispOwnerId}`);
    dispatch(getSingleIspOwnerData(res.data));
  } catch (error) {
    console.log(error.response?.data?.message);
  }
  setIsLoading(false);
};

export const getIspOwnersStaffs = async (
  ispOwnerId,
  dispatch,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(`/admin/ispOwner-details/${ispOwnerId}`);

    setIsLoading(false);
    dispatch(getIspOwnerStaffsSuccess(res.data));
  } catch (error) {
    console.log(error);
    setIsLoading(false);
  }
};

// update owner
export const uploadCsvFile = async (data, setIsLoading, mikrotikStatus) => {
  setIsLoading(true);
  try {
    if (mikrotikStatus === "noMikrotik") {
      await apiLink.post("/admin/bulk-customer-import/", data);
    } else if (mikrotikStatus === "mikrotik") {
      await apiLink.post("/admin/bulk-customer-import-with-mikrotik/", data);
    }

    document.querySelector("#fileUploadModal").click();
    toast.success(`File Uploaded Successfully`);
  } catch (err) {
    console.log(err?.response?.data?.message);
    toast.error(err?.response?.data?.message);
  }
  setIsLoading(false);
};

// update owner
export const updateOwner = async (
  ispOwnerId,
  data,
  setIsLoading,
  dispatch,
  setShow
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.patch("/ispOwner/" + ispOwnerId, data);
    dispatch(editOwner(res.data));

    setShow(false);
    toast.success(`${data.company} IspOwner update success`);
  } catch (err) {
    console.log(err);
  }
  setIsLoading(false);
};

//  get invoice list
export const getIspOwnerInvoice = async (
  ispOwnerId,
  dispatch,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get("/admin/invoices/" + ispOwnerId);
    dispatch(getIspOwnerInvoicesSuccess(res.data));
  } catch (error) {
    console.log(error);
  }
  setIsLoading(false);
};

//  update invoice
export const editIspOwnerInvoice = async (
  invoiceId,
  data,
  setIsloading,
  dispatch,
  setInvoiceEditId
) => {
  try {
    const res = await apiLink.patch("admin/invoice/" + invoiceId, data);
    dispatch(editInvoiceSuccess(res.data));
    setIsloading(false);
    toast.success("Invoice Edit Success!");
    setInvoiceEditId("");
  } catch (err) {
    console.log(err.response);
    if (err.response) {
      setIsloading(false);
      toast.error(err.response.data.message);
    }
  }
};

export const editInvoiceBySuperAdmin = async (
  invoiceId,
  data,
  setIsloading,
  dispatch
) => {
  try {
    const res = await apiLink.patch("admin/invoice/" + invoiceId, data);
    dispatch(editInvoiceSuccessSuper(res.data));
    setIsloading(false);
    document.querySelector("#InvoiceEditModalSuper").click();
    toast.success("Invoice Edit Success!");
  } catch (err) {
    console.log(err.response);
    if (err.response) {
      setIsloading(false);
      toast.error(err.response);
    }
  }
};

// add comment
export const addComment = async (data, setIsloading, dispatch) => {
  try {
    setIsloading(true);
    const res = await apiLink.post(`admin/comment/`, data);
    toast.success("Note Added");
    setIsloading(false);
    dispatch(addCommentSuccess(res.data.comment));
  } catch (error) {
    setIsloading(false);
    console.log(error);
  }
};

// get single comment
export const getSingleComments = async (dispatch, setIsLoading, ownerId) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(
      `admin/comment?ispOwner=${ownerId}&limit=${1000}&sortBy=${"Desc"}`
    );
    setIsLoading(false);
    dispatch(getSingleCommentSuccess(res.data.comments));
  } catch (error) {
    setIsLoading(false);
    console.log(error.response);
  }
};

// get all comment
export const getComments = async (dispatch, setIsLoading) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(
      `admin/comment?limit=${1000}&sortBy=${"createdAt:desc"}`
    );
    setIsLoading(false);
    dispatch(getCommentsSuccess(res.data?.comments.results));
  } catch (error) {
    console.log(error.response);
  }
};

// get all comment
export const editComments = async (dispatch, setIsLoading, data, commentId) => {
  setIsLoading(true);
  try {
    const res = await apiLink.patch(`admin/comment/${commentId}`, data);
    setIsLoading(false);
    document.querySelector("#editComment").click();
    dispatch(editCommentSuccess(res.data.comment));
  } catch (error) {
    console.log(error.response);
  }
};

// get all invoices
export const getInvoices = async (dispatch, setIsLoading) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(
      `admin/all-invoice?limit=${5000}&sortBy=${"createdAt:desc"}`
    );
    dispatch(getInvoicesSuccess(res.data?.invoices));
  } catch (error) {
    console.log(error.response);
  }
  setIsLoading(false);
};

//get all netFee support
export const getAllNetFeeSupport = async (dispatch, setIsLoading) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(`/ispOwner/netFee/support`);
    dispatch(getAdminSupport(res.data));
  } catch (error) {
    console.log(error.response);
  }
  setIsLoading(false);
};

// support update
export const updateAdminNetFeeSupport = async (
  dispatch,
  setIsLoading,
  updateData
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.patch(
      `/ispOwner/netFee/support-edit/${updateData.id}`,
      updateData
    );
    dispatch(updateAdminSupport(res.data));
    document.querySelector("#adminSupportEditModal").click();
  } catch (error) {
    console.log(error.response);
  }
  setIsLoading(false);
};

// support delete
export const deleteAdminNetFeeSupport = async (
  dispatch,
  setIsLoading,
  deleteId
) => {
  console.log(deleteId);
  setIsLoading(true);
  try {
    const res = await apiLink.delete(
      `/ispOwner/netFee/support-delete/${deleteId}`
    );
    dispatch(deleteAdminSupport(res.data));
  } catch (error) {
    console.log(error.response);
  }
  setIsLoading(false);
};

// get ispOwner create support
export const getIspOwnerCreateSupport = async (
  dispatch,
  setIsLoading,
  ispOwnerId
) => {
  setIsLoading(true);

  try {
    const res = await apiLink.get(`ispOwner/netFee/support/${ispOwnerId}`);
    dispatch(getIspOwnerSupport(res.data));
  } catch (error) {
    console.log(error.response);
  }

  setIsLoading(false);
};

// edit ispOwner support
export const editIspOwnerCreateSupport = async (
  dispatch,
  setIsLoading,
  editSupport
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.patch(
      `/ispOwner/netFee/support-edit/${editSupport.id}`,
      editSupport
    );
    dispatch(updateIspOwnerSupport(res.data));
    document.querySelector("#ispOwnerSupportEdit").click();
  } catch (error) {
    console.log(error.response);
  }
  setIsLoading(false);
};

//delete ispOwner support
export const deleteIspOwnerCreateSupport = async (
  dispatch,
  setIsLoading,
  supportId
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.delete(
      `/ispOwner/netFee/support-delete/${supportId}`
    );
    dispatch(deleteIspOwnerSupport(res.data));
  } catch (error) {
    console.log(error.response);
  }
  setIsLoading(false);
};

//get ispOwner
export const getIspOwner = async (ispData, setBillingCycle) => {
  try {
    const res = await apiLink.get(
      `admin/ispOwnerBillingCycle?mobile=${ispData.mobile}`
    );
    setBillingCycle(res.data);
  } catch (error) {
    console.log(error);
  }
};

//get reseller
export const getReseller = async (
  ispData,

  setResellerBillCycleData
) => {
  try {
    const res = await apiLink.get(
      `admin/resellerBillingCycle?mobile=${ispData.mobile}`
    );
    setResellerBillCycleData(res.data);
  } catch (error) {
    console.log(error);
  }
};

// ispOwner customer status update api call
export const updateIspOwnerCustomerStatus = async (
  data,
  setIsLoading,
  setIsShow
) => {
  setIsLoading(true);
  const { ispOwner, filter, paymentStatus, balance } = data;
  try {
    const res = await apiLink.patch(
      `${ispOwner}?filter=${filter}&paymentStatus=${paymentStatus}&balanceZero=${balance}`
    );
    setIsShow(false);
  } catch (err) {
    console.log(err.response);
  }
  setIsLoading(false);
};

// get ispOwner bulletin
export const getIspOwnerBulletin = async (setBulletins) => {
  try {
    const res = await apiLink.get(`ispOwner/netFee/bulletin`);
    setBulletins(res.data);
  } catch (error) {
    console.log(error.response.data);
  }
};

// get reseller bulletin
export const getResellerBulletin = async (setBulletins) => {
  try {
    const res = await apiLink.get(`reseller/netFee/bulletin`);
    setBulletins(res.data);
  } catch (error) {
    console.log(error.response.data);
  }
};

// get reseller bulletin
export const getBulletinPermission = async (dispatch) => {
  try {
    const res = await apiLink.get(`admin/page/permission`);
    dispatch(bulletinPermissionSuccess(res.data));
  } catch (error) {
    console.log(error.response.data);
  }
};

// get reseller bulletin
export const getCreateCsutomerLoginCredential = async (mobile) => {
  try {
    const res = await apiLink.get(
      `admin/createCustomerLoginCredential?mobile=${mobile}`
    );
    alert(res?.data?.msg);
  } catch (error) {
    console.log(error.response.data);
  }
};

// get reseller bulletin
export const csutomerWebhookRegister = async (data) => {
  try {
    const res = await axios.post(
      `https://shunnoit.top/shunno-payment/api/v1/auth/register`,
      data
    );
    res && toast.success(res?.data?.message);
  } catch (error) {
    toast.error(error.response.data);
  }
};
