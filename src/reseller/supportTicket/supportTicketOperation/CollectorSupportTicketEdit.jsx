import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { collectorSupportTicketsEditApi } from "../../../features/supportTicketApi";

const CollectorSupportTicketEdit = ({ supportTicketId }) => {
  const dispatch = useDispatch();
  const [supportTicketStatusValue, setSupportTicketStatusValue] = useState("");
  //   const [supportTicketCollectorId, setSupportTicketCollectorId] = useState("");

  // storing data form redux
  const supportTickets = useSelector(
    (state) => state.supportTicket.supportTickets
  );
  //collector id from redux
  const collectorId = useSelector(
    (state) => state.persistedReducer.auth.currentUser.collector.id
  );
  // single ticket
  const singleTicket = supportTickets.find(
    (ticket) => ticket.id === supportTicketId
  );
  // handle form
  const handleSupportTicketStatusEdit = (e) => {
    let statusValue = e.target.value;
    setSupportTicketStatusValue(statusValue);
  };

  const collectorSupportTicketStatusSubmit = (e) => {
    e.preventDefault();

    const data = {
      status: supportTicketStatusValue,
      collector: collectorId,
    };
    collectorSupportTicketsEditApi(dispatch, data, supportTicketId);
  };
  return (
    <div
      class="modal fade"
      id="supportTicketEdit"
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
            <label>Status</label>
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
                selected={singleTicket?.status === "processing"}
                value="processing"
              >
                Processing
              </option>
              <option
                selected={singleTicket?.status === "completed"}
                value="completed"
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
              cancel
            </button>
            {singleTicket?.status === "completed" ? (
              <button
                type="button"
                class="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={collectorSupportTicketStatusSubmit}
                disabled
              >
                Save
              </button>
            ) : (
              <button
                type="button"
                class="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={collectorSupportTicketStatusSubmit}
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectorSupportTicketEdit;
