import apiLink from "../api/apiLink";
import { toast } from "react-toastify";
import { getIspOwnersSuccess, editOwner } from "./adminSlice";
import {
  getIspOwnerInvoicesSuccess,
  editInvoiceSuccess,
} from "./ispOwnerInvoiceSlice";

export const getIspOwners = async (dispatch) => {
  try {
    const res = await apiLink.get(`/admin/getIspOwners`);
    dispatch(getIspOwnersSuccess(res.data));
  } catch (error) {
    console.log(error);
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
    toast.success(res.data?.message);
  } catch (err) {
    toast.error(err.response?.message);
  }
};

//  get invoice list
export const getIspOwnerInvoice = async (ispOwnerId, dispatch) => {
  console.log(ispOwnerId);
  try {
    const res = await apiLink.get("/admin/invoices/" + ispOwnerId);
    console.log(res.data);
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
  console.log("Edit Data: ", invoiceId);
  console.log("Edit Data: ", data);
  try {
    const res = await apiLink.patch("admin/invoice/" + invoiceId, data);
    dispatch(editInvoiceSuccess(res.data));
    console.log(res.data);
    setIsloading(false);
    toast.success("Invoice Edit Success!");
    document.querySelector("#InvoiceEditModal").click();
  } catch (err) {
    console.log(err.response);
    if (err.response) {
      setIsloading(false);
      toast.error(err.response.data.message);
    }
  }
};

// admin/invoice/id
