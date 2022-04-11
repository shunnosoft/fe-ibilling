import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initiatePayment } from "../../../features/apiCalls";
import { hideModal } from "../../../features/uiSlice";
import Loader from "../../common/Loader";

import "./modal.css";
import { NavLink } from "react-router-dom";
import moment from "moment";
function ReactModal() {
  const [isLoading, setIsloading] = useState(false);
  const invoice = useSelector(
    (state) => state.persistedReducer?.invoice?.invoice
  );
  const dispatch = useDispatch();
  const [isAgreed, setAgreed] = useState(false);
  console.log(isAgreed);

  const alertModalData = useSelector((state) => state.ui.alertModalData);
  console.log(alertModalData);
  const modalHandle = () => {
    if (alertModalData.paymentUrl) {
      setIsloading(true);
      window.location.href = alertModalData.paymentUrl;
      setIsloading(false);
    } else {
      initiatePayment(alertModalData, setIsloading);
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
          <h1
            style={{ color: "green" }}
          >{`ফিঃ ${!alertModalData.paymentUrl?(alertModalData?.amount):(invoice?.amount)} Tk`}</h1>
          <h1 style={{ color: "orangered" }}>
            {`পরিশোধের শেষ সময়ঃ ${moment(alertModalData?.dueDate).format(
              "DD-MM-YYYY hh:mm:ss A"
            )}`}
          </h1>
        </div>
        <div className="rmbody">
          <img
            className="sslimg"
            alt="ssl"
            src="./assets/img/ssl2.png"
            height="120px"
            width="600px"
          ></img>
        </div>

        <div className="agree">
          <input
            className="agreebox"
            onChange={() => setAgreed(!isAgreed)}
            type="checkbox"
            id="vehicle1"
            name="vehicle1"
          />
          {/* <label className="agreelabel"  htmlFor="vehicle1"></label> */}
          <span>I read and agree to the </span>
          <NavLink
            target="_blank"
            style={{ margin: "1px" }}
            className={"navnew"}
            to={"/terms-conditions"}
          >
            <p className="newLink">Terms & Conditions</p>
          </NavLink>
          ,
          <NavLink
            target="_blank"
            style={{ marginRight: "5px" }}
            className={"navnew"}
            to={"/privacy-policy"}
          >
            <p className="newLink">Privacy Policy</p>
          </NavLink>
          and
          <NavLink
            target="_blank"
            style={{ marginLeft: "5px" }}
            className={"navnew"}
            to={"/return-and-refund-policy"}
          >
            <p className="newLink">Return & Refund Policy</p>
          </NavLink>
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
          <button
            disabled={!isAgreed}
            style={{ cursor: !isAgreed ? "not-allowed" : "pointer" }}
            onClick={modalHandle}
          >
            {isLoading ? <Loader></Loader> : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReactModal;
