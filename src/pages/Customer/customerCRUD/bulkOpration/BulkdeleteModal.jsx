import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Loader from "../../../../components/common/Loader";
import { bulkDeleteCustomer } from "../../../../features/actions/bulkOperationApi";
import RootBulkModal from "./bulkModal";
import { useTranslation } from "react-i18next";

const BulkCustomerDelete = ({ bulkCustomer, modalId }) => {
  const { t } = useTranslation();
  // loading state
  const [isLoading, setIsloading] = useState(false);
  const [mikrotikCheck, setMikrotikCheck] = useState(false);
  const dispatch = useDispatch();
  // DELETE handler
  const bulkDeleteHandler = () => {
    let checkCondition = true;

    if (mikrotikCheck) {
      checkCondition = window.confirm(t("deleteMikrotik"));
    }

    // send data for api
    const data = {
      customerIds: bulkCustomer.map((item) => {
        return item.original.id;
      }),
    };

    // api call
    if (checkCondition) {
      const confirm = window.confirm(
        data.customerIds.length + "টি গ্রাহক ডিলিট করতে চান?"
      );
      if (confirm)
        bulkDeleteCustomer(dispatch, data, mikrotikCheck, setIsloading);
    }
  };

  return (
    <RootBulkModal
      modalId={modalId}
      header={`${bulkCustomer.length} টি গ্রাহক ডিলিট করুন`}
    >
      <div class="form-check mt-4">
        <input
          class="form-check-input"
          type="checkbox"
          checked={mikrotikCheck}
          id="flexCheckDefault"
          onChange={(event) => setMikrotikCheck(event.target.checked)}
        />
        <label class="form-check-label" for="flexCheckDefault">
          <small className="text-secondary">{t("deleteMikrotik")}</small>
        </label>
      </div>

      <div className="modal-footer" style={{ border: "none" }}>
        <button
          type="button"
          className="btn btn-secondary"
          data-bs-dismiss="modal"
          disabled={isLoading}
        >
          {t("cancle")}
        </button>
        <button
          onClick={bulkDeleteHandler}
          className="btn btn-success"
          disabled={isLoading}
        >
          {isLoading ? <Loader /> : t("delete")}
        </button>
      </div>
    </RootBulkModal>
  );
};

export default BulkCustomerDelete;
