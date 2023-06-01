import { t } from "i18next";
import React from "react";

const NoteDetailsModal = ({ message }) => {
  return (
    <div
      className="modal fade modal-dialog-scrollable "
      id="dipositNoteDetailsModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {t("details")}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body p-3">{message}</div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetailsModal;
