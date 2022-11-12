import React, { useState } from "react";
import Loader from "../../../../components/common/Loader";
import {
  parchaseSms,
  purchaseSmsNetfee,
} from "../../../../features/resellerParchaseSmsApi";
import { useDispatch } from "react-redux";
import FormatNumber from "../../../../components/common/NumberFormat";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const RechargeModal = ({ status }) => {
  const { t } = useTranslation();
  // import dispatch
  const dispatch = useDispatch();

  // get auth data
  let userData = useSelector(
    (state) => state.persistedReducer.auth.currentUser.reseller
  );

  //  loading local state
  const [isLoading, setIsLoading] = useState(false);

  // buy sms in netfee loading state
  const [loading, setLoading] = useState(false);

  // set sms amoun
  const [smsAmount, setSmsAmount] = useState();

  // buy place status
  const [buyStatus, setBuyStatus] = useState("ispOwner");

  // select messge type state
  const [messageType, setMessageType] = useState("nonMasking");

  // set error value
  const [errMsg, setErrMsg] = useState("");

  // handle required
  const hadleRequired = () => {
    if (!smsAmount) {
      setErrMsg(t("smsAmount"));
    }
    if (smsAmount < 400 && smsAmount > 10000) {
      setErrMsg(t("youCanBuyMin100AndMax10000"));
    }
  };

  // form required
  const handleChange = (event) => {
    setSmsAmount(event.target.value);

    if (event.target.value >= 400 || event.target.value) {
      setErrMsg("");
    }
  };

  useEffect(() => {
    setSmsAmount(400);
  }, [messageType]);

  // sms amount calculation
  let msgPrice;
  if (messageType === "nonMasking") {
    msgPrice = smsAmount * userData.smsRate;
  }
  if (messageType === "masking") {
    msgPrice = smsAmount * userData.maskingSmsRate;
  }
  if (messageType === "fixedNumber") {
    msgPrice = smsAmount * userData.fixedNumberSmsRate;
  }

  // handle submit
  const handleSubmit = (event) => {
    event.preventDefault();
    if (status.length === 0 || buyStatus === "netFee") {
      if (smsAmount >= 400 && smsAmount <= 10000) {
        if (buyStatus === "ispOwner") {
          const data = {
            smsAmount: smsAmount,
            smsParchaseType: messageType,
          };
          parchaseSms(data, setIsLoading, dispatch);
        } else if (buyStatus === "netFee") {
          let sendingData = {
            amount: msgPrice,
            numberOfSms: Number.parseInt(smsAmount),
            reseller: userData.id,
            user: userData.user,
            type: "smsPurchase",
            smsPurchaseType: messageType,
          };

          purchaseSmsNetfee(sendingData, setLoading, dispatch);
        }
      } else {
        setErrMsg(t("youCanBuyMin100AndMax10000"));
      }
    } else {
      toast.error(t("statusCannotBePending"));
    }
  };

  return (
    <div
      className="modal fade modal-dialog-scrollable "
      id="smsRechargeModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              {t("buySMS")}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form onSubmit={handleSubmit}>
              <h5>
                {t("moneyAmount")} :
                <span class="badge bg-info">
                  {smsAmount >= 100 && smsAmount <= 10000
                    ? FormatNumber(msgPrice)
                    : ""}
                </span>
              </h5>
              <div class="mb-3">
                <label for="exampleInputEmail1" className="form-label mb-0">
                  {t("amount")}
                </label>
                <input
                  value={smsAmount}
                  type="number"
                  className="form-control"
                  minLength="3"
                  maxLength="5"
                  onChange={handleChange}
                  onBlur={hadleRequired}
                />

                <div id="emailHelp" class="form-text text-danger">
                  {errMsg}
                </div>

                <label
                  for="exampleInputEmail1"
                  className="form-label mb-0 mt-3"
                >
                  {t("selectPlace")}
                </label>

                <select
                  id="max-none"
                  className="form-select mt-0"
                  aria-label="Default select example"
                  onChange={(event) => setBuyStatus(event.target.value)}
                >
                  <option value="netFee" selected>
                    NetFee
                  </option>
                  <option value="ispOwner">Isp Owner</option>
                </select>

                <label
                  for="exampleInputEmail1"
                  className="form-label mb-0 mt-3"
                >
                  {t("smsType")}
                </label>
                <select
                  id="max-none"
                  className="form-select mt-0"
                  onChange={(event) => setMessageType(event.target.value)}
                >
                  <option value="nonMasking">{t("nonMasking")}</option>
                  <option value="masking">{t("masking")}</option>
                  <option value="fixedNumber">{t("fixedNumber")}</option>
                </select>
              </div>
              <div className="modal-footer" style={{ border: "none" }}>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={
                    isLoading ||
                    (status.length !== 0 && buyStatus === "ispOwner")
                  }
                >
                  {isLoading || loading ? <Loader /> : t("submit")}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  disabled={isLoading}
                >
                  {t("cancel")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RechargeModal;
