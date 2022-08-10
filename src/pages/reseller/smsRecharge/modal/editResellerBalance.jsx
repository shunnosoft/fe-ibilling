import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../../components/common/Loader";
import { updateResellerBalance } from "../../../../features/apiCalls";

const EditResellerBalance = ({ resellerId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const allReseller = useSelector((state) => state?.reseller?.reseller);

  const reseller = allReseller.find((val) => {
    return val.id === resellerId;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [resellerBalanceState, setResellerBalance] = useState(0);

  useEffect(() => {
    setResellerBalance(reseller?.rechargeBalance);
  }, [resellerId]);

  const updateBalanceController = () => {
    const { rechargeBalance, ...resellerData } = reseller;

    const data = {
      ispId: reseller.ispOwner,
      resellerId: reseller.id,
      rechargeBalance: resellerBalanceState,
      ...resellerData,
    };
    updateResellerBalance(dispatch, data, setIsLoading);
  };

  return (
    <>
      <div
        className="modal fade"
        id="resellerBalanceEditModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {t("editBalance")}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <input
                className="form-control w-100"
                type="number"
                value={resellerBalanceState}
                onChange={(e) => setResellerBalance(e.target.value)}
                min={0}
                placeholder={t("enterAmount")}
              />
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
                onClick={updateBalanceController}
                type="button"
                className="btn btn-success"
              >
                {isLoading ? <Loader></Loader> : t("update")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditResellerBalance;
