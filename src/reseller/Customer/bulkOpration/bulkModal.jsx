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
          <ModalTitle>{header}</ModalTitle>
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
      </Modal>
    </>
  );
}
