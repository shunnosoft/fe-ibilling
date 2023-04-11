import apiLink from "../api/apiLink";
import { toast } from "react-toastify";
import { changeStaffsMobile } from "./adminSlice";

//Change by number API call
export const NumberChangeApi = async (
  data,
  setIsLoading,
  setEditToggle,
  dispatch
) => {
  setIsLoading(true);
  apiLink
    .put(`/admin/user/update/`, data)
    .then((res) => {
      setEditToggle("");
      dispatch(changeStaffsMobile(data));
      toast.success(res.data.msg);
    })

    .catch((error) => {
      console.log(error);
      toast.error(error.response.data.message);
    });
  setIsLoading(false);
};

//Delete By Number API call
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
      toast.error(error.response.data.message);
    });

  setIsLoading(false);
};

//Delete By Number API call
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
