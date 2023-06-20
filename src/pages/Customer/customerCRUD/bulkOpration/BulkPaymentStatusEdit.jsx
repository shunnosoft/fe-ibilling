import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Loader from "../../../../components/common/Loader";
import { bulkPaymentStatusEdit } from "../../../../features/actions/bulkOperationApi";
import RootBulkModal from "./bulkModal";
import { useTranslation } from "react-i18next";

const BulkPaymentStatusEdit = ({ bulkCustomer, modalId }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const dispatch = useDispatch();

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
        bulkPaymentStatusEdit(dispatch, data, setIsLoading);
      }
    }
  };

  return (
    <RootBulkModal modalId={modalId} header={t("editPaymentStatus")}>
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
            data-bs-dismiss="modal"
            disabled={isLoading}
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            className="btn btn-success"
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : t("save")}
          </button>
        </div>
      </form>
    </RootBulkModal>
  );
};

export default BulkPaymentStatusEdit;
