import React, { useEffect, useState } from "react";
import ComponentCustomModal from "../../components/common/customModal/ComponentCustomModal";
import { useTranslation } from "react-i18next";
import { Form, Formik } from "formik";
import { FtextField } from "../../components/common/FtextField";
import * as Yup from "yup";
import Loader from "../../components/common/Loader";
import { createOLT, updateOLT } from "../../features/oltApi";
import useISPowner from "../../hooks/useISPOwner";
import { useDispatch, useSelector } from "react-redux";

const DEFAULT_VALUE = {
  mikrotik: "",
  oltVendor: "",
  name: "",
  ponPort: "",
  username: "",
  password: "",
  host: "",
  port: "",
};

const OLTDialog = ({ show, setShow, isUpdate, oltInformation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  //---> Get user & current user data form useISPOwner hooks
  const { ispOwnerId, bpSettings } = useISPowner();

  //---> OLT Form Data Validation Schema
  const oltValidator = Yup.object({
    mikrotik: Yup.string().required(t("mikrotik") + " " + t("requiredField")),
    oltVendor: Yup.string().required(t("oltVendor") + " " + t("requiredField")),
    name: Yup.string().required(t("name") + " " + t("requiredField")),
    ponPort: Yup.number()
      .transform((value, originalValue) => {
        return originalValue === "" ? undefined : Number(originalValue);
      })
      .max(32, `${t("ponPort")} ${t("mustLessThanEqual")} 32`)
      .when("oltVendor", {
        is: "cdata",
        then: (schema) =>
          schema.required(
            `${t("ponPort")} ${t("requiredField")} ${t("mustLessThanEqual")} 32`
          ),
        otherwise: (schema) => schema.notRequired(),
      }),
    username: Yup.string().required(t("userName") + " " + t("requiredField")),
    password: Yup.string().required(t("password") + " " + t("requiredField")),
    host: Yup.string().required(t("ip") + " " + t("requiredField")),
    port: Yup.number().required(t("port") + " " + t("requiredField")),
  });

  //---> Get ispOwner mikrotik from redux store
  const mikrotiks = useSelector((state) => state?.mikrotik?.mikrotik);

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
      name: "mikrotik",
      as: "select",
      type: "select",
      id: "mikrotik",
      isVisible: true,
      disabled: false,
      validation: true,
      label: t("selectMikrotik"),
      firstOptions: t("selectMikrotik"),
      textAccessor: "name",
      valueAccessor: "id",
      options: mikrotiks,
    },
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
          label: "V.Sole EPon",
          value: "vSole_ePon",
        },
        {
          label: "V.Sole GPon",
          value: "vSole_gPon",
        },
        {
          label: "CData",
          value: "cData",
        },
        {
          label: "BDCom EPon",
          value: "bdCom_ePon",
        },
        {
          label: "BDCom GPon",
          value: "bdCom_gPon",
        },
        {
          label: "ECom",
          value: "eCom",
        },
        {
          label: "DBC GPon",
          value: "dbc_gPon",
        },
        {
          label: "Aveis EPon",
          value: "aveis_ePon",
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
      as: "select",
      type: "select",
      id: "ponPort",
      isVisible: true,
      disabled: false,
      validation: true,
      label: t("ponPort"),
      firstOptions: t("selectPonPort"),
      textAccessor: "label",
      valueAccessor: "value",
      options: [
        {
          label: "2",
          value: "2",
        },
        {
          label: "4",
          value: "4",
        },
        {
          label: "8",
          value: "8",
        },
        {
          label: "16",
          value: "16",
        },
        {
          label: "32",
          value: "32",
        },
      ],
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
