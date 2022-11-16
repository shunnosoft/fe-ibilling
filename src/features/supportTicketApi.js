import { toast } from "react-toastify";
import apiLink from "../api/apiLink";
import {
  deleteSupportTickets,
  editSupportTickets,
  getAllCustomer,
  getSupportTickets,
} from "./supportTicketSlice";

export const getAllSupportTickets = async (dispatch, id, setIsLoading) => {
  setIsLoading(true);
  try {
    const response = await apiLink.get(`customer/supportTickets/${id}`);
    // console.log(response.data.supportTickets);
    dispatch(getSupportTickets(response.data.supportTickets));
  } catch (error) {
    toast.error(error.response?.data.message);
  }
  setIsLoading(false);
};

export const editSupportTicketsApi = async (dispatch, data, ticketId) => {
  try {
    const response = await apiLink.patch(
      `customer/supportTicket/${ticketId}`,
      data
    );
    console.log(response.data);
    dispatch(editSupportTickets(response.data.supportTicket));
    toast.success(response.data.message);
  } catch (error) {
    toast.error(error.response?.data.message);
  }
};
export const deleteSupportTicketsApi = async (dispatch, ticketId) => {
  try {
    const response = await apiLink.delete(`customer/supportTicket/${ticketId}`);
    dispatch(deleteSupportTickets(ticketId));
    toast.success(response.data.message);
  } catch (error) {
    toast.error(error.response?.data.message);
  }
};

// export const getCollectorApi = async (dispatch, ispOwnerId, setIsLoading) => {
//   try {
//     setIsLoading(true);
//     const res = await apiLink.get(`/ispOwner/collector/${ispOwnerId}`);
//     dispatch(getAllCustomer(res.data));
//   } catch (error) {
//     toast.error(error.response?.data.message);
//   }
//   setIsLoading(false);
// };
