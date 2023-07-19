import React, { useState } from "react";
import RootBulkModal from "./bulkModal";
import Loader from "../../../../components/common/Loader";
import { bulkBalanceEdit } from "../../../../features/actions/bulkOperationApi";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

const BulkBalanceEdit = ({ bulkCustomer, show, setShow }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState();
  const [balance, setBalance] = useState();

  const dispatch = useDispatch();
  const BalanceEditHandler = (e) => {
    e.preventDefault();
    if (balance) {
      const data = {
        customerIds: bulkCustomer.map((item) => item.original.id),
        balance,
      };
      bulkBalanceEdit(dispatch, data, setIsLoading, setShow);
    } else {
      alert(t("balanceRequired"));
    }
  };

  return (
    <RootBulkModal show={show} setShow={setShow} header={t("updateBalance")}>
      <form onSubmit={BalanceEditHandler}>
        <div class="mb-3">
          <label for="balance" class="form-label">
            {t("balance")}
          </label>
          <input
            type="number"
            class="form-control"
            id="balance"
            onChange={(event) => setBalance(event.target.value)}
          />
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
export default BulkBalanceEdit;
