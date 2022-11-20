import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import Loader from "../../../../components/common/Loader";
import { syncHotspotCustomer } from "../../../../features/hotspotApi";
const HotspotCustomerSync = ({ ispOwnerId, mikrotikId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // hotspot Customer loading state
  const [hotspotCustomerLoading, setHotspotCustomerLoading] = useState(false);

  // inactive checkbox state
  const [inActiveCustomer, setInActiveCustomer] = useState(false);

  // sync hotspot customer handler
  const hotspotCustomerHandle = () => {
    syncHotspotCustomer(
      dispatch,
      ispOwnerId,
      mikrotikId,
      inActiveCustomer,
      setInActiveCustomer,
      setHotspotCustomerLoading
    );
  };
  return (
    <div
      className="modal fade"
      id="hotspotCustomerSync"
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
              {t("PPPoECustomerSync")}
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
                disabled={hotspotCustomerLoading}
              >
                {t("cancel")}
              </button>
              <button
                onClick={hotspotCustomerHandle}
                className="btn btn-success"
                disabled={hotspotCustomerLoading}
              >
                {hotspotCustomerLoading ? <Loader /> : t("sync")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotspotCustomerSync;
