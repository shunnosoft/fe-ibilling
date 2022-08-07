import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../components/common/Loader";
import { useTranslation } from "react-i18next";
import { deleteACustomer } from "../../../features/resellerCustomerAdminApi";

const CustomerDelete = ({ customerId, mikrotikCheck, setMikrotikCheck }) => {
  const { t } = useTranslation();

  // get all data from redux state
  let resellerCustomer = useSelector(
    (state) => state?.persistedReducer?.resellerCustomer?.resellerCustomer
  );
  // find deletable customer
  const singleData = resellerCustomer.find((item) => item.id === customerId);

  // import dispatch
  const dispatch = useDispatch();

  // loading state
  const [isLoading, setIsloading] = useState(false);

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state?.persistedReducer?.auth?.ispOwnerId
  );

  // DELETE handler
  const deleteCustomer = (customerId) => {
    let checkCondition = true;

    if (mikrotikCheck) {
      checkCondition = window.confirm(t("deleteMikrotik"));
    }

    // send data for api
    const data = {
      ispID: ispOwnerId,
      customerID: customerId,
      mikrotik: mikrotikCheck,
    };

    // api call
    if (checkCondition) {
      deleteACustomer(dispatch, data, setIsloading);
    }
  };

  return (
    <div
      className="modal fade"
      id="customerDelete"
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
              {singleData?.name} {t("deleteCustomer")}{" "}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div class="form-check mt-4">
              <input
                class="form-check-input"
                type="checkbox"
                checked={mikrotikCheck}
                id="flexCheckDefault"
                onChange={(event) => setMikrotikCheck(event.target.checked)}
              />
              <label class="form-check-label" for="flexCheckDefault">
                <small className="text-secondary">{t("deleteMikrotik")}</small>
              </label>
            </div>

            <div className="modal-footer" style={{ border: "none" }}>
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                disabled={isLoading}
              >
                {t("cancel")}
              </button>
              <button
                onClick={() => {
                  deleteCustomer(customerId);
                }}
                className="btn btn-success"
                disabled={isLoading}
              >
                {isLoading ? <Loader /> : t("delete")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDelete;
