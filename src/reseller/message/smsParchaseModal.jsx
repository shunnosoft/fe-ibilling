import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import "./message.css";

import { purchaseSms } from "../../features/apiCalls";
import { useTranslation } from "react-i18next";

function SmsParchase() {
  const { t } = useTranslation();
  const userRole = useSelector((state) => state.persistedReducer.auth.role);
  const userData = useSelector((state) => state.persistedReducer.auth.userData);
  console.log(userData);
  const [isLoading, setIsloading] = useState(false);
  // console.log(userRole, userData);

  const [amount, setAmount] = useState(100);
  const [count, setCount] = useState(Number(amount) / userData.smsRate);

  const changeHandler = (sms) => {
    setAmount(sms * userData.smsRate);
    setCount(sms);
  };

  const submitHandler = (e) => {
    if (count < 400) {
      alert(t("unsuccessSMSalertPurchageModal"));
    } else {
      let data = {
        amount,
        numberOfSms: Number.parseInt(count),
        ispOwner: userData.id,
        user: userData.user,
        type: "smsPurchase",
      };

      purchaseSms(data, setIsloading);
    }
  };

  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="smsparchase"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {t("smsPurchageBoard")}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="smsPerchase">
                <div className="smsbuy">
                  <div className="amountsms">
                    <span className="kroymullo"> {t("purchagePrice")} </span>
                    <span className="price">
                      <strong> {amount} Tk</strong>
                    </span>
                  </div>

                  <div className="numsms">
                    <span className="smsspan"> {t("sms")} </span>
                    <input
                      onChange={(e) => changeHandler(e.target.value)}
                      className="smsinput"
                      type="number"
                      value={count}
                      min={250}
                    />
                  </div>
                </div>
                <div className="smsbutton">
                  <button
                    data-bs-dismiss="modal"
                    className="smsparchasebtn button2"
                  >
                    {t("cancel")}
                  </button>
                  <button
                    className="smsparchasebtn button1"
                    onClick={(e) => submitHandler(e)}
                  >
                    {t("buySMS")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SmsParchase;
