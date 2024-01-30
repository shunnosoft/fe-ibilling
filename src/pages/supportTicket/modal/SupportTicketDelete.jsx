import React from "react";
import { useDispatch } from "react-redux";
import { supportTicketsDeleteApi } from "../../../features/supportTicketApi";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";

const SupportTicketDelete = ({ show, setShow, supportTicketDeleteID }) => {
  const dispatch = useDispatch();

  // delete support ticket handler
  const SupportTicketDeleteSubmit = (e) => {
    e.preventDefault();
    supportTicketsDeleteApi(dispatch, supportTicketDeleteID, setShow);
  };
  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size={"md"}
        header={"Support Ticket Delete"}
      >
        <p>Do you want to delete support ticket ?</p>

        <div class="displayGrid1 float-end mt-4">
          <button
            type="button"
            class="btn btn-secondary"
            onClick={() => setShow(false)}
          >
            cancel
          </button>
          <button
            type="button"
            class="btn btn-danger"
            onClick={SupportTicketDeleteSubmit}
          >
            Delete
          </button>
        </div>
      </ComponentCustomModal>
    </>
  );
};

export default SupportTicketDelete;
