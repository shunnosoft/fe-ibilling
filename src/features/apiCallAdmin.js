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
} from "./adminSlice";
import {
  getIspOwnerInvoicesSuccess,
  editInvoiceSuccess,
} from "./ispOwnerInvoiceSlice";

// get owners
export const getIspOwners = async (dispatch, setIsLoading) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(`/admin/getIspOwners`);

    setIsLoading(false);
    dispatch(getIspOwnersSuccess(res.data));
  } catch (error) {
    console.log(error);
    setIsLoading(false);
  }
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
export const uploadCsvFile = async (data, setIsLoading) => {
  setIsLoading(true);
  try {
    await apiLink.post("/admin/bulk-customer-import/", data);

    document.querySelector("#fileUploadModal").click();
    toast.success(`File Uploaded Successfully`);
  } catch (err) {
    console.log(err);
  }
  setIsLoading(false);
};

// update owner
export const updateOwner = async (ispOwnerId, data, setIsLoading, dispatch) => {
  setIsLoading(true);
  try {
    const res = await apiLink.patch("/ispOwner/" + ispOwnerId, data);
    dispatch(editOwner(res.data));
    setIsLoading(false);
    document.querySelector("#clientEditModal").click();
    toast.success(`${data.company} IspOwner update success`);
  } catch (err) {
    console.log(err);
  }
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
  dispatch
) => {
  try {
    const res = await apiLink.patch("admin/invoice/" + invoiceId, data);
    dispatch(editInvoiceSuccess(res.data));
    setIsloading(false);
    document.querySelector("#InvoiceEditModal").click();
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
    console.log(res.data);
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
    console.log(res.data.comment);
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
      `admin/all-invoice?limit=${1000}&sortBy=${"createdAt:desc"}`
    );
    setIsLoading(false);
    dispatch(getInvoicesSuccess(res.data?.invoices.results));
  } catch (error) {
    console.log(error.response);
  }
};
