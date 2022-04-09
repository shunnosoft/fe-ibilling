import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import "./message.css";

import { purchaseSms } from "../../features/apiCalls";

function SmsParchase() {
  const userRole = useSelector((state) => state.persistedReducer.auth.role);
  const userData = useSelector((state) => state.persistedReducer.auth.userData);
  const [isLoading, setIsloading] = useState(false);
  console.log(userRole, userData);

  const [amount, setAmount] = useState(100);
  const [count, setCount] = useState(Number(amount) / userData.smsRate);

  const changeHandler = (sms) => {
    // if (sms * userData.smsRate < 100) return;
    setAmount(sms * userData.smsRate);
    setCount(sms);
  };

  const submitHandler = (e) => {
    console.log(amount, count);
    if (count * userData.smsRate < 100) {
      alert("দুঃখিত, ১০০ টাকার নিচে এসএমএস ক্রয় করা সম্ভব নয়।");
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
                এসএমএস পার্চেজ বোর্ড
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
                    <span className="kroymullo">ক্রয়মূল্যঃ </span>
                    <span className="price">
                      <strong> {amount} Tk</strong>
                    </span>
                  </div>

                  <div className="numsms">
                    <span className="smsspan">এসএমএস সংখ্যাঃ </span>
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
                    বাতিল করুন
                  </button>
                  <button
                    className="smsparchasebtn button1"
                    onClick={(e) => submitHandler(e)}
                  >
                    কিনুন
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
