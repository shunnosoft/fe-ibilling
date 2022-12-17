import React from "react";

const Invoices = ({ ownerId }) => {
  return (
    <div
      className="modal fade"
      id="ispOwnerInvoice"
      tabIndex="-1"
      aria-labelledby="customerModalDetails"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5
              style={{ color: "#0abb7a" }}
              className="modal-title"
              id="customerModalDetails"
            >
              {/* {data?.name} - {t("profil")} */}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body"></div>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
