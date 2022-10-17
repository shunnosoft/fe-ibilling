import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Loader from "../../../components/common/Loader";
import { deleteSingleMikrotik } from "../../../features/apiCalls";

const MikrotikDelete = ({ mikrotikID }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get isp owner id
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // get all mikrotik from redux
  const allmikrotiks = useSelector((state) => state.mikrotik.mikrotik);

  // find deleteble mikrotik
  const data = allmikrotiks.find((item) => item.id === mikrotikID);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // delete mikrotik handler
  const deleteMikrotik = () => {
    const IDs = {
      ispOwner,
      id: mikrotikID,
    };
    deleteSingleMikrotik(dispatch, IDs, setIsLoading);
  };

  return (
    <div
      className="modal fade modal-dialog-scrollable "
      id="deleteMikrotikModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {data?.name} {t("mikrotikDelete")}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {t("areYouSureWantToDeleteMikrotik")}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="btn btn-success"
              onClick={deleteMikrotik}
            >
              {isLoading ? <Loader /> : t("delete")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MikrotikDelete;
