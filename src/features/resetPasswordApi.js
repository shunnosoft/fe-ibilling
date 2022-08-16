import apiLink from "../api/apiLink";
import { toast } from "react-toastify";

export const PasswordResetApi = async (resetId, setIsLoading) => {
  setIsLoading(true);
  apiLink
    .get(`/auth/reset-password/${resetId}`)
    .then((res) => {
      document.getElementById("resetPassword").click();
      toast.success(res.data.message);
    })

    .catch((error) => {
      console.log(error);
      toast.error(error.res.data.message);
    });
  setIsLoading(false);
};
