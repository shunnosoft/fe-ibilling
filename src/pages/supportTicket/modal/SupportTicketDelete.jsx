import React from "react";
import { useDispatch } from "react-redux";
import { deleteSupportTicketsApi } from "../../../features/supportTicketApi";

const SupportTicketDelete = ({ supportTicketDeleteID }) => {
  const dispatch = useDispatch();
  const SupportTicketDeleteSubmit = (e) => {
    e.preventDefault();
    deleteSupportTicketsApi(dispatch, supportTicketDeleteID);
  };
  return (
    <div
      class="modal fade"
      id="deleteModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              Support Ticket Delete
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>Do you want to delete support ticket ?</p>
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
              class="btn btn-danger"
              data-bs-dismiss="modal"
              onClick={SupportTicketDeleteSubmit}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportTicketDelete;
