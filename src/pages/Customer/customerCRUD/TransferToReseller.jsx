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

  //get current user
  const currentUser = useSelector(
    (state) => state.persistedReducer.auth.currentUser
  );

  //get all reseller
  const reseller = useSelector(
    (state) => state.persistedReducer?.reseller?.reseller
  );

  //state
  const [isLoading, setIsLoading] = useState(false);

  const transferToReseller = () => {
    // transferToResellerApi();
  };

  return (
    <div className="modal fade" id="transferToReseller" tabindex="-1">
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
            <label htmlFor="selectReseller">{t("selectReseller")}</label>
            <select id="selectReseller" className="form-select mw-100">
              <option selected>{t("selectReseller")}</option>
              {reseller.map((item) => (
                <option value={item.id}>{item.name}</option>
              ))}
            </select>
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
