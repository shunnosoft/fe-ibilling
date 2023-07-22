import { useTranslation } from "react-i18next";
import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { bulkAutoConnectionEdit } from "../../../features/actions/bulkOperationApi";
import RootBulkModal from "./bulkModal";
import Loader from "../../../components/common/Loader";

const ResellerBulkAutoConnectionEdit = ({ bulkCustomer, show, setShow }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [autoDisable, setAutoDisable] = useState(false);
  const dispatch = useDispatch();

  const changeStatus = (e) => {
    e.preventDefault();

    const data = {
      customerIds: bulkCustomer.map((item) => item.original.id),
      autoDisable: autoDisable,
    };
    let confirm;
    if (autoDisable) {
      confirm = window.confirm(
        t("areYouWantToOnAutoDisable") +
          bulkCustomer.length +
          t("onAutoDisable")
      );
    }
    if (!autoDisable) {
      confirm = window.confirm(
        t("areYouWantToOffAutoDisable") +
          bulkCustomer.length +
          t("offAutoDisable")
      );
    }
    if (confirm) {
      bulkAutoConnectionEdit(dispatch, data, setIsLoading, setShow);
    }
  };

  return (
    <RootBulkModal show={show} setShow={setShow} header={t("updateStatus")}>
      <form onSubmit={changeStatus}>
        <div className="autoDisable">
          <label htmlFor="autoDisable">{t("automaticConnectionOff")}</label>
          <input
            id="autoDisable"
            type="checkBox"
            checked={autoDisable}
            onChange={(e) => setAutoDisable(e.target.checked)}
          />
        </div>

        <div className="modal-footer" style={{ border: "none" }}>
          <button
            type="button"
            className="btn btn-secondary"
            data-bs-dismiss="modal"
            disabled={isLoading}
            onClick={() => setShow(false)}
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            className="btn btn-success"
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : t("submit")}
          </button>
        </div>
      </form>
    </RootBulkModal>
  );
};

export default ResellerBulkAutoConnectionEdit;
