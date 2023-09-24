import apiLink from "../api/apiLink";
import { toast } from "react-toastify";

export const PasswordResetApi = async (
  resetId,
  setShow,
  setIsLoading,
  setResetFuture
) => {
  setIsLoading(true);
  apiLink
    .get(`/auth/reset-password/${resetId}`)
    .then((res) => {
      setShow(false);
      setResetFuture("default");
      toast.success(res.data.message);
    })

    .catch((error) => {
      toast.error(error.response.data.message);
    });
  setIsLoading(false);
};

//mobile number password api
export const mobilePasswordApi = async (
  userId,
  setShow,
  setIsLoading,
  setResetFuture
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(`auth/reset-password-mobile/${userId}`);
    setShow(false);
    setResetFuture("default");
    toast.success(res.data.message);
  } catch (err) {
    if (err.response) {
      toast.error(err.response.data.message);
    }
  }
  setIsLoading(false);
};

// manually password reset api
export const newPasswordApi = async (
  userId,
  data,
  resetForm,
  setShow,
  setIsLoading,
  setResetFuture
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.patch(
      `auth/reset-password-manual/${userId}`,
      data
    );
    setShow(false);
    setResetFuture("default");
    toast.success(res.data.message);
    resetForm();
  } catch (err) {
    if (err.response) {
      toast.error(err.response.data.message);
    }
  }
  setIsLoading(false);
};
