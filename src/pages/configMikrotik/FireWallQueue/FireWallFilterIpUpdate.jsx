import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Loader from "../../../components/common/Loader";
import { updateFireWallIpDrop } from "../../../features/apiCalls";
import { useDispatch } from "react-redux";

const FireWallFilterIpUpdate = ({ updateIp }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // update fire wall ip state
  const [fireWallIp, setFireWallIp] = useState("");

  // fire wall id drop handler
  const fireWallIpDropHandler = (e) => {
    e.preventDefault();
    updateFireWallIpDrop(dispatch, setIsLoading, fireWallIp);
  };

  // change fire wall ip
  const changeFireWallIp = (e) => {
    setFireWallIp({ ...fireWallIp, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setFireWallIp(updateIp);
  }, [updateIp]);

  return (
    <div
      className="modal fade"
      id="fireWallFilterIpDropUpdate"
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
              {t("fireWallIpUpdate")}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={fireWallIpDropHandler}>
              <div class="mb-4">
                <label
                  class="form-label mb-0 text-secondary"
                  for="singleIpDrop"
                >
                  {t("inputFireWallIpFilterDrop")}
                </label>
                <input
                  class="form-control"
                  type="text"
                  id="singleIpDrop"
                  name="srcAddress"
                  value={fireWallIp?.srcAddress}
                  onChange={changeFireWallIp}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  disabled={isLoading}
                >
                  {t("cancel")}
                </button>
                <button
                  className="btn btn-success"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader /> : t("submit")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FireWallFilterIpUpdate;
