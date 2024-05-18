import React, { useState } from "react";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";
import { useTranslation } from "react-i18next";
import { Form, Formik } from "formik";
import { FtextField } from "../../../components/common/FtextField";
import * as Yup from "yup";
import { badge } from "../../../components/common/Utils";
import { informationEnBn } from "../../../components/common/tooltipInformation/informationEnBn";
import { messageReferenceIDUpdate } from "../../../features/apiCalls";
import { useDispatch } from "react-redux";

const ReferenceIDEdit = ({ show, setShow, message }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  // customer webhook payment reference id edit function
  const handleWebhookReferenceIdEdit = (values) => {
    const sendingData = {
      reference: values?.reference,
    };
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
            {t("save")}
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
