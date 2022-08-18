import React from "react";
import { useState } from "react";
import Loader from "../../../components/common/Loader";
import { useTranslation } from "react-i18next";
import { deleteSalary } from "../../../features/apiCallStaff";
import { useDispatch } from "react-redux";

const SalaryDeleteModal = ({ salaryId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // delete salary handler
  const deleteSalaryHandler = () => {
    deleteSalary(dispatch, setIsLoading, salaryId);
  };

  return (
    <div
      className="modal fade modal-dialog-scrollable "
      id="deleteSalaryModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {t("salaryDelete")}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <p>{t("salaryDeleteAlert")}</p>
          </div>
          <div className="modal-footer">
            <button
              onClick={deleteSalaryHandler}
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

export default SalaryDeleteModal;
