import React from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";
import { badge } from "../Utils";

const ComponentCustomModal = ({
  show,
  setShow,
  centered,
  size,
  header,
  status,
  paymentStatus,
  printr,
  children,
  footer,
}) => {
  // modal close handler
  const handleClose = () => setShow(false);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      centered={centered}
      size={size}
    >
      <ModalHeader closeButton>
        <ModalTitle>
          <div className="d-flex gap-2">
            <p>{header}</p>
            <div>{printr && printr}</div>
            <small>{badge(status)}</small>
            <small>{badge(paymentStatus)}</small>
          </div>
        </ModalTitle>
      </ModalHeader>
      <ModalBody>{children}</ModalBody>
      {footer && <ModalFooter>{footer}</ModalFooter>}
    </Modal>
  );
};

export default ComponentCustomModal;
