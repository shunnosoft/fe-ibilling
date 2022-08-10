import React, { useState } from "react";
import RootBulkModal from "./bulkModal";
import Loader from "../../../../components/common/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  bulkCustomerTransfer,
  bulkDeleteCustomer,
} from "../../../../features/actions/bulkOperationApi";

const BulkCustomerTransfer = ({ bulkCustomer, modalId }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  //get all reseller
  const reseller = useSelector((state) => state?.reseller?.reseller);

  const [isLoading, setIsLoading] = useState(false);
  const [resellerId, setResellerId] = useState();

  const bulkCustomerTransferController = () => {
    const enBn = localStorage.getItem("netFee:lang");
    if (!resellerId) return alert("Please select a reseler");
    const data = {
      customerIds: bulkCustomer.map((item) => {
        return item.original.id;
      }),
      resellerId: resellerId,
    };

    let confirm;
    if (enBn === "bn") {
      confirm = window.confirm(
        "Are you sure transfer " +
          data.customerIds.length +
          " customer to reseller"
      );
    } else {
      confirm = window.confirm(
        data.customerIds.length + " টি গ্রাহক রিসেলার কে দিতে চান?"
      );
    }

    if (confirm) bulkCustomerTransfer(dispatch, data, setIsLoading);
  };

  return (
    <RootBulkModal modalId={modalId} header={t("transferReseller")}>
      <label htmlFor="selectReseller">{t("selectReseller")}</label>
      <select
        onChange={(e) => setResellerId(e.target.value)}
        id="selectReseller"
        className="form-select mw-100"
      >
        <option selected>{t("selectReseller")}</option>
        {reseller.map((item) => (
          <option value={item.id}>{item.name}</option>
        ))}
      </select>

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
          onClick={bulkCustomerTransferController}
          type="submit"
          className="btn btn-success"
          disabled={isLoading}
        >
          {isLoading ? <Loader /> : t("save")}
        </button>
      </div>
    </RootBulkModal>
  );
};
export default BulkCustomerTransfer;
