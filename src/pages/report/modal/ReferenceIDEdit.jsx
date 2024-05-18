import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";

// internal imports
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";
import { FtextField } from "../../../components/common/FtextField";
import { badge } from "../../../components/common/Utils";
import { informationEnBn } from "../../../components/common/tooltipInformation/informationEnBn";
import { messageReferenceIDUpdate } from "../../../features/apiCalls";
import Loader from "../../../components/common/Loader";

const ReferenceIDEdit = ({ show, setShow, message }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // customer webhook payment reference id edit function
  const handleWebhookReferenceIdEdit = (values) => {
    const sendingData = {
      reference: values?.reference,
    };

    // reference id update api
    messageReferenceIDUpdate(
      dispatch,
      sendingData,
      message?.id,
      setIsLoading,
      setShow
    );
  };
  return (
    <ComponentCustomModal
      show={show}
      setShow={setShow}
      centered={true}
      size="md"
      header={t("editReferenceID")}
      footer={
        <div>
          <button type="submit" form="messageEdit" className="btn btn-primary">
            {isLoading ? <Loader /> : t("save")}
          </button>
        </div>
      }
    >
      <Formik
        initialValues={{ reference: "" }}
        validationSchema={Yup.object({
          reference: Yup.string().required(t("required")),
        })}
        onSubmit={(values) => {
          handleWebhookReferenceIdEdit(values);
        }}
        enableReinitialize
      >
        {() => (
          <Form id="messageEdit">
            <div className="mb-3">
              <span>{badge(message?.status)}</span>
              <p>{message?.message}</p>
            </div>

            <FtextField
              label={t("refNo")}
              name="reference"
              placeholder={t("customerId")}
              info={informationEnBn()?.[3]}
            />
          </Form>
        )}
      </Formik>
    </ComponentCustomModal>
  );
};

export default ReferenceIDEdit;
