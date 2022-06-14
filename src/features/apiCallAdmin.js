import apiLink from "../api/apiLink";
import { toast } from "react-toastify";
import {
  getIspOwnersSuccess,
  editOwner,
  addCommentSuccess,
  getCommentsSuccess,
  getSingleCommentSuccess,
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

// update owner
export const updateOwner = async (ispOwnerId, data, setIsLoading, dispatch) => {
  setIsLoading(true);
  try {
    const res = await apiLink.patch("/ispOwner/" + ispOwnerId, data);
    dispatch(editOwner(res.data));
    setIsLoading(false);
    document.querySelector("#clientEditModal").click();
    toast.success("ISP Owner Updated Success");
  } catch (err) {
    console.log(err);
  }
};

//  get invoice list
export const getIspOwnerInvoice = async (ispOwnerId, dispatch) => {
  try {
    const res = await apiLink.get("/admin/invoices/" + ispOwnerId);
    dispatch(getIspOwnerInvoicesSuccess(res.data));
  } catch (error) {
    console.log(error);
  }
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
      `admin/comment?limit=${1000}&sortBy=${"DESC"}`
    );
    console.log(res.data.comments);
    setIsLoading(false);
    dispatch(getCommentsSuccess(res.data?.comments.results));
  } catch (error) {
    console.log(error.response);
  }
};
