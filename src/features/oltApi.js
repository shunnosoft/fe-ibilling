import { toast } from "react-toastify";
import apiLink from "../api/apiLink";
import {
  createIspOwnerOLTSuccess,
  deleteIspOwnerOLTSuccess,
  getCustomerONUSuccess,
  getIspOwnerOLTSuccess,
  updateIspOwnerOLTSuccess,
} from "./olt.Slice";

export const createOLT = async (data, setIsLoading, dispatch, setShow) => {
  setIsLoading(true);
  try {
    const res = await apiLink.post("/olt", data);

    dispatch(createIspOwnerOLTSuccess(res.data?.data));
    toast.success(res.data.message);
    setShow(false);
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
  setIsLoading(false);
};

export const updateOLT = async (
  ispOwner,
  data,
  setIsLoading,
  dispatch,
  setShow
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.patch(`/olt/${ispOwner}/${data?.id}`, data);

    dispatch(updateIspOwnerOLTSuccess(res.data?.data));
    toast.success(res.data.message);
    setShow(false);
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
  setIsLoading(false);
};

export const deleteOLT = async (ispOwner, id, dispatch) => {
  try {
    const res = await apiLink.delete(`/olt/${ispOwner}/${id}`);

    dispatch(deleteIspOwnerOLTSuccess(id));
    toast.success(res.data.message);
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
};

export const getOLT = async (ispOwner, setIsLoading, dispatch) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(`/olt/${ispOwner}`);

    dispatch(getIspOwnerOLTSuccess(res.data?.data));
  } catch (error) {
    toast.error(error.response?.data?.message);
  }
  setIsLoading(false);
};

export const getActiveCustomerONUInformation = async (
  dispatch,
  ispOwner,
  mikrotik,
  macAddress,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(
      `/olt/${ispOwner}/${mikrotik}/onu-information?macAddress=${macAddress}`
    );

    dispatch(getCustomerONUSuccess(res.data?.data));
  } catch (error) {
    toast.error(error.message);
    dispatch(getCustomerONUSuccess({}));
  }
  setIsLoading(false);
};
