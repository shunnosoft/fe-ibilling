import { Formik, Form } from "formik";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { editSubArea } from "../../../features/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";

const SubAreaEditModal = ({ isOpen, subAreaName, subAreaID }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get ispOwner Id
  const ownerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  const subAreaValidation = Yup.object({
    name: Yup.string().required(t("enterName")),
  });

  // Edit subarea
  const subAreaEditHandler = (values) => {
    const IDs = {
      ispOwnerID: ownerId,
      id: subAreaID,
      name: values.name,
    };
    editSubArea(dispatch, IDs, setIsLoading, setShow);
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  useEffect(() => {
    setShow(isOpen);
  }, [isOpen]);

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <ModalHeader closeButton>
        <ModalTitle>
          <h5 className="modal-title" id="exampleModalLabel">
            {t("editSubArea")}
          </h5>
        </ModalTitle>
      </ModalHeader>
      <ModalBody>
        <Formik
          initialValues={{
            name: subAreaName || "",
          }}
          validationSchema={subAreaValidation}
          onSubmit={(values) => {
            subAreaEditHandler(values);
          }}
          enableReinitialize
        >
          {() => (
            <Form id="subArea">
              <FtextField type="text" label={t("subAreaName")} name="name" />
            </Form>
          )}
        </Formik>
      </ModalBody>
      <ModalFooter>
        <button onClick={handleClose} className="btn btn-secondary customBtn">
          {t("cancel")}
        </button>
        <button
          type="submit"
          form="subArea"
          className="btn btn-success customBtn"
          disabled={isLoading}
        >
          {isLoading ? <Loader /> : t("save")}
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default SubAreaEditModal;
