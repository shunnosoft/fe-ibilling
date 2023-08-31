import { toast } from "react-toastify";
import apiLink from "../api/apiLink";
import {
  createSupportTicket,
  createTicketCategory,
  deleteSupportTickets,
  editSupportTickets,
  editTicketCategory,
  getCollectorSupportTickets,
  getSupportTickets,
  getTicketCategory,
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
    dispatch(getSupportTickets(response.data.supportTickets));
  } catch (error) {
    toast.error(error.response?.data.message);
  }
  setIsLoading(false);
};

//get ticket Category api
export const getTicketCategoryApi = async (
  dispatch,
  ispOwnerId,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.get(`ispOwner/get/ticket/category/${ispOwnerId}`);
    dispatch(getTicketCategory(res.data));
  } catch (error) {
    toast.error(error.res?.data.message);
  }
  setIsLoading(false);
};

//add ticket Category api
export const addTicketCategoryApi = async (dispatch, data, setIsLoading) => {
  setIsLoading(true);
  try {
    const res = await apiLink.post(`ispOwner/create/ticket/category`, data);
    dispatch(createTicketCategory(res.data));
    toast.success("Ticket Category Created Successfully");
    document.getElementById("addCategoryModal").click();
  } catch (error) {
    toast.error(error.res?.data.message);
  }
  setIsLoading(false);
};

//edit ticket Category api
export const editTicketCategoryApi = async (
  dispatch,
  data,
  categoryId,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const res = await apiLink.patch(
      `ispOwner/update/ticket/category/${categoryId}`,
      data
    );
    dispatch(editTicketCategory(res.data));

    toast.success("Ticket Category Edited successfull");
    document.getElementById("editCategoryModal").click();
  } catch (error) {
    toast.error(error.res?.data.message);
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
    dispatch(getCollectorSupportTickets(res.data.supportTickets));
  } catch (error) {
    toast.error(error.response?.data.message);
  }
  setIsLoading(false);
};

export const getResellerCollectorSupportTicket = async (
  dispatch,
  resellerId,
  collectorId,
  setIsLoading
) => {
  try {
    setIsLoading(true);
    const res = await apiLink.get(
      `customer/reseller/supportTickets/${resellerId}/${collectorId}`
    );
    dispatch(getCollectorSupportTickets(res.data.supportTickets));
  } catch (error) {
    toast.error(error.response?.data.message);
  }
  setIsLoading(false);
};

//Support Tickets Edit Api
export const supportTicketsEditApi = async (
  dispatch,
  data,
  ticketId,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const response = await apiLink.patch(
      `customer/supportTicket/${ticketId}`,
      data
    );
    dispatch(editSupportTickets(response.data.supportTicket));
    document.getElementById("editModal").click();
    toast.success("Support Ticket Edit Success");
  } catch (error) {
    toast.error(error.response?.data.message);
  }
  setIsLoading(false);
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
