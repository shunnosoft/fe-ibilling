import { toast } from "react-toastify";
import apiLink from "../../api/apiLink";
import { getPoleBoxSuccess, getSubareas } from "../areaSlice";
import { deleteCustomerSuccess } from "../customerSlice";

export const getSubAreasApi = async (dispatch, ispOwnerId, setIsLoading) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get("ispOwner/subArea/v2/" + ispOwnerId);
    dispatch(getSubareas(res.data.subAreas));
  } catch (error) {
    console.log(error);
  }
  setIsLoading(false);
};

export const getPoleBoxApi = async (dispatch, ispOwnerId, setIsLoading) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(`ispOwner/poleBox/${ispOwnerId}`);
    dispatch(getPoleBoxSuccess(res.data));
  } catch (error) {
    console.log(error);
  }
  setIsLoading(false);
};

export const transferToResellerApi = async (
  dispatch,
  customer,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.patch(
      `/ispOwner/customer/${customer.ispOwner}/${customer.id}`,
      customer
    );
    dispatch(deleteCustomerSuccess(res.data.id));
    document.getElementById("transferToReseller").click();
    toast.success("Customer Transfered to reseller");
  } catch (error) {
    toast.error("Failed to transfer");
    console.log(error);
  }
  setIsLoading(false);
};

export const getSubAreas = async (dispatch, ispOwnerId) => {
  try {
    const res = await apiLink.get("ispOwner/subArea/" + ispOwnerId);
    dispatch(getSubareas(res.data.subAreas));
  } catch (error) {
    console.log(error);
  }
};
