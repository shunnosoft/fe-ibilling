import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import Loader from "../../../components/common/Loader";
import { deleteNetFeeSupportData } from "../../../features/apiCalls";

const SupportDelete = ({ deleteId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // isLoading state
  const [isLoading, setIsLoading] = useState("");

  const supportDeleteHandler = () => {
    deleteNetFeeSupportData(dispatch, setIsLoading, deleteId);
  };

  return (
    <div
      class="modal fade"
      id="supportDelete"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              {t("supportDelete")}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>{t("doYouWantToDeleteSupport")}</p>
          </div>
          <div class="modal-footer">
            <button
              disabled={isLoading}
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              {t("cancel")}
            </button>
            <button
              disabled={isLoading}
              type="button"
              class="btn btn-danger"
              onClick={supportDeleteHandler}
            >
              {isLoading ? <Loader /> : t("delete")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportDelete;
