import React, { useEffect, useState } from "react";
import ComponentCustomModal from "../../components/common/customModal/ComponentCustomModal";
import { useTranslation } from "react-i18next";
import { Form, Formik } from "formik";
import { FtextField } from "../../components/common/FtextField";
import * as Yup from "yup";
import Loader from "../../components/common/Loader";
import { createOLT, updateOLT } from "../../features/oltApi";
import useISPowner from "../../hooks/useISPOwner";
import { useDispatch } from "react-redux";

const DEFAULT_VALUE = {
  oltVendor: "",
  name: "",
  ponPort: 1,
  username: "",
  password: "",
  host: "",
  port: null,
};

const OLTDialog = ({ show, setShow, isUpdate, oltInformation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get user & current user data form useISPOwner
  const { ispOwnerId, bpSettings } = useISPowner();

  //---> OLT Form Data Validation Schema
  const oltValidator = Yup.object({
    oltVendor: Yup.string().required(t("enterOltVendor")),
    name: Yup.string().required(t("enterOltName")),
    ponPort: Yup.number(),
    username: Yup.string().required(t("enterUsername")),
    password: Yup.string().required(t("enterPassword")),
    host: Yup.string().required(t("enterHost")),
    port: Yup.number().required(t("enterPort")),
  });

  //---> Local State
  const [defaultValues, setDefaultValue] = useState(DEFAULT_VALUE);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setDefaultValue({
      ...defaultValues,
      ...oltInformation,
    });
  }, [oltInformation]);

  const inputOptions = [
    {
      name: "oltVendor",
      as: "select",
      type: "select",
      id: "oltVendor",
      isVisible: true,
      disabled: false,
      validation: true,
      label: t("selectOLTVendor"),
      firstOptions: t("selectOLTVendor"),
      textAccessor: "label",
      valueAccessor: "value",
      options: [
        {
          label: "Vsol",
          value: "vsol",
        },
        {
          label: "CData",
          value: "cdata",
        },
      ],
    },
    {
      name: "name",
      type: "text",
      id: "name",
      isVisible: true,
      disabled: false,
      validation: true,
      label: t("name"),
    },
    {
      name: "ponPort",
      type: "number",
      id: "ponPort",
      isVisible: true,
      disabled: false,
      validation: true,
      label: t("ponPort"),
    },
    {
      name: "username",
      type: "number",
      id: "username",
      isVisible: true,
      disabled: false,
      validation: true,
      label: t("oltUserName"),
    },
    {
      name: "password",
      type: "text",
      id: "password",
      isVisible: true,
      disabled: false,
      validation: true,
      label: t("oltUserPassword"),
    },
    {
      name: "host",
      type: "text",
      id: "host",
      isVisible: true,
      disabled: false,
      validation: true,
      label: t("oltIp"),
    },
    {
      name: "port",
      type: "number",
      id: "port",
      isVisible: true,
      disabled: false,
      validation: true,
      label: t("oltPort"),
    },
  ];

  const handleOLTFormDataSubmit = (formValues) => {
    const sendingData = {
      ...formValues,
      ispOwner: ispOwnerId,
    };

    if (isUpdate) {
      updateOLT(ispOwnerId, sendingData, setIsLoading, dispatch, setShow);
    } else {
      createOLT(sendingData, setIsLoading, dispatch, setShow);
    }
  };

  return (
    <ComponentCustomModal
      show={show}
      setShow={setShow}
      centered={true}
      size="md"
      header={t("createOLT")}
    >
      <Formik
        initialValues={defaultValues}
        validationSchema={oltValidator}
        onSubmit={(values) => {
          handleOLTFormDataSubmit(values);
        }}
        enableReinitialize
      >
        {() => (
          <Form>
            <div className="displayGrid">
              {inputOptions.map(
                (item) => item?.isVisible && <FtextField {...item} />
              )}
            </div>

            <div className="displayGrid1 float-end mt-4">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShow(false)}
              >
                {t("cancel")}
              </button>
              <button type="submit" className="btn btn-success">
                {isLoading ? <Loader /> : t("submit")}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </ComponentCustomModal>
  );
};

export default OLTDialog;
