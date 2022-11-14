import { toast } from "react-toastify";
import apiLink from "../api/apiLink";
import { editSupportTickets, getSupportTickets } from "./supportTicketSlice";

export const getAllSupportTickets = async (dispatch, id, setIsLoading) => {
  setIsLoading(true);
  try {
    const response = await apiLink.get(`customer/supportTickets/${id}`);
    console.log(response.data.supportTickets);
    dispatch(getSupportTickets(response.data.supportTickets));
  } catch (error) {
    toast.error(error.response?.data.message);
  }
  setIsLoading(false);
};

export const editSupportTicketsApi = async (dispatch, data, ticketId) => {
  try {
    const response = await apiLink.patch(
      `customer/supportTicket/${ticketId},`,
      data
    );
    dispatch(editSupportTickets(response.data));
  } catch (error) {
    toast.error(error.response?.data.message);
  }
};
