import React from "react";
import { Modal, ModalBody, ModalHeader, ModalTitle } from "react-bootstrap";

export default function RootBulkModal({ show, setShow, header, children }) {
  //modal show handler
  const handleClose = () => {
    setShow(false);
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <ModalHeader closeButton>
          <ModalTitle>
            <h5 className="modal-title">{header}</h5>
          </ModalTitle>
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
      </Modal>
    </>
  );
}
