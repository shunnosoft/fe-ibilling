import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Loader from "../../components/common/Loader";
import { purchaseSms } from "../../features/apiCalls";

const SMSPurchase = ({ show, setShow }) => {
  const { t } = useTranslation();

  // modal close handler
  const handleClose = () => setShow(false);

  //user role
  const userRole = useSelector((state) => state.persistedReducer.auth.role);

  //user Data
  const userData = useSelector((state) =>
    userRole === "manager"
      ? state.persistedReducer.auth.ispOwnerData
      : state.persistedReducer.auth.userData
  );

  //states
  const [isLoading, setIsloading] = useState(false);

  const [amount, setAmount] = useState(100);

  const [count, setCount] = useState(Number(amount) / userData.smsRate);

  const [messageType, setMessageType] = useState(
    "nonMasking" || "masking" || "fixedNumber"
  );

  //SMS count function
  const changeHandler = (numOfSms) => {
    if (messageType === "nonMasking") {
      setAmount(Math.ceil(userData.smsRate * numOfSms));
    } else if (messageType === "masking") {
      setAmount(Math.ceil(userData.maskingSmsRate * numOfSms));
    } else if (messageType === "fixedNumber") {
      setAmount(Math.ceil(userData.fixedNumberSmsRate * numOfSms));
    }

    setCount(numOfSms);
  };

  //Money count function
  const tkHandler = (money) => {
    money = Math.ceil(money);
    if (messageType === "nonMasking") {
      setCount(money / userData.smsRate);
    } else if (messageType === "masking") {
      setCount(money / userData.maskingSmsRate);
    } else if (messageType === "fixedNumber") {
      setCount(money / userData.fixedNumberSmsRate);
    }

    setAmount(money);
  };

  //form submit handler
  const submitHandler = (e) => {
    if (count * userData.smsRate < 100) {
      alert(t("unsuccessSMSalertPurchageModal"));
    } else {
      let data = {
        amount: Math.ceil(amount),
        numberOfSms: Number.parseInt(count),
        ispOwner: userData.id,
        user: userData.user,
        type: "smsPurchase",
        smsPurchaseType: messageType,
      };

      purchaseSms(data, setIsloading);
    }
  };

  useEffect(() => {
    // message purchase
    if (messageType === "nonMasking") {
      setAmount(Math.ceil(userData.smsRate * count));
    } else if (messageType === "masking") {
      setAmount(Math.ceil(userData.maskingSmsRate * count));
    } else if (messageType === "fixedNumber") {
      setAmount(Math.ceil(userData.fixedNumberSmsRate * count));
    }
  }, [messageType]);

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title> {t("smsPurchageBoard")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="shadow border p-1 mb-5 bg-white rounded position-relative">
            <span className="position-absolute end-0 badge bg-primary text-white">
              {t("myOffer")}
            </span>

            <div className="my-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                fill="currentColor"
                className="ms-3 bi bi-gift text-primary"
                viewBox="0 0 16 16"
              >
                <path d="M3 2.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0v.006c0 .07 0 .27-.038.494H15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 14.5V7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.038A2.968 2.968 0 0 1 3 2.506V2.5zm1.068.5H7v-.5a1.5 1.5 0 1 0-3 0c0 .085.002.274.045.43a.522.522 0 0 0 .023.07zM9 3h2.932a.56.56 0 0 0 .023-.07c.043-.156.045-.345.045-.43a1.5 1.5 0 0 0-3 0V3zM1 4v2h6V4H1zm8 0v2h6V4H9zm5 3H9v8h4.5a.5.5 0 0 0 .5-.5V7zm-7 8V7H2v7.5a.5.5 0 0 0 .5.5H7z" />
              </svg>
              <span
                style={{
                  marginLeft: "1rem",
                  fontSize: "17px",
                  fontWeight: "bold",
                  fontFamily: "sans-serif",
                }}
              >
                {localStorage.getItem("netFee:lang") === "en"
                  ? "8000 SMS (+1000 SMS Bonus)"
                  : "৮০০০ এসএমএস (+১০০০ এসএমএস বোনাস)"}
              </span>

              <p
                style={{
                  marginRight: "1rem",
                  fontSize: "17px",
                  fontWeight: "bold",
                  fontFamily: "sans-serif",
                  textAlign: "end",
                }}
              >
                ৳
                {localStorage.getItem("netFee:lang") === "en" ? "2000" : "২০০০"}
              </p>
            </div>
          </div>
          <div className="text-center">
            <span className="fw-bold"> {t("purchagePrice")} </span>
            <span className="price">
              <strong>৳{Math.ceil(amount)}</strong>
            </span>
          </div>

          <form>
            <div className="form-group ">
              <label> {t("smsType")} </label>
              <select
                className="form-select mw-100 mt-0"
                onChange={(e) => setMessageType(e.target.value)}
              >
                <option selected value="nonMasking">
                  {t("nonMasking")}
                </option>
                <option value="masking">{t("masking")}</option>
                <option value="fixedNumber">{t("fixedNumber")}</option>
              </select>
            </div>

            <div className="form-group mt-3">
              <label> {t("sms")} </label>
              <input
                onChange={(e) => changeHandler(e.target.value)}
                className="form-control"
                type="number"
                value={count}
                min={250}
              />
            </div>

            <div className="form-group mt-3">
              <label> {t("tk")} </label>
              <input
                onChange={(e) => tkHandler(e.target.value)}
                className="form-control"
                type="number"
                value={amount ? amount : ""}
                min={63}
              />
            </div>
          </form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleClose}>
          {t("cancel")}
        </Button>
        <Button variant="success" onClick={(e) => submitHandler(e)}>
          {isLoading ? <Loader /> : t("buySMS")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SMSPurchase;
