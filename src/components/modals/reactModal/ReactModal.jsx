import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initiatePayment } from "../../../features/apiCalls";
import { hideModal } from "../../../features/uiSlice";
import "./modal.css";

function ReactModal() {
  const dispatch = useDispatch();
  const [isAgreed,setAgreed] = useState(false)
  console.log(isAgreed)

  const alertModalData = useSelector((state) => state.ui.alertModalData);
  console.log(alertModalData);
  const modalHandle = () => {
    if (alertModalData.paymentUrl) {
      window.location.href = alertModalData.paymentUrl;
    } else {
      initiatePayment(alertModalData);
    }
  };
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button
            onClick={() => {
              console.log("hide");
              dispatch(hideModal());
            }}
          >
            X
          </button>
        </div>
        <div className="title">
          <h1>Are You Sure You Want to Continue?</h1>
        </div>
        <div className="body">
          <p>The next page looks amazing. Hope you want to go there!</p>
        </div>

        <div className="agree">
          <input className="agreebox" onChange={() => setAgreed(!isAgreed)} type="checkbox" id="vehicle1" name="vehicle1"/>
          <label  htmlFor="vehicle1"> I agree with the terms and conditions</label>
        </div>

        <div className="footer">
          <button
            onClick={() => {
              dispatch(hideModal());
            }}
            id="cancelBtn"
          >
            Cancel
          </button>
          <button disabled={!isAgreed} style={{ cursor: !isAgreed? "not-allowed":"pointer"   }} onClick={modalHandle}>Continue</button>
        </div>
      </div>
    </div>
  );
}

export default ReactModal;
