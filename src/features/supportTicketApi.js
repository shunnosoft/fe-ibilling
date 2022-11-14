import { toast } from "react-toastify";
import apiLink from "../api/apiLink";
import { getSupportTickets } from "./supportTicketSlice";

export const getAllSupportTickets = async (dispatch, id, setIsLoading) => {
  setIsLoading(true);
  try {
    const response = await apiLink.get(`customer/supportTickets/${id}`);
    console.log(response.data.supportTickets);
    dispatch(getSupportTickets(response.data.supportTickets));
  } catch (err) {
    toast.error(err.response?.data.message);
  }
  setIsLoading(false);
};
