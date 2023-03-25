import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Loader from "../../components/common/Loader";
import { purchaseSms } from "../../features/apiCalls";

const SMSPurchase = ({ show, smsPurchase }) => {
  const { t } = useTranslation();

  // modal onHide true or false state
  const [showIf, setShowIf] = useState(false);

  // modal close handler
  const handleClose = () => setShowIf(false);

  const userRole = useSelector((state) => state.persistedReducer.auth.role);
  const userData = useSelector((state) => state.persistedReducer.auth.userData);
  const [isLoading, setIsloading] = useState(false);

  const [amount, setAmount] = useState(100);

  const [count, setCount] = useState(Number(amount) / userData.smsRate);
  const [messageType, setMessageType] = useState(
    "nonMasking" || "masking" || "fixedNumber"
  );

  const changeHandler = (numOfSms) => {
    if (messageType === "nonMasking") {
      setAmount(userData.smsRate * numOfSms);
    } else if (messageType === "masking") {
      setAmount(userData.maskingSmsRate * numOfSms);
    } else if (messageType === "fixedNumber") {
      setAmount(userData.fixedNumberSmsRate * numOfSms);
    }

    setCount(numOfSms);
  };

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
    //modal onHide
    if (show) {
      setShowIf(show);
    }
    if (smsPurchase) {
      setShowIf(smsPurchase);
    }

    // message purchase
    if (messageType === "nonMasking") {
      setAmount(userData.smsRate * count);
    } else if (messageType === "masking") {
      setAmount(userData.maskingSmsRate * count);
    } else if (messageType === "fixedNumber") {
      setAmount(userData.fixedNumberSmsRate * count);
    }
  }, [show, smsPurchase, messageType]);

  return (
    <Modal
      show={showIf}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title> {t("smsPurchageBoard")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="text-center">
            <span className="fw-bold"> {t("purchagePrice")} </span>
            <span className="price">
              <strong> {Math.ceil(amount)} Tk</strong>
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
