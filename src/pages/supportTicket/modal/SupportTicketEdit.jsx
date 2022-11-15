import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editSupportTicketsApi } from "../../../features/supportTicketApi";

const SupportTicketEdit = ({ ticketEditId }) => {
  console.log(ticketEditId);
  const dispatch = useDispatch();
  const [supportTicketStatusValue, setSupportTicketStatusValue] = useState("");
  const supportTickets = useSelector(
    (state) => state.supportTicket.supportTickets
  );

  const singleTicket = supportTickets.find(
    (ticket) => ticket.id === ticketEditId
  );
  console.log(singleTicket);

  const handleSupportTicketStatusEdit = (e) => {
    let statusValue = e.target.value;
    setSupportTicketStatusValue(statusValue);
  };
  const supportTicketStatusSubmit = (e) => {
    e.preventDefault();
    const data = {
      status: supportTicketStatusValue,
    };

    editSupportTicketsApi(dispatch, data, ticketEditId);
  };

  return (
    <div
      class="modal fade"
      id="editModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              Support Status
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <select
              style={{ width: "100%" }}
              class="form-select mw-100"
              aria-label="Default select example"
              onChange={handleSupportTicketStatusEdit}
            >
              <option
                selected={singleTicket?.status === "pending"}
                value="pending"
              >
                Pending
              </option>
              <option
                selected={singleTicket?.status === "processed"}
                value="processed"
              >
                Processing
              </option>
              <option
                selected={singleTicket?.status === "complete"}
                value="complete"
              >
                Completed
              </option>
            </select>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancle
            </button>
            <button
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
              onClick={supportTicketStatusSubmit}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportTicketEdit;
