import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Loader from "../../../components/common/Loader";
import { useDispatch, useSelector } from "react-redux";
import { deleteFireWallIpDrop } from "../../../features/apiCalls";

const FireWallFilterIpDelete = ({
  deleteIp,
  mikrotikCheck,
  setMikrotikCheck,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get user bp setting
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.userData?.bpSettings
  );

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // fire Wall filter ip Drop delete Handler
  const fireWallIpDropDelete = (id) => {
    let checkCondition = true;

    if (mikrotikCheck) {
      checkCondition = window.confirm(t("deleteMikrotik"));
    }

    const data = {
      ispOwner: ispOwnerId,
      id: id,
      mikrotik: mikrotikCheck,
    };

    if (checkCondition) {
      deleteFireWallIpDrop(dispatch, setIsLoading, data);
    }
  };

  return (
    <div
      className="modal fade"
      id="fireWallFilterIpDropDelete"
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
              {t("fireWallIpDelete")}
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
              {deleteIp?.srcAddress} {t("srcAddressDelete")}
            </h5>

            {bpSettings?.hasMikrotik && (
              <>
                <div class="form-check mt-4">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    checked={mikrotikCheck}
                    id="mikrotikCheck"
                    onChange={(event) => setMikrotikCheck(event.target.checked)}
                  />
                  <label
                    class="form-check-label text-secondary"
                    for="mikrotikCheck"
                  >
                    {t("deleteMikrotik")}
                  </label>
                </div>
              </>
            )}

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
                  fireWallIpDropDelete(deleteIp?.id);
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

export default FireWallFilterIpDelete;
