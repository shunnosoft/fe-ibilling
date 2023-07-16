import React, { useState } from "react";
import RootBulkModal from "./bulkModal";
import moment from "moment";
import Loader from "../../../../components/common/Loader";
import DatePicker from "react-datepicker";
import { bulkBillingCycleEdit } from "../../../../features/actions/bulkOperationApi";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

const BulkBillingCycleEdit = ({ bulkCustomer, modalId }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState();
  const [billDate, setBillDate] = useState(false);

  const dispatch = useDispatch();
  const billingCycleHandler = (e) => {
    e.preventDefault();
    if (billDate) {
      const data = {
        customerIds: bulkCustomer.map((item) => item.original.id),
        billingCycle: billDate.toISOString(),
      };
      bulkBillingCycleEdit(dispatch, data, setIsLoading);
    }
  };

  return (
    <RootBulkModal modalId={modalId} header={t("updateBillingCycle")}>
      <form onSubmit={billingCycleHandler}>
        <p className="customerFieldsTitle">{t("selectDate")}</p>
        <div className="mb-3">
          <DatePicker
            className="form-control"
            selected={billDate}
            onChange={(date) => setBillDate(date)}
            dateFormat="dd/MM/yyyy h:mm a"
            showTimeSelect
            timeIntervals={60}
            placeholderText={t("selectDate")}
          />
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
export default BulkBillingCycleEdit;
