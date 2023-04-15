import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMikrotik,
  removeFireWallAllIpDrop,
  resetFireWallAllIpDrop,
} from "../../features/apiCalls";
import Loader from "../../components/common/Loader";

const FireWallFilterIpDropControl = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get ispOwner id
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // get ispOwner mikrotik
  const mikrotiks = useSelector((state) => state?.mikrotik?.mikrotik);

  // get fire wall ip filter drop
  const fireWallIpFilterDrop = useSelector(
    (state) => state.customer?.fireWallFilterDrop
  );

  //Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [ipLoading, setIpLoading] = useState(false);

  // select mikrotik id state
  const [mikrotikId, setmikrotikId] = useState("");

  // api call change handler
  const [apiCall, setApiCall] = useState("");

  // mikrotik change handler
  const mikrotikChangeHandler = (e) => {
    setmikrotikId(e.target.value);
  };

  // fire wall filter ip drop switch api call
  const apiCallChangeHandler = (value) => {
    if (value === true) {
      setApiCall("removeRequest");
    }
    if (value === false) {
      setApiCall("resetRequest");
    }
  };

  // fire wall filter all ip drop delete and reset api call handler
  useEffect(() => {
    if (apiCall === "removeRequest") {
      removeFireWallAllIpDrop(dispatch, setIpLoading, ispOwner, mikrotikId);
    }

    if (apiCall === "resetRequest") {
      resetFireWallAllIpDrop(dispatch, setIpLoading, ispOwner, mikrotikId);
    }
  }, [apiCall]);

  useEffect(() => {
    fetchMikrotik(dispatch, ispOwner, setIsLoading);
  }, [ispOwner]);

  return (
    <div
      className="modal fade"
      id="fireWallFilterIpDropControl"
      tabIndex="-1"
      aria-labelledby="fireWallIpDrop"
      aria-hidden="true"
    >
      <div className="modal-dialog ">
        <div className="modal-content">
          <div className="modal-header">
            <h5
              style={{ color: "#0abb7a" }}
              className="modal-title"
              id="fireWallIpDrop"
            >
              {t("fireWallIpFilterDrop")}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form>
              <div class="mb-4">
                <label
                  class="form-label mb-0 text-secondary"
                  for="singleIpDrop"
                >
                  {t("selectMikrotik")}
                </label>
                <select
                  className="form-select mw-100 mt-0"
                  aria-label="Default select example"
                  onChange={mikrotikChangeHandler}
                >
                  <option value="">...</option>
                  {mikrotiks.map((mtk) => (
                    <option value={mtk.id} name={mtk.name}>
                      {mtk.name}
                    </option>
                  ))}
                </select>
              </div>

              {mikrotikId && (
                <div className="shadow-none p-3 mb-5 bg-light rounded">
                  <div class="form-check form-switch">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="fireWallIpDropApiCall"
                      onChange={(e) => apiCallChangeHandler(e.target.checked)}
                      checked={
                        fireWallIpFilterDrop[0]?.status === "delete" ||
                        fireWallIpFilterDrop[0]?.status !== "drop"
                      }
                    ></input>
                    <label
                      class="form-check-label text-secondary"
                      for="fireWallIpDropApiCall"
                    >
                      {fireWallIpFilterDrop[0]?.status === "delete"
                        ? t("bringBackFireWallIpDrop")
                        : t("deleteFireWallIpDrop")}
                    </label>
                  </div>
                </div>
              )}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  disabled={isLoading || ipLoading}
                >
                  {ipLoading ? <Loader /> : t("cancel")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FireWallFilterIpDropControl;
