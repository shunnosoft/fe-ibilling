import apiLink from "../api/apiLink";
import { getResellerCustomerSuccess } from "./resellerCustomerAdminSlice";

//Customers
export const getResellerCustomer = async (dispatch, reseller, setIsloading) => {
  setIsloading(true);
  try {
    const res = await apiLink.get(`/reseller/customer/${reseller}`);
    console.log(res.data);
    dispatch(getResellerCustomerSuccess(res.data));
    setIsloading(false);
  } catch (error) {
    console.log(error.message);
    setIsloading(false);
  }
};
