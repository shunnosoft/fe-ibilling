import moment from "moment";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const MessageDetails = ({ messageId, status }) => {
  const [show, setShow] = useState(false);

  const { t } = useTranslation();

  let message = useSelector((state) =>
    status === "fixedNumberMessage"
      ? state?.messageLog?.fixedNumber
      : status === "maskingNumberMessage"
      ? state?.messageLog?.masking
      : status === "nonMaskingMessage"
      ? state?.messageLog?.messageLog
      : ""
  );

  let findMessage = message.find((item) => item._id === messageId);

  const handleClose = () => setShow(false);

  useEffect(() => {
    if (findMessage) {
      setShow(true);
    }
  }, [findMessage, messageId]);

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
            <h5 className="modal-title" id="messageDetailsLog">
              {t("messageDetails")}
            </h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4 style={{ color: "#0abb7a" }} className="modal-title">
            {findMessage?.mobile}
          </h4>
          <>
            <div className="comment-show">
              <div className="d-flex">
                <small className="mb-3">
                  {moment(findMessage?.createdAt).format("MMM DD YYYY")}
                </small>
              </div>
              <div className="comment-info" style={{ marginTop: "-10px" }}>
                <i class="badge bg-primary me-1">{findMessage?.type}</i>
                <i class="badge bg-info">{findMessage?.status}</i>
              </div>
              <p className="mt-2" style={{ textAlign: "justify" }}>
                {findMessage?.message}
              </p>
            </div>
            <br />
          </>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MessageDetails;
