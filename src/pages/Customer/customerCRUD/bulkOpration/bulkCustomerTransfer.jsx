import React, { useState } from "react";
import RootBulkModal from "./bulkModal";
import Loader from "../../../../components/common/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { bulkCustomerTransfer } from "../../../../features/actions/bulkOperationApi";
import { useEffect } from "react";
import { fetchReseller } from "../../../../features/apiCalls";

const BulkCustomerTransfer = ({ bulkCustomer, modalId }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // get user role
  const role = useSelector((state) => state.persistedReducer.auth.role);

  //get all reseller
  const reseller = useSelector((state) => state?.reseller?.reseller);

  // get all subarea
  const allSubArea = useSelector((state) => state.area?.subArea);

  // get isp owner id
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  const [isLoading, setIsLoading] = useState(false);
  const [resellerId, setResellerId] = useState();
  const [subAreaId, setSubAreaId] = useState("");
  const selectedReseller = reseller.find((item) => item.id === resellerId);

  let subAreas = [];
  if (selectedReseller) {
    subAreas = allSubArea?.filter((item) =>
      selectedReseller.subAreas.includes(item.id)
    );
  }

  const bulkCustomerTransferController = () => {
    const enBn = localStorage.getItem("netFee:lang");
    if (!resellerId) return alert("Please select a reseler");
    if (!subAreaId) return alert("Please select a Sub Area");

    const data = {
      customerIds: bulkCustomer.map((item) => {
        return item.original.id;
      }),
      resellerId: resellerId,
      subAreaId,
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

  useEffect(() => {
    if (role === "ispOwner") fetchReseller(dispatch, ispOwner, setIsLoading);
  }, []);

  return (
    <RootBulkModal modalId={modalId} header={t("transferReseller")}>
      <div className="reseller-section pb-2">
        <label htmlFor="selectReseller">{t("reseller")}</label>
        <select
          onChange={(e) => setResellerId(e.target.value)}
          id="selectReseller"
          className="form-select mw-100 mt-0"
        >
          <option selected>{t("selectReseller")}</option>
          {reseller.map((item) => (
            <option value={item.id}>{item.name}</option>
          ))}
        </select>
      </div>
      <div className="area-section">
        <label htmlFor="selectReseller">{t("subArea")}</label>
        <select
          onClick={(e) => setSubAreaId(e.target.value)}
          id="selectReseller"
          className="form-select mw-100 mt-0"
        >
          <option selected value="">
            {t("subArea")}
          </option>
          {subAreas.map((item) => (
            <option value={item.id}>{item.name}</option>
          ))}
        </select>
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
