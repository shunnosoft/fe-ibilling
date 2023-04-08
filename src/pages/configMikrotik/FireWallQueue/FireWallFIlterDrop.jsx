import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { fireWallIpFilterDrop } from "../../../features/apiCalls";
import Loader from "../../../components/common/Loader";

const FireWallFIlterDrop = ({ ispOwner, mikrotikId }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // customer block ip state
  const [dropIp, setDropIp] = useState();

  // fire wall id drop handler
  const fireWallIpDropHandler = (e) => {
    e.preventDefault();

    fireWallIpFilterDrop(dispatch, setIsLoading, ispOwner, mikrotikId, dropIp);
  };
  return (
    <div
      className="modal fade"
      id="fireWallIpFilter"
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
              Fire Wall Ip Filter Drop
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
                  Input Fire Wall Ip Filter Drop
                </label>
                <input
                  class="form-control"
                  type="text"
                  id="singleIpDrop"
                  onChange={(e) => setDropIp(e.target.value)}
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
                <button className="btn btn-success" disabled={isLoading}>
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

export default FireWallFIlterDrop;
