import { toast } from "react-toastify";
import apiLink from "../api/apiLink";
import {
  createSupportTicket,
  deleteSupportTickets,
  editSupportTickets,
  getCollectorSupportTickets,
  getSupportTickets,
} from "./supportTicketSlice";

//create supportTickets api
export const createSupportTicketApi = async (dispatch, body, setIsLoading) => {
  setIsLoading(true);
  try {
    const { data } = await apiLink.post(`customer/supportTicket/`, body);

    dispatch(createSupportTicket(data.data));
    toast.success("Support ticket created successful");
    document.getElementById("createSupportTicket").click();
  } catch (error) {
    toast.error(error.response?.data.message);
  }
  setIsLoading(false);
};

//get supportTickets api
export const getAllSupportTickets = async (
  dispatch,
  id,
  setIsLoading,
  customerType
) => {
  setIsLoading(true);
  try {
    let response;
    if (customerType === "reseller") {
      response = await apiLink.get(`customer/reseller/supportTickets/${id}`);
    } else {
      response = await apiLink.get(`customer/supportTickets/${id}`);
    }
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
