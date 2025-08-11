import React, { useState } from "react";
import RootBulkModal from "./bulkModal";
import Loader from "../../../../components/common/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { bulkCustomerTransfer } from "../../../../features/actions/bulkOperationApi";
import { useEffect } from "react";
import { fetchReseller } from "../../../../features/apiCalls";
import { toast } from "react-toastify";

const BulkCustomerTransfer = ({ bulkCustomer, show, setShow }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // get isp owner data
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth.userData?.bpSettings
  );

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
    const enBn = localStorage.getItem("oneBilling:lang");
    if (!resellerId) return alert("Please select a reseler");
    if (!subAreaId) return alert("Please select a Sub Area");
    let temp = [];
    let temp2 = [];

    const data = {
      customerIds: [],
      resellerId: resellerId,
      subAreaId,
    };

    //--> check if selected reseller has mikrotik or not
    if (bpSettings?.hasMikrotik) {
      bulkCustomer?.map((item) => {
        //--> check if selected reseller has mikrotik
        if (selectedReseller?.mikrotiks.includes(item.original.mikrotik)) {
          //--> check if selected reseller has package
          if (
            selectedReseller?.mikrotikPackages.includes(
              item.original.mikrotikPackage
            )
          ) {
            data.customerIds.push(item.original.id);
          } else {
            temp2.push(item.original);
          }
        } else {
          temp.push(item.original);
        }
      });
    } else {
      bulkCustomer?.map((val) => {
        return data.customerIds.push(val.original.id);
      });
    }

    let confirm;
    if (enBn === "bn") {
      confirm = window.confirm(
        "Are you sure transfer " +
          data.customerIds.length +
          " customer to reseller"
      );
    } else if (data?.customerIds.length > 0 && temp.length > 0) {
      confirm = window.confirm(
        data.customerIds.length +
          " টি গ্রাহক রিসেলার কে দিতে পারেন" +
          " বাকি " +
          temp.length +
          " টি গ্রাহক অন্য একটি মাইক্রোটিকের"
      );
    } else if (temp2.length > 0) {
      confirm = window.confirm(
        data.customerIds.length +
          " টি গ্রাহক রিসেলার কে দিতে পারেন" +
          " বাকি " +
          temp2.length +
          " টি গ্রাহক অন্য একটি প্যাকেজের"
      );
    } else {
      confirm = window.confirm(
        data.customerIds.length + " টি গ্রাহক রিসেলার কে দিতে চান?"
      );
    }

    if (temp.length > 0) {
      temp.map((val) =>
        toast.error(
          `Id : ${val.customerId}, Name : ${val.pppoe.name}` +
            " " +
            t("bulkCustomerError")
        )
      );
    }

    if (confirm) bulkCustomerTransfer(dispatch, data, setIsLoading, setShow);
  };

  useEffect(() => {
    if (role === "ispOwner") fetchReseller(dispatch, ispOwner, setIsLoading);
  }, []);

  return (
    <RootBulkModal show={show} setShow={setShow} header={t("transferReseller")}>
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
          onChange={(e) => setSubAreaId(e.target.value)}
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
          disabled={isLoading}
          onClick={() => setShow(false)}
        >
          {t("cancel")}
        </button>
        <button
          onClick={bulkCustomerTransferController}
          type="submit"
          className="btn btn-success"
          disabled={isLoading}
        >
          {isLoading ? <Loader /> : t("submit")}
        </button>
      </div>
    </RootBulkModal>
  );
};
export default BulkCustomerTransfer;
