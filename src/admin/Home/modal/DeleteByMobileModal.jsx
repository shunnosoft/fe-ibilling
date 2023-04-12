import React from "react";
import {
  DeleteByNumber,
  SearchByNumber,
} from "../../../features/modifyNumberApi";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Loader from "../../../components/common/Loader";

const DeleteByMobileModal = () => {
  const { t } = useTranslation();

  //get current use Role
  const currentUserRole = useSelector(
    (state) => state.persistedReducer.auth.role
  );

  const [customer, setCustomer] = useState("");
  const [mobile, setMobile] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //search api call function
  const SearchHandler = () => {
    SearchByNumber(mobile, setCustomer, setIsLoading);
  };

  //delete api call function
  const deleteHandler = () => {
    const confirm = window.confirm("Are you sure to Delete");
    if (confirm) DeleteByNumber(mobile, setIsLoading);
  };
  return (
    <div
      class="modal fade"
      id="numberDeleteModal"
      tabindex="-1"
      aria-labelledby="numberDeleteModal"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="numberDeleteModal">
              {t("enterNumber")}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <input
              onChange={(e) => setMobile(e.target.value)}
              type="number"
              className="me-3"
            />
            <span
              type="button"
              onClick={SearchHandler}
              className="btn btn-primary btn-sm"
            >
              {isLoading ? <Loader /> : t("search")}
            </span>

            <br />
            <br />

            {customer?.profile?.id && (
              <>
                <h5>{t("customerFound")}</h5>
                <h5>
                  {t("name")} : {customer?.profile?.name}
                </h5>
                <h5>
                  {t("mobile")} : {customer?.profile?.mobile}
                </h5>
                {(currentUserRole === "superAdmin" ||
                  (currentUserRole === "admin" &&
                    customer?.user?.role === "customer")) && (
                  <button
                    type="button"
                    onClick={deleteHandler}
                    className="btn btn-danger btn-sm py-1"
                  >
                    {t("delete")}
                  </button>
                )}
              </>
            )}
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              {t("close")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteByMobileModal;
