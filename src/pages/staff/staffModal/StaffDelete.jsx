import React from "react";
import { useState } from "react";
import Loader from "../../../components/common/Loader";
import { useTranslation } from "react-i18next";
import { deleteStaffApi } from "../../../features/apiCallStaff";
import { useDispatch } from "react-redux";

const StaffDelete = ({ staffId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // delete salary handler
  const deleteStaffHandler = () => {
    deleteStaffApi(dispatch, staffId, setIsLoading);
  };

  return (
    <div
      className="modal fade modal-dialog-scrollable "
      id="deleteStaff"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {t("staffDelete")}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <p>{t("staffDeleteAlert")}</p>
          </div>
          <div className="modal-footer">
            <button
              onClick={deleteStaffHandler}
              className="btn btn-success"
              disabled={isLoading}
            >
              {isLoading ? <Loader /> : t("submit")}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              disabled={isLoading}
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDelete;
