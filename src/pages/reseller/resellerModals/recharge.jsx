import React, { useState } from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../components/common/Loader";
import { recharge } from "../../../features/apiCalls";

import "../../message/message.css";
import { useTranslation } from "react-i18next";

function Recharge({ reseller }) {
  const { t } = useTranslation();
  // console.log(reseller);
  const rechargeRef = useRef(Number);
  const dispatch = useDispatch();
  const [isLoading, setIsloading] = useState(false);
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.userData.id
  );
  const rechargeHandler = () => {
    // window.alert("are you sure?")
    // console.log(rechargeRef.current.value)
    const data = {
      amount: parseInt(rechargeRef.current.value),
      ispOwner: ispOwnerId,
      reseller: reseller.id,
    };
    recharge(data, setIsloading, dispatch);
  };
  return (
    <>
      <div>
        <div
          className="modal fade modal-dialog-scrollable "
          id="resellerRechargeModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  {t("messageBoard")}
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
                    <div className="numsms">
                      <span className="smsspan"> {t("rechargeAmount")} </span>
                      <input
                        ref={rechargeRef}
                        className="smsinput"
                        type="number"
                        min={0}
                      />
                    </div>
                  </div>
                  <div className="smsbutton">
                    <button
                      data-bs-dismiss="modal"
                      className="smsparchasebtn button2"
                    >
                      {t("cancle")}
                    </button>
                    <button
                      className="smsparchasebtn button1"
                      onClick={rechargeHandler}
                    >
                      {isLoading ? <Loader></Loader> : t("recharge")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Recharge;
