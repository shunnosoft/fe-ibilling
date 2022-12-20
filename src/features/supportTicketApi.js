import { toast } from "react-toastify";
import apiLink from "../api/apiLink";
import {
  deleteSupportTickets,
  editSupportTickets,
  getAllCustomer,
  getCollectorSupportTickets,
  getSupportTickets,
} from "./supportTicketSlice";

//get supportTickets api
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

//get collector api

export const getCollectorApi = async (
  dispatch,
  ispOwnerId,
  collectorId,
  setIsLoading
) => {
  try {
    setIsLoading(true);
    const res = await apiLink.get(
      `customer/supportTickets/${ispOwnerId}/${collectorId}`
    );
    // console.log(res.data);
    dispatch(getCollectorSupportTickets(res.data.supportTickets));
  } catch (error) {
    toast.error(error.response?.data.message);
  }
  setIsLoading(false);
};

//Support Tickets Edit Api
export const supportTicketsEditApi = async (dispatch, data, ticketId) => {
  try {
    const response = await apiLink.patch(
      `customer/supportTicket/${ticketId}`,
      data
    );
    console.log(response.data);
    dispatch(editSupportTickets(response.data.supportTicket));
    toast.success("Support Ticket Edit Success");
  } catch (error) {
    toast.error(error.response?.data.message);
  }
};

//Collector Support Tickets Edit Api
export const collectorSupportTicketsEditApi = async (
  dispatch,
  data,
  ticketId
) => {
  try {
    const response = await apiLink.patch(
      `customer/supportTicket/${ticketId}`,
      data
    );
    dispatch(editSupportTickets(response.data.supportTicket));
    toast.success("Support Ticket Edit Success");
  } catch (error) {
    toast.error(error.response?.data.message);
  }
};

// Support Tickets Delete Api
export const supportTicketsDeleteApi = async (dispatch, ticketId) => {
  try {
    const response = await apiLink.delete(`customer/supportTicket/${ticketId}`);
    dispatch(deleteSupportTickets(ticketId));
    toast.success(response.data.message);
  } catch (error) {
    toast.error(error.response?.data.message);
  }
};
//Collector Support Tickets Delete Api
export const collectorSupportTicketsDeleteApi = async (dispatch, ticketId) => {
  try {
    const response = await apiLink.delete(`customer/supportTicket/${ticketId}`);
    dispatch(deleteSupportTickets(ticketId));
    toast.success(response.data.message);
  } catch (error) {
    toast.error(error.response?.data.message);
  }
};
