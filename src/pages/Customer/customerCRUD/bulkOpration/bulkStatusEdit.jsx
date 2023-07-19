import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Loader from "../../../../components/common/Loader";
import { bulkStatusEdit } from "../../../../features/actions/bulkOperationApi";
import RootBulkModal from "./bulkModal";
import { useTranslation } from "react-i18next";

const BulkStatusEdit = ({ bulkCustomer, show, setShow }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const dispatch = useDispatch();

  const changeStatus = (e) => {
    e.preventDefault();
    if (status) {
      const data = {
        customerIds: bulkCustomer.map((item) => item.original.id),
        status: status,
      };
      const confirm = window.confirm(
        t("areYouWantToUpdateStatus") +
          bulkCustomer.length +
          t("updateStatusSubArea")
      );
      if (confirm) {
        bulkStatusEdit(dispatch, data, setIsLoading, setShow);
      }
    }
  };

  return (
    <RootBulkModal show={show} setShow={setShow} header={t("updateStatus")}>
      <form onSubmit={changeStatus}>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="status"
            value={"active"}
            onChange={(e) => setStatus(e.target.value)}
            id="activeCustomer"
          />
          <label className="form-check-label" htmlFor="activeCustomer">
            {t("active")}
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="status"
            id="inactive"
            value={"inactive"}
            onChange={(e) => setStatus(e.target.value)}
          />
          <label className="form-check-label" htmlFor="inactive">
            {t("in active")}
          </label>
        </div>

        {/* <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="status"
            id="expired"
            value={"expired"}
            onChange={(e) => setStatus(e.target.value)}
          />
          <label className="form-check-label" htmlFor="expired">
            {t("expired")}
          </label>
        </div> */}

        <div className="modal-footer" style={{ border: "none" }}>
          <button
            type="button"
            className="btn btn-secondary"
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

export default BulkStatusEdit;
