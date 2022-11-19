import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editSupportTicketsApi } from "../../../features/supportTicketApi";

const SupportTicketEdit = ({ ticketEditId, allCollector }) => {
  const dispatch = useDispatch();
  const [supportTicketStatusValue, setSupportTicketStatusValue] = useState("");
  const [supportTicketCollectorId, setSupportTicketCollectorId] = useState("");
  console.log(supportTicketStatusValue);

  // storing data form redux
  const supportTickets = useSelector(
    (state) => state.supportTicket.supportTickets
  );

  const singleTicket = supportTickets.find(
    (ticket) => ticket.id === ticketEditId
  );
  console.log(singleTicket);
  // console.log(singleTicket.status);
  // all handler here
  const handleSupportTicketStatusEdit = (e) => {
    let statusValue = e.target.value;
    setSupportTicketStatusValue(statusValue);
  };
  const handleCollectorId = (e) => {
    let value = e.target.value;
    setSupportTicketCollectorId(value);
  };

  const supportTicketStatusSubmit = (e) => {
    e.preventDefault();

    const data = {
      status: supportTicketStatusValue,
      collector: supportTicketCollectorId,
    };
    editSupportTicketsApi(dispatch, data, ticketEditId);
  };
  useEffect(() => {
    if (singleTicket) {
      setSupportTicketStatusValue(singleTicket.status);
    }
  }, [singleTicket]);
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
            <div style={{ margin: "2.5rem" }}></div>
            <label>Assign Collector</label>
            <select
              class="form-select mw-100"
              required
              onChange={handleCollectorId}
            >
              <option>Select Collector</option>
              {allCollector.map((collector) => {
                return <option value={collector.id}>{collector.name}</option>;
              })}
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
                onClick={supportTicketStatusSubmit}
                disabled
              >
                Save
              </button>
            ) : (
              <button
                type="button"
                class="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={supportTicketStatusSubmit}
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

export default SupportTicketEdit;
