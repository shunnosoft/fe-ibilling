import { t } from "i18next";
import React from "react";
import ComponentCustomModal from "../../components/common/customModal/ComponentCustomModal";

const NoteDetailsModal = ({ show, setShow, message }) => {
  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={true}
        size="md"
        header={t("details")}
      >
        <p>{message}</p>
      </ComponentCustomModal>
    </>
  );
};

export default NoteDetailsModal;
