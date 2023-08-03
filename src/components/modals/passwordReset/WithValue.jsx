import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Loader from "../../common/Loader";
import { useState } from "react";
import { PasswordResetApi } from "../../../features/resetPasswordApi";

const WithValue = ({ resetCustomerId }) => {
  const { t } = useTranslation();

  // loading state
  const [isLoading, setIsloading] = useState(false);

  // reset password method
  const resetPassword = () => {
    PasswordResetApi(resetCustomerId, setIsloading);
  };

  return (
    <div
      className="modal fade modal-dialog-scrollable "
      id="resetPasswordWithValue"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {t("passwordReset")}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <p>{t("resetPasswordConfirmation")}</p>
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
              onClick={resetPassword}
              className="btn btn-success customBtn"
              disabled={isLoading}
            >
              {isLoading ? <Loader /> : t("submit")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithValue;
