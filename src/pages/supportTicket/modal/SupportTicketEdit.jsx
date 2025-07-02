import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { t } from "i18next";

// custom hooks import
import useISPowner from "../../../hooks/useISPOwner";

// internal import
import { supportTicketsEditApi } from "../../../features/supportTicketApi";
import { getManger } from "../../../features/apiCalls";
import Loader from "../../../components/common/Loader";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";
import { getStaffs } from "../../../features/apiCallStaff";

const SupportTicketEdit = ({ show, setShow, ticketEditId, allCollector }) => {
  const dispatch = useDispatch();

  // get user & current user data form useISPOwner hooks
  const { role, ispOwnerId } = useISPowner();

  // get manager
  const manager = useSelector((state) => state.manager?.manager);

  // get ispOwner all staffs
  const staffs = useSelector((state) => state.staff.staff);

  // storing data form redux
  const supportTickets = useSelector(
    (state) => state.supportTicket.supportTickets
  );

  //get ticket Catagory
  const ticketCategoryStore = useSelector(
    (state) => state.supportTicket.ticketCategory
  );

  //Loading state
  const [isLoading, setIsLoading] = useState(false);

  const [supportTicketStatusValue, setSupportTicketStatusValue] = useState("");
  const [supportTicketStaffId, setSupportTicketStaffId] = useState("");
  const [ticketType, setTicketType] = useState("");
  const [ticketCategory, setTicketCategory] = useState("");

  //get single ticket
  const singleTicket = supportTickets.find(
    (ticket) => ticket.id === ticketEditId
  );

  // all handler here
  const handleSupportTicketStatusEdit = (e) => {
    let statusValue = e.target.value;
    setSupportTicketStatusValue(statusValue);
  };

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
    supportTicketsEditApi(dispatch, data, ticketEditId, setIsLoading, setShow);
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
    role === "ispOwner" && getManger(dispatch, ispOwnerId);
    role === "ispOwner" && getStaffs(dispatch, ispOwnerId, setIsLoading);
  }, []);

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size={"md"}
        header={t("updateSupportTicket")}
      >
        <div className="displayGrid">
          <div>
            <label className="form-label mb-0">{t("status")}</label>
            <select
              class="form-select mw-100 mt-0"
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

          <div>
            <label className="form-label mb-0">{t("selectStaff")}</label>
            <select
              class="form-select mw-100 mt-0"
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
                    {collector?.name} (Collector)
                  </option>
                );
              })}

              {staffs &&
                staffs.map((item) => (
                  <option
                    value={item?.user}
                    selected={singleTicket?.assignedStaff === item?.user}
                  >
                    {item.name} (Staff)
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="form-label mb-0">{t("selectTicketType")}</label>
            <select
              name="ticketType"
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
              <option selected={singleTicket?.ticketType === "low"} value="low">
                {t("Low")}
              </option>
            </select>
          </div>

          <div>
            <label className="form-label mb-0">
              {t("selectTicketCategory")}
            </label>
            <select
              name="ticketCategory"
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

        <div class="displayGrid1 float-end mt-4">
          <button
            type="button"
            class="btn btn-secondary"
            onClick={() => setShow(false)}
          >
            {t("cancel")}
          </button>

          {singleTicket?.status === "completed" ? (
            <button
              type="button"
              class="btn btn-primary"
              onClick={supportTicketStatusSubmit}
              disabled
            >
              {t("save")}
            </button>
          ) : (
            <button
              type="button"
              class="btn btn-primary"
              onClick={supportTicketStatusSubmit}
            >
              {isLoading ? <Loader /> : t("save")}
            </button>
          )}
        </div>
      </ComponentCustomModal>
    </>
  );
};

export default SupportTicketEdit;
