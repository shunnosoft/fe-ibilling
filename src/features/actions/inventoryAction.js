import apiLink from "../../api/apiLink";
import { toast } from "react-toastify";
import { getProducts } from "../inventorySlice";

export const getProductApi = async (dispatch, ispOwnerId, setIsLoading) => {
  try {
    setIsLoading(true);
    const { data } = await apiLink.get(`/inventory/product/${ispOwnerId}`);
    dispatch(getProducts(data));
  } catch (err) {
    if (err.response) {
      toast.error(err.response.data.message);
    }
  } finally {
    setIsLoading(false);
  }
};
