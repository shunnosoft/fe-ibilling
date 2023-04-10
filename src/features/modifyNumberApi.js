import apiLink from "../api/apiLink";
import { toast } from "react-toastify";

export const NumberChangeApi = async (data, setIsLoading) => {
  setIsLoading(true);
  apiLink
    .put(`/admin/user/update/`, data)
    .then((res) => {
      toast.success(res.data.msg);
    })

    .catch((error) => {
      console.log(error);
      toast.error(error.response.data.message);
    });
  setIsLoading(false);
};

export const SearchByNumber = async (number, setCustomer, setIsLoading) => {
  setIsLoading(true);
  apiLink
    .delete(`/admin/user/update/${number}?isDelete=false`)
    .then((res) => {
      setCustomer(res.data);
      toast.success(res.data.msg);
    })

    .catch((error) => {
      console.log(error);
      toast.error(error.response.data.msg);
    });

  setIsLoading(false);
};

export const DeleteByNumber = async (number) => {
  apiLink
    .delete(`/admin/user/update/${number}?isDelete=true`)
    .then((res) => {
      toast.success(res.data.msg);
      document.getElementById("numberDeleteModal").click();
    })

    .catch((error) => {
      console.log(error);
      toast.error(error.response.data.message);
    });
};
