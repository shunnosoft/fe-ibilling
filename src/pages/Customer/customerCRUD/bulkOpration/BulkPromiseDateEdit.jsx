import React, { useState } from "react";
import RootBulkModal from "./bulkModal";
import moment from "moment";
import Loader from "../../../../components/common/Loader";
import DatePicker from "react-datepicker";
import { bulkPromiseDateEdit } from "../../../../features/actions/bulkOperationApi";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

const BulkPromiseDateEdit = ({ bulkCustomer, modalId }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState();
  const [billDate, setBillDate] = useState(false);

  const dispatch = useDispatch();

  let mxDate = new Date();
  mxDate.setDate(mxDate.getDate() + parseInt(20));

  const promiseDateHandler = (e) => {
    e.preventDefault();
    if (billDate) {
      const data = {
        customerIds: bulkCustomer.map((item) => item.original.id),
        promiseDate: billDate.toISOString(),
      };
      bulkPromiseDateEdit(dispatch, data, setIsLoading);
    }
  };

  return (
    <RootBulkModal modalId={modalId} header={t("editPromiseDate")}>
      <form onSubmit={promiseDateHandler}>
        <p className="customerFieldsTitle">{t("selectDate")}</p>
        <div className="mb-3">
          <DatePicker
            className="form-control"
            selected={billDate}
            onChange={(date) => setBillDate(date)}
            dateFormat="dd/MM/yyyy h:mm a"
            showTimeSelect
            timeIntervals={1}
            placeholderText={t("selectDate")}
            minDate={new Date()}
            maxDate={mxDate}
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

export default BulkPromiseDateEdit;
