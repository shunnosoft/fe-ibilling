import apiLink from "../api/apiLink";
import { toast } from "react-toastify";

import { addStaffSuccess } from "./staffSlice";

export const addStaff = async (dispatch, data, setIsLoading) => {
  setIsLoading(true);
  try {
    const res = await apiLink.post("/staff", data);
    dispatch(addStaffSuccess(res.data));
    setIsLoading(false);
    document.querySelector("#staffModal").click();
    toast.success("কর্মচারী আড সফল হয়েছে");
  } catch (err) {
    if (err.response) {
      setIsLoading(false);
      toast.error(err.response.data.message);
    }
  }
};
