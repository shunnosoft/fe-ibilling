import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../components/common/Loader";
import { useTranslation } from "react-i18next";
import { deleteHotspotCustomer } from "../../../features/hotspotApi";

const DeleteCustomer = ({ customerId, mikrotikCheck, setMikrotikCheck }) => {
  const { t } = useTranslation();
  // get all customer
  const customers = useSelector((state) => state?.hotspot?.customer);

  // find deletable customer
  const singleData = customers.find((item) => item.id === customerId);

  // import dispatch
  const dispatch = useDispatch();

  // loading state
  const [deleteLoading, setDeleteLoading] = useState(false);

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // DELETE handler
  const deleteCustomer = (customerId) => {
    let checkCondition = true;

    if (mikrotikCheck) {
      checkCondition = window.confirm(t("deleteMikrotik"));
    }

    // sentding data
    const data = {
      customerID: customerId,
      mikrotik: mikrotikCheck,
    };

    // api call
    if (checkCondition) {
      deleteHotspotCustomer(dispatch, data, setDeleteLoading);
    }
  };

  return (
    <div
      className="modal fade"
      id="hotsportCustomerDelete"
      tabIndex="-1"
      aria-labelledby="customerModalDetails"
      aria-hidden="true"
    >
      <div className="modal-dialog ">
        <div className="modal-content">
          <div className="modal-header">
            <h5
              style={{ color: "#0abb7a" }}
              className="modal-title"
              id="customerModalDetails"
            >
              {t("customerDelete")}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <h5>
              {singleData?.name} {t("deleteCustomer")}{" "}
            </h5>

            <div class="form-check mt-4">
              <input
                class="form-check-input"
                type="checkbox"
                checked={mikrotikCheck}
                id="flexCheckDefault"
                onChange={(event) => setMikrotikCheck(event.target.checked)}
              />
              <label class="form-check-label" htmlFor="flexCheckDefault">
                <small className="text-secondary">{t("deleteMikrotik")}</small>
              </label>
            </div>

            <div className="modal-footer" style={{ border: "none" }}>
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                disabled={deleteLoading}
              >
                {t("cancel")}
              </button>
              <button
                onClick={() => {
                  deleteCustomer(customerId);
                }}
                className="btn btn-success"
                disabled={deleteLoading}
              >
                {deleteLoading ? <Loader /> : t("delete")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteCustomer;
