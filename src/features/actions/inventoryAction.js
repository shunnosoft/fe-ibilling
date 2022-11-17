import apiLink from "../../api/apiLink";
import { toast } from "react-toastify";
import { getProducts, createProduct } from "../inventorySlice";

export const getProductApi = async (dispatch, ispOwnerId, setIsLoading) => {
  try {
    setIsLoading(true);
    const { data } = await apiLink.get(`/inventory/product/${ispOwnerId}`);
    dispatch(getProducts(data.products));
  } catch (err) {
    if (err.response) {
      toast.error(err.response.data.message);
    }
  } finally {
    setIsLoading(false);
  }
};

export const createProductApi = async (dispatch, productData, setIsLoading) => {
  try {
    setIsLoading(true);
    const { data } = await apiLink.post(
      `/inventory/product/${productData.ispOwner}`,
      productData
    );
    dispatch(createProduct(data.product));
    document.getElementById("productModal").click();
  } catch (err) {
    if (err.response) {
      toast.error(err.response.data.message);
    }
  } finally {
    setIsLoading(false);
  }
};
