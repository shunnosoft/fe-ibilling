import React from "react";
import { useTranslation } from "react-i18next";
const AddCustomer = () => {
  const { t } = useTranslation();
  return (
    <div
      className="modal fade modal-dialog-scrollable "
      id="AddHotspotCustomer"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {t("addNewCustomer")}
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

export default AddCustomer;
