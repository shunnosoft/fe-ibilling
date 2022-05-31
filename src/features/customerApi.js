import { toast } from "react-toastify";
import apiLink from "../api/apiLink";

export const singleCustomerMsg = async (data, setIsLoading) => {
  try {
    setIsLoading(true);
    const res = await apiLink.post("", data);
    toast.success("মেসেজ পাঠানো হয়েছে ");
    setIsLoading(false);
  } catch (error) {
    console.log(error.response.message);
  }
};
