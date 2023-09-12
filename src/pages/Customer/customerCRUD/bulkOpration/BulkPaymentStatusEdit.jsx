import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Loader from "../../../../components/common/Loader";
import {
  bulkPaymentStatusEdit,
  hotspotBulkPaymentStatusEdit,
} from "../../../../features/actions/bulkOperationApi";
import RootBulkModal from "./bulkModal";
import { useTranslation } from "react-i18next";

const BulkPaymentStatusEdit = ({ bulkCustomer, show, setShow, bulkStatus }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // select status state
  const [status, setStatus] = useState("");

  const changeStatus = (e) => {
    e.preventDefault();

    if (status) {
      const data = {
        customerIds: bulkCustomer.map((item) => item.original.id),
        paymentStatus: status,
      };

      const confirm = window.confirm(
        t("areYouWantToUpdateStatus") +
          bulkCustomer.length +
          t("updateStatusSubArea")
      );

      if (confirm) {
        if (bulkStatus === "hotspot") {
          hotspotBulkPaymentStatusEdit(dispatch, data, setIsLoading, setShow);
        } else {
          bulkPaymentStatusEdit(dispatch, data, setIsLoading, setShow);
        }
      }
    }
  };

  return (
    <RootBulkModal
      show={show}
      setShow={setShow}
      header={t("editPaymentStatus")}
    >
      <form onSubmit={changeStatus}>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="status"
            value="paid"
            onChange={(e) => setStatus(e.target.value)}
            id="paid"
          />
          <label className="form-check-label" htmlFor="paid">
            {t("paid")}
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="status"
            id="unpaid"
            value="unpaid"
            onChange={(e) => setStatus(e.target.value)}
          />
          <label className="form-check-label" htmlFor="unpaid">
            {t("unpaid")}
          </label>
        </div>
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

export default BulkPaymentStatusEdit;
