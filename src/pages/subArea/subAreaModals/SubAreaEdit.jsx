import React, { useState } from "react";
import * as Yup from "yup";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { editSubArea } from "../../../features/apiCalls";
import { useDispatch } from "react-redux";
import { Form, Formik } from "formik";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";

const SubAreaEdit = ({
  subAreaID,
  subAreaName,
  ispId,
  editShow,
  setEditShow,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  //Loading state
  const [isLoading, setIsLoading] = useState(false);

  //subArea edit validator
  const linemanValidator = Yup.object({
    name: Yup.string().required(t("enterName")),
  });

  //modal show handler
  const handleClose = () => {
    setEditShow(false);
  };

  // Edit subarea
  const subAreaEditHandler = async (data) => {
    setIsLoading(true);
    const IDs = {
      ispOwnerID: ispId,
      ispOwner: ispId,
      id: subAreaID,
      name: data.name,
    };
    editSubArea(dispatch, IDs, setIsLoading, setEditShow);
  };

  return (
    <Modal
      show={editShow}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <ModalHeader closeButton>
        <ModalTitle>{t("editSubArea")}</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <Formik
          initialValues={{
            name: subAreaName || "",
          }}
          validationSchema={linemanValidator}
          onSubmit={(values) => {
            subAreaEditHandler(values);
          }}
          enableReinitialize
        >
          {() => (
            <Form id="subAreaEdit">
              <FtextField type="text" label={t("subAreaName")} name="name" />
            </Form>
          )}
        </Formik>
      </ModalBody>
      <ModalFooter>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleClose}
          disabled={isLoading}
        >
          {t("cancel")}
        </button>
        <button
          type="submit"
          form="subAreaEdit"
          className="btn btn-success customBtn"
          disabled={isLoading}
        >
          {isLoading ? <Loader /> : t("save")}
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default SubAreaEdit;
