import { toast } from "react-toastify";
import apiLink from "../../api/apiLink";
import { deleteCustomerSuccess } from "../customerSlice";

export const transferToResellerApi = (
  dispatch,
  resellerId,
  customerId,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = apiLink("");
    dispatch(deleteCustomerSuccess(res.data));
    document.getElementById("transferToReseller").click();
  } catch (error) {
    toast.error(error.respose?.data?.message);
    console.log(error);
  }
};
