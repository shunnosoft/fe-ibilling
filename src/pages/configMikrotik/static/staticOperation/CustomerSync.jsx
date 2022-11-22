import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useTranslation } from "react-i18next";
import Loader from "../../../../components/common/Loader";
import { syncMikrotikStaticUser } from "../../../../features/apiCalls";

const CustomerSync = ({ mikrotikId, ispOwner }) => {
  const { t } = useTranslation();
  // import dispatch
  const dispatch = useDispatch();

  // loading state
  const [isLoading, setIsloading] = useState(false);

  // inactive customer check
  const [inActiveCustomer, setInActiveCustomer] = useState(false);

  // Sync Customer
  const syncCostomer = () => {
    // send data for api
    const data = {
      ispOwner: ispOwner,
      mikrotikId: mikrotikId,
      inActiveCustomer: inActiveCustomer,
    };

    syncMikrotikStaticUser(dispatch, data, setIsloading, setInActiveCustomer);
  };

  return (
    <div
      className="modal fade"
      id="staticCustomerSync"
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
              {t("staticCustomerSync")}
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
                checked={inActiveCustomer}
                id="flexCheckDefault"
                onChange={(event) => setInActiveCustomer(event.target.checked)}
              />
              <label class="form-check-label" for="flexCheckDefault">
                <small className="text-secondary">
                  {t("doYouWantToSyncWithInActiveCustomer")}
                </small>
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
                onClick={syncCostomer}
                className="btn btn-success"
                disabled={isLoading}
              >
                {isLoading ? <Loader /> : t("sync")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSync;
