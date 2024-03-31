import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

// custom hooks
import useISPowner from "../../hooks/useISPOwner";

// internal imports
import Loader from "../../components/common/Loader";
import { purchaseSms } from "../../features/apiCalls";
import ComponentCustomModal from "../../components/common/customModal/ComponentCustomModal";
import {
  getParchaseHistory,
  purchaseSMS,
} from "../../features/resellerParchaseSmsApi";
import { Card } from "react-bootstrap";

const SMSPurchase = ({ show, setShow }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get user & current user data form useISPOwner hook
  const { role, ispOwnerData, userData } = useISPowner();

  // get reseller sms purchase history
  const data = useSelector((state) => state?.smsHistory?.smsParchase);

  // get accept status
  const invoiceStatus = data.filter((item) => item.status === "pending");

  //user Data
  const user = role === "manager" ? ispOwnerData : userData;

  // loading state
  const [isLoading, setIsloading] = useState(false);

  // sms purchase amount
  const [amount, setAmount] = useState(120);

  // sms purchase count
  const [count, setCount] = useState(Number(amount) / user.smsRate);

  // buy place status
  const [buyStatus, setBuyStatus] = useState("netFee");

  // sms purchase message type
  const [messageType, setMessageType] = useState(
    "nonMasking" || "masking" || "fixedNumber"
  );

  // get api clled function
  useEffect(() => {
    role === "reseller" &&
      getParchaseHistory(userData.id, dispatch, setIsloading);
  }, [role]);

  //SMS count function
  const changeHandler = (numOfSms) => {
    if (messageType === "nonMasking") {
      setAmount(Math.ceil(user.smsRate * numOfSms));
    } else if (messageType === "masking") {
      setAmount(Math.ceil(user.maskingSmsRate * numOfSms));
    } else if (messageType === "fixedNumber") {
      setAmount(Math.ceil(user.fixedNumberSmsRate * numOfSms));
    }

    // set purchase sms count
    setCount(numOfSms);
  };

  //Money count function
  const tkHandler = (money) => {
    money = Math.ceil(money);
    if (messageType === "nonMasking") {
      setCount(Math.ceil(money / user.smsRate));
    } else if (messageType === "masking") {
      setCount(Math.ceil(money / user.maskingSmsRate));
    } else if (messageType === "fixedNumber") {
      setCount(Math.ceil(money / user.fixedNumberSmsRate));
    }

    // set purchase sms amount
    setAmount(money);
  };

  //form submit handler
  const submitHandler = () => {
    if (count < 400) {
      toast.error(t("unsuccessSMSalertPurchageModal"));
    } else {
      if (
        ["ispOwner", "manager"].includes(role) ||
        (role === "reseller" && buyStatus === "netFee")
      ) {
        const sendData = {
          amount: Math.ceil(amount),
          numberOfSms: Number.parseInt(count),
          ispOwner: user.id,
          user: user.user,
          type: "smsPurchase",
          smsPurchaseType: messageType,
        };

        // id for role based
        if (role === "reseller") {
          delete sendData.ispOwner;
          sendData.reseller = userData.id;
        }

        // netfee sms purchase api call
        purchaseSms(sendData, setIsloading, dispatch, setShow);
      } else {
        if (invoiceStatus.length === 0) {
          const sendData = {
            smsAmount: Number.parseInt(count),
            smsParchaseType: messageType,
          };

          // andmin sms purchase api call
          purchaseSMS(sendData, setIsloading, dispatch, setShow);
        } else {
          toast.error(t("statusCannotBePending"));
        }
      }
    }
  };

  // set sms purchase amount and count on message type
  useEffect(() => {
    // message purchase
    if (messageType === "nonMasking") {
      setAmount(Math.ceil(user.smsRate * count));
    } else if (messageType === "masking") {
      setAmount(Math.ceil(user.maskingSmsRate * count));
    } else if (messageType === "fixedNumber") {
      setAmount(Math.ceil(user.fixedNumberSmsRate * count));
    }
  }, [messageType]);

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        header={t("smsPurchageBoard")}
        centered={true}
        size="md"
        footer={
          <div className="displayGrid1 float-end">
            <button
              className="btn btn-secondary"
              onClick={() => setShow(false)}
            >
              {t("cancel")}
            </button>
            <button className="btn btn-success" onClick={submitHandler}>
              {isLoading ? <Loader /> : t("buySMS")}
            </button>
          </div>
        }
      >
        <div className="container">
          {/* <div className="shadow border p-1 mb-5 bg-white rounded position-relative">
            <span className="position-absolute end-0 badge bg-primary text-white">
              {t("myOffer")}
            </span>

            <div className="my-4">
              <div className="d-flex justify-content-between">
                <div className="d-flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    fill="currentColor"
                    className="ms-3 mt-2 bi bi-gift text-primary"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3 2.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0v.006c0 .07 0 .27-.038.494H15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 14.5V7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.038A2.968 2.968 0 0 1 3 2.506V2.5zm1.068.5H7v-.5a1.5 1.5 0 1 0-3 0c0 .085.002.274.045.43a.522.522 0 0 0 .023.07zM9 3h2.932a.56.56 0 0 0 .023-.07c.043-.156.045-.345.045-.43a1.5 1.5 0 0 0-3 0V3zM1 4v2h6V4H1zm8 0v2h6V4H9zm5 3H9v8h4.5a.5.5 0 0 0 .5-.5V7zm-7 8V7H2v7.5a.5.5 0 0 0 .5.5H7z" />
                  </svg>

                  <div className="d-flex flex-column justify-content-start align-items-start ms-2">
                    <p
                      style={{
                        fontSize: "17px",
                        fontWeight: "bold",
                        fontFamily: "sans-serif",
                      }}
                    >
                      {localStorage.getItem("netFee:lang") === "en"
                        ? "10,000 SMS (+1000 SMS Bonus)"
                        : "১০,০০০ এসএমএস (+১০০০ এসএমএস বোনাস)"}
                    </p>

                    <small>{t("smsBonus")}</small>
                  </div>
                </div>

                <p
                  className="d-flex justify-content-end align-self-end me-3"
                  style={{
                    fontSize: "17px",
                    fontWeight: "bold",
                    fontFamily: "sans-serif",
                    textAlign: "end",
                  }}
                >
                  ৳
                  {localStorage.getItem("netFee:lang") === "en"
                    ? "3000"
                    : "৩০০০"}
                </p>
              </div>
            </div>
          </div> */}

          <div className="displayGrid3 clintTitle p-2 mb-3">
            <div>
              <label className="form-control-label">{t("nonMasking")}</label>
              <span
                className={`text-${
                  user.smsBalance >= 0 ? "success" : "danger"
                } fw-bold`}
              >
                {user.smsBalance}
              </span>
            </div>
            <div>
              <label className="form-control-label">{t("masking")}</label>
              <span
                className={`text-${
                  user.maskingSmsBalance >= 0 ? "success" : "danger"
                } fw-bold`}
              >
                {user.maskingSmsBalance}
              </span>
            </div>
            <div>
              <label className="form-control-label">{t("fixedNumber")}</label>
              <span
                className={`text-${
                  user.fixedNumberSmsBalance >= 0 ? "success" : "danger"
                } fw-bold`}
              >
                {user.fixedNumberSmsBalance}
              </span>
            </div>
          </div>

          <Card className="bg-light">
            <Card.Body>
              <Card.Text>
                <div className="monthlyBill text-center">
                  <span className="fw-bold"> {t("purchagePrice")} </span>
                  <span className="price">
                    <strong>৳{Math.ceil(amount)}</strong>
                  </span>
                </div>

                <form className="displayGrid">
                  <div>
                    <label class="form-control-label text-secondary">
                      {t("smsType")}&nbsp;
                      <span className="text-danger">*</span>
                    </label>

                    <select
                      className="form-select mw-100 mt-0 bg-white"
                      onChange={(e) => setMessageType(e.target.value)}
                    >
                      <option selected value="nonMasking">
                        {t("nonMasking")}
                      </option>
                      <option value="masking">{t("masking")}</option>
                      <option value="fixedNumber">{t("fixedNumber")}</option>
                    </select>
                  </div>

                  <div>
                    <label class="form-control-label text-secondary">
                      {t("SMS") + " " + t("count")}&nbsp;
                      <span className="text-danger">*</span>
                    </label>

                    <input
                      onChange={(e) => changeHandler(e.target.value)}
                      className="form-control bg-white"
                      type="number"
                      value={count}
                      min={250}
                    />
                  </div>

                  <div>
                    <label className="form-control-label text-secondary">
                      {t("smsAmunt")}&nbsp;
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      onChange={(e) => tkHandler(e.target.value)}
                      className="form-control bg-white"
                      type="number"
                      value={amount && amount}
                      min={100}
                    />
                  </div>

                  {role === "reseller" && (
                    <div>
                      <label className="form-control-label text-secondary">
                        {t("selectPlace")}&nbsp;
                        <span className="text-danger">*</span>
                      </label>

                      <select
                        className="form-select mw-100 mt-0 bg-white"
                        onChange={(e) => setBuyStatus(e.target.value)}
                      >
                        <option value="netFee" selected>
                          NetFee
                        </option>
                        <option value="ispOwner">Isp Owner</option>
                      </select>
                    </div>
                  )}
                </form>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </ComponentCustomModal>
    </>
  );
};

export default SMSPurchase;
