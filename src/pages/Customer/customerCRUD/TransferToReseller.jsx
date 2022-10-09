import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../components/common/Loader";
import { transferToResellerApi } from "../../../features/actions/customerApiCall";

const TransferToReseller = ({ customerId }) => {
  //call dispatch
  const dispatch = useDispatch();

  //en bn hook call
  const { t } = useTranslation();

  const allSubArea = useSelector((state) => state?.area?.subArea);

  //get all reseller
  const reseller = useSelector((state) => state?.reseller?.reseller);

  const customer = useSelector((state) => state?.customer?.customer);

  //state
  const [isLoading, setIsLoading] = useState(false);
  const [resellerId, setResellerId] = useState("");
  const [subAreaId, setSubAreaId] = useState("");
  const selectedReseller = reseller.find((item) => item.id === resellerId);

  let subAreas = [];
  if (selectedReseller) {
    subAreas = allSubArea?.filter((item) =>
      selectedReseller.subAreas.includes(item.id)
    );
  }

  const transferToReseller = () => {
    if (!resellerId || !subAreaId) {
      return alert("Please select a reseller and sub area");
    }
    const selectedCustomer = customer.find((item) => item.id === customerId);
    const data = {
      ...selectedCustomer,
      reseller: selectedReseller.id,
      subArea: subAreaId,
    };

    transferToResellerApi(dispatch, data, setIsLoading);
  };

  return (
    <div className="modal fade" id="transferToReseller" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{t("transferReseller")}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-2">
              <label htmlFor="selectReseller">{t("selectReseller")}</label>
              <select
                onClick={(e) => setResellerId(e.target.value)}
                id="selectReseller"
                className="form-select mw-100"
              >
                <option selected value="">
                  {t("selectReseller")}
                </option>
                {reseller.map((item) => (
                  <option value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label htmlFor="selectReseller">{t("selectSubArea")}</label>
              <select
                onClick={(e) => setSubAreaId(e.target.value)}
                id="selectReseller"
                className="form-select mw-100"
              >
                <option selected value="">
                  {t("subArea")}
                </option>
                {subAreas.map((item) => (
                  <option value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              {t("cancel")}
            </button>
            <button
              onClick={transferToReseller}
              type="button"
              className="btn btn-success"
              disabled={isLoading}
            >
              {isLoading ? <Loader /> : t("submit")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferToReseller;
