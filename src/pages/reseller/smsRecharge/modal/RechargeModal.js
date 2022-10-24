import React, { useState } from "react";
import Loader from "../../../../components/common/Loader";
import { parchaseSms } from "../../../../features/resellerParchaseSmsApi";
import { useDispatch } from "react-redux";
import FormatNumber from "../../../../components/common/NumberFormat";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const RechargeModal = ({ status }) => {
  const { t } = useTranslation();
  // import dispatch
  const dispatch = useDispatch();

  // const authId = useSelector(
  //   (state) => state.persistedReducer.auth.currentUser.user.id
  // );
  // console.log(authId);

  //  loading local state
  const [isLoading, setIsLoading] = useState(false);

  // set sms amoun
  const [smsAmount, setSmsAmount] = useState(100);

  // // buy place status
  // const [buyStatus, setBuyStatus] = useState("ispOwner");
  // console.log(buyStatus);

  // set error value
  const [errMsg, setErrMsg] = useState("");

  // handle required
  const hadleRequired = () => {
    if (!smsAmount) {
      setErrMsg(t("smsAmount"));
    }
    if (smsAmount < 100 && smsAmount > 10000) {
      setErrMsg(t("youCanBuyMin100AndMax10000"));
    }
  };

  // form required
  const handleChange = (event) => {
    setSmsAmount(event.target.value);

    if (event.target.value >= 100 || event.target.value) {
      setErrMsg("");
    }
  };

  // sms amount calculation
  const msgPrice = smsAmount * 0.25;

  // handle submit
  const handleSubmit = (event) => {
    event.preventDefault();
    if (status.length === 0) {
      if (smsAmount >= 100 && smsAmount <= 10000) {
        const data = {
          smsAmount: smsAmount,
        };
        // console.log(data);
        parchaseSms(data, setIsLoading, dispatch);
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
                <label for="exampleInputEmail1" class="form-label">
                  {t("amount")}
                </label>
                <input
                  value={smsAmount}
                  type="number"
                  class="form-control"
                  minLength="3"
                  maxLength="5"
                  onChange={handleChange}
                  onBlur={hadleRequired}
                />

                {/* <label for="exampleInputEmail1" class="form-label">
                  {t("buyPlace")}
                </label>
                <select
                  className="form-select mt-0 me-3"
                  aria-label="Default select example"
                  onChange={(event) => setBuyStatus(event.target.value)}
                >
                  <option value="ispOwner" selected>
                    Owner
                  </option>
                  <option value="netFee">NetFee</option>
                </select> */}

                <div id="emailHelp" class="form-text text-danger">
                  {errMsg}
                </div>
              </div>
              <div className="modal-footer" style={{ border: "none" }}>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={isLoading || status.length !== 0}
                >
                  {isLoading ? <Loader /> : t("submit")}
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
