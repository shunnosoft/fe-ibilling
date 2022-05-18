import apiLink from "../api/apiLink";
import { toast } from "react-toastify";
import { getIspOwnersSuccess, editOwner } from "./adminSlice";
import { getIspOwnerInvoicesSuccess } from "./ispOwnerInvoiceSlice";

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

// admin/invoice/id
