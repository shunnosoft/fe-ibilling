import moment from "moment";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";

const MessageDetails = ({ messageData, modalStatus }) => {
  // current data state
  const [currentData, setCurrentData] = useState({});
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  useEffect(() => {
    if (modalStatus) {
      setShow(modalStatus);
    }
    if (messageData) {
      setCurrentData(messageData);
    }
  }, [modalStatus, messageData]);

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title closeButton>
            <h4
              style={{ color: "#0abb7a" }}
              className="modal-title"
              id="supportDetails"
            >
              Mobile : {currentData.mobile}
            </h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-body">
            <>
              <div className="comment-show">
                <div className="d-flex">
                  <small className="mb-3 fw-bold">
                    {moment(currentData.createdAt).format("MMM DD YYYY")}
                  </small>
                </div>
                <div className="comment-info" style={{ marginTop: "-10px" }}>
                  <i class="badge bg-primary me-1">{currentData.type}</i>
                  <i class="badge bg-success">{currentData.status}</i>
                </div>
                <p className="mt-2" style={{ textAlign: "justify" }}>
                  {currentData.message}
                </p>
              </div>
              <br />
            </>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MessageDetails;
