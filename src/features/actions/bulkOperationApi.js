import apiLink from "../../api/apiLink";
import { bulkDelete } from "../customerSlice";
import { toast } from "react-toastify";

export const bulkDeleteCustomer = async (
  dispatch,
  data,
  mikrotik,
  setIsLoading
) => {
  try {
    setIsLoading(true);
    const res = await apiLink.delete(
      `/customer/bulk/?mikrotik=${mikrotik}`,
      data
    );
    console.log(res);
    // dispatch(bulkDelete(data));
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
    console.log(res);
    // dispatch(bulkDelete(data));
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
    const res = await apiLink.patch("/customer/bulk-subArea", data);
    console.log(res);
    // dispatch(bulkDelete(data));
    document.querySelector("#bulkStatusEdit").click();
    setIsLoading(false);
    toast.success("কাস্টমার স্টাটাস আপডেট সফল হয়েছে!");
  } catch (err) {
    if (err.response) {
      setIsLoading(false);
      document.querySelector("#bulkStatusEdit").click();
      toast.error(err.response.data.message);
    }
  }
};
