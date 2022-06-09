import { toast } from "react-toastify";
import apiLink from "../api/apiLink";
import { addStaticCustomerSuccess } from "./customerSlice";

export const addStaticCustomerApi = async (
  dispatch,
  data,
  setIsloading,
  resetForm
) => {
  setIsloading(true);
  try {
    const res = await apiLink.post(
      "ispOwner/static-customer/" + data.ispOwner,
      data
    );
    dispatch(addStaticCustomerSuccess(res.data.customer));
    document.getElementById("addStaticCustomerModal").click();
    toast.success("কাস্টমার এড সফল হয়েছে");
  } catch (error) {
    toast.error(error.response?.data?.message);
    console.log(error.response?.data?.message);
  }
  setIsloading(false);
};
