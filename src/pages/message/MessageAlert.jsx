import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import SMSPurchase from "./SMSPurchase";
import { getAllCustomerCount } from "../../features/apiCalls";

const MessageAlert = ({ ispOwner }) => {
  const { t } = useTranslation();

  // show modal state
  const [show, setShow] = useState(false);
  const [smsPurchase, setSmsPurchase] = useState(false);

  // ispOwner customer state
  const [customerCount, setCustomerCount] = useState();

  const handleClose = () => {
    setShow(false);
  };
  const smsPurchaseHandler = () => {
    setShow(false);
    setSmsPurchase({ ...setSmsPurchase, [false]: true });
  };

  useEffect(() => {
    if (
      ispOwner?.smsBalance +
        ispOwner?.fixedNumberSmsBalance +
        ispOwner?.maskingSmsBalance <
      (customerCount?.customersCount * 50) / 100
    ) {
      setShow(true);
    }
  }, [customerCount]);

  useEffect(() => {
    if (ispOwner) {
      getAllCustomerCount(ispOwner.id, setCustomerCount);
    }
  }, [ispOwner]);

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <h5 className="text-warning fs-4">{t("messageBoardAlert")}</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-primary text-center" style={{ fontSize: "2rem" }}>
            {t("youDoNotHaveEnoughSMSBalance")}{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="currentColor"
              class="bi bi-exclamation-triangle text-danger mb-2 ms-1"
              viewBox="0 0 16 16"
            >
              <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z" />
              <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z" />
            </svg>
          </p>

          <div className="shadow-lg p-3 mb-5 bg-body rounded my-3">
            <div className="text-center mt-2">
              <small className="text-secondary fs-5 me-3">
                {t("messageBalance")}
              </small>
              <h3 className="text-danger">
                {ispOwner?.smsBalance +
                  ispOwner?.fixedNumberSmsBalance +
                  ispOwner?.maskingSmsBalance}
              </h3>
            </div>
          </div>
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
