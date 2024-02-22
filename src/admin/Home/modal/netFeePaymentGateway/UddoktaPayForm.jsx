import { Form, Formik, Field } from "formik";
import React from "react";
import * as Yup from "yup";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

// internal import
import { FtextField } from "../../../../components/common/FtextField";
import Loader from "../../../../components/common/Loader";
import { updateOwner } from "../../../../features/apiCallAdmin";

const UddoktaPayForm = ({ setShow, ispOwner }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  //  loading local state
  const [isLoading, setIsLoading] = useState(false);

  // initial values for form
  let initialValues = {
    apiKey: "",
    apiUrl: "",
    hasPG: true,
  };

  if (ispOwner) {
    const paymentGateway = ispOwner?.bpSettings?.paymentGateway;
    if (paymentGateway?.uddoktapay) {
      initialValues = {
        apiKey: paymentGateway?.uddoktapay?.apiKey,
        apiUrl: paymentGateway?.uddoktapay?.apiUrl,
      };
    }

    if (paymentGateway)
      initialValues = { ...initialValues, hasPG: ispOwner?.bpSettings?.hasPG };
  }

  const ispuddoktaPayValidator = Yup.object({
    apiKey: Yup.string().required(t("fieldCannotBeBlank")),
    apiUrl: Yup.string().required(t("fieldCannotBeBlank")),
    hasPG: Yup.boolean(),
  });

  const uddoktaPayHandler = (values) => {
    let postBody = {
      ...ispOwner,
      bpSettings: {
        ...ispOwner.bpSettings,
        paymentGateway: {
          ...ispOwner.bpSettings.paymentGateway,
          gatewayType: "uddoktapay",
          uddoktapay: {
            apiKey: values.apiKey,
            apiUrl: values.apiUrl,
          },
        },
        hasPG: values.hasPG,
      },
    };

    updateOwner(ispOwner.id, postBody, setIsLoading, dispatch, setShow);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ispuddoktaPayValidator}
      onSubmit={(values) => {
        uddoktaPayHandler(values);
      }}
      enableReinitialize
    >
      {() => (
        <Form>
          <div className="displayGrid3">
            <FtextField required type="text" label={"Api Key"} name="apiKey" />

            <FtextField required type="text" label={"Url"} name="apiUrl" />
          </div>

          <div className="displayGrid3">
            <div className="form-check mt-4">
              <Field
                className="form-check-input"
                type="checkbox"
                id="hasPG"
                name="hasPG"
              />
              <label className="form-check-label" for="hasPG">
                Has PG
              </label>
            </div>
          </div>

          <div className="displayGrid1 float-end mt-4">
            <button
              type="button"
              className="btn btn-secondary"
              disabled={isLoading}
              onClick={() => setShow(false)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-success"
              disabled={isLoading}
            >
              {isLoading ? <Loader /> : "Submit"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default UddoktaPayForm;
