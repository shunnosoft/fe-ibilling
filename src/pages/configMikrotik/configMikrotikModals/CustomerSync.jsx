import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../components/common/Loader";
import {
  fetchMikrotikSyncUser,
  syncMikrotikStaticUser,
} from "../../../features/apiCalls";
import { useTranslation } from "react-i18next";

const CustomerSync = ({
  mikrotikId,
  ispOwner,
  customerType,
  inActiveCustomer,
  setInActiveCustomer,
}) => {
  const { t } = useTranslation();
  // import dispatch
  const dispatch = useDispatch();

  // loading state
  const [isLoading, setIsloading] = useState(false);

  // Sync Customer
  const syncCostomer = () => {
    // send data for api
    const data = {
      ispOwner: ispOwner,
      mikrotikId: mikrotikId,
      inActiveCustomer: inActiveCustomer,
    };

    if (customerType === "PPPoE") {
      fetchMikrotikSyncUser(dispatch, data, setIsloading);
    }
    if (customerType === "static") {
      syncMikrotikStaticUser(dispatch, data, setIsloading);
    }
  };

  return (
    <div
      className="modal fade"
      id="SyncCustomer"
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
              {customerType === "PPPoE"
                ? t("PPPoEPackageSync")
                : t("staticCustomerSync")}
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
                {t("cancle")}
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
