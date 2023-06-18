import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supportTicketsEditApi } from "../../../features/supportTicketApi";
import { t } from "i18next";
import { getManger } from "../../../features/apiCalls";

const SupportTicketEdit = ({ ticketEditId, allCollector }) => {
  const dispatch = useDispatch();
  const [supportTicketStatusValue, setSupportTicketStatusValue] = useState("");
  const [supportTicketStaffId, setSupportTicketStaffId] = useState("");
  const [ticketType, setTicketType] = useState("");
  const [ticketCategory, setTicketCategory] = useState("");

  // storing data form redux
  const supportTickets = useSelector(
    (state) => state.supportTicket.supportTickets
  );

  // get all role
  const role = useSelector((state) => state.persistedReducer.auth.role);

  // get isp owner id
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  //get single ticket
  const singleTicket = supportTickets.find(
    (ticket) => ticket.id === ticketEditId
  );

  //get ticket Catagory
  const ticketCategoryStore = useSelector(
    (state) => state.supportTicket.ticketCategory
  );

  // all handler here
  const handleSupportTicketStatusEdit = (e) => {
    let statusValue = e.target.value;
    setSupportTicketStatusValue(statusValue);
  };

  // get manager
  const manager = useSelector((state) => state.manager?.manager);

  //collector id
  const handleCollectorId = (e) => {
    let value = e.target.value;
    setSupportTicketStaffId(value);
  };

  //submithandler
  const supportTicketStatusSubmit = () => {
    if (!supportTicketStaffId) {
      alert("Select Staff");
      return;
    }

    const data = {
      status: supportTicketStatusValue,
      ticketType,
      ticketCategory,
      assignedStaff: supportTicketStaffId,
    };

    if (!ticketCategory) {
      delete data.ticketCategory;
    }

    if (!ticketType) {
      alert("Select Ticket Type");
      return;
    }
    supportTicketsEditApi(dispatch, data, ticketEditId);
  };

  //initially setting all values
  useEffect(() => {
    if (singleTicket) {
      setSupportTicketStatusValue(singleTicket.status);
      setTicketCategory(singleTicket.ticketCategory);
      setTicketType(singleTicket.ticketType);

      if (singleTicket.assignedStaff)
        setSupportTicketStaffId(singleTicket.assignedStaff);
    }
  }, [singleTicket]);

  useEffect(() => {
    role === "ispOwner" && getManger(dispatch, ispOwner);
  }, []);

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
              {t("updateSupportTicket")}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <label>{t("status")}</label>
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
            <div style={{ margin: "1.2rem" }}></div>
            <label>{t("selectStaff")}</label>
            <select
              class="form-select mw-100"
              required
              onChange={handleCollectorId}
            >
              <option value="">{t("selectCollector")}</option>

              {role === "ispOwner" &&
                manager &&
                manager?.map((man) => (
                  <option
                    value={man?.user}
                    selected={singleTicket?.assignedStaff === man?.user}
                  >
                    {man?.name} (Manager)
                  </option>
                ))}

              {allCollector?.map((collector) => {
                return (
                  <option
                    value={collector?.user}
                    selected={singleTicket?.assignedStaff === collector?.user}
                  >
                    {collector?.name}
                  </option>
                );
              })}
            </select>

            <div className="w-100 mt-3">
              <label htmlFor="ticketType">{t("selectTicketType")}</label>
              <select
                name="ticketType"
                id="ticketType"
                onChange={(e) => setTicketType(e.target.value)}
                className="form-select mt-0 mw-100"
              >
                <option value="">...</option>
                <option
                  selected={singleTicket?.ticketType === "high"}
                  value="high"
                >
                  {t("High")}
                </option>
                <option
                  selected={singleTicket?.ticketType === "medium"}
                  value="medium"
                >
                  {t("Medium")}
                </option>
                <option
                  selected={singleTicket?.ticketType === "low"}
                  value="low"
                >
                  {t("Low")}
                </option>
              </select>
            </div>

            <div className="w-100 mt-3">
              <label htmlFor="ticketCategory">
                {t("selectTicketCategory")}
              </label>
              <select
                name="ticketCategory"
                id="ticketCategory"
                onChange={(e) => setTicketCategory(e.target.value)}
                className="form-select mt-0 mw-100"
              >
                <option value="">...</option>
                {ticketCategoryStore?.map((item) => (
                  <option
                    value={item?.id}
                    selected={singleTicket?.ticketCategory === item?.id}
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              {t("cancel")}
            </button>
            {singleTicket?.status === "completed" ? (
              <button
                type="button"
                class="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={supportTicketStatusSubmit}
                disabled
              >
                {t("save")}
              </button>
            ) : (
              <button
                type="button"
                class="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={supportTicketStatusSubmit}
              >
                {t("save")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportTicketEdit;
