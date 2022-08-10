import React, { useState } from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../components/common/Loader";
import { recharge } from "../../../features/apiCalls";

import "../../message/message.css";
import { useTranslation } from "react-i18next";

function Recharge({ resellerId }) {
  const { t } = useTranslation();
  const rechargeRef = useRef(Number);
  const dispatch = useDispatch();
  const [isLoading, setIsloading] = useState(false);
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.userData.id
  );

  const allReseller = useSelector((state) => state?.reseller?.reseller);
  const reseller = allReseller.find((val) => {
    return val.id === resellerId;
  });

  const rechargeHandler = () => {
    const data = {
      amount: parseInt(rechargeRef.current.value),
      ispOwner: ispOwnerId,
      reseller: reseller.id,
    };
    recharge(data, setIsloading, dispatch, rechargeRef);
  };
  return (
    <>
      <div
        className="modal fade"
        id="resellerRechargeModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {t("rechargeAmount")}
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
                ref={rechargeRef}
                className="form-control"
                type="number"
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
                type="button"
                className="btn btn-success"
                onClick={rechargeHandler}
              >
                {isLoading ? <Loader></Loader> : t("recharge")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Recharge;
