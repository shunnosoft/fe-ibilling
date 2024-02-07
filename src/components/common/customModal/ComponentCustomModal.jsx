import React from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";

const ComponentCustomModal = ({
  show,
  setShow,
  centered,
  size,
  header,
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
          <div className="d-flex">
            <h5 className="modal-title">{header}</h5>
            <div className="ms-2">{printr && printr}</div>
          </div>
        </ModalTitle>
      </ModalHeader>
      <ModalBody>{children}</ModalBody>
      <ModalFooter>{footer}</ModalFooter>
    </Modal>
  );
};

export default ComponentCustomModal;
