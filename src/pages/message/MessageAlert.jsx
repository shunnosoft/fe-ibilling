import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import SMSPurchase from "./SMSPurchase";

const MessageAlert = ({ sms }) => {
  const { t } = useTranslation();

  // show modal state
  const [show, setShow] = useState(false);
  const [smsPurchase, setSmsPurchase] = useState(false);

  const handleClose = () => {
    setShow(false);
  };
  const smsPurchaseHandler = () => {
    setShow(false);
    setSmsPurchase({ ...setSmsPurchase, [false]: true });
  };

  useEffect(() => {
    if (sms.smsBalance < 100) {
      setShow(true);
    }
  }, [sms]);

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("messageAlertBoard")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-danger text-center" style={{ fontSize: "2rem" }}>
            {t("purchaseSMSYouDoNotHaveEnoughSMS")}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={handleClose}>
            {t("cancel")}
          </Button>
          <Button variant="success" onClick={smsPurchaseHandler}>
            {t("buySMS")}
          </Button>
        </Modal.Footer>
      </Modal>
      <SMSPurchase smsPurchase={smsPurchase} />
    </>
  );
};

export default MessageAlert;
