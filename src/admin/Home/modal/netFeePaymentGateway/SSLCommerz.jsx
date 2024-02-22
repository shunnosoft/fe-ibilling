import { Form, Formik, Field } from "formik";
import React from "react";
import * as Yup from "yup";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

// internal import
import { FtextField } from "../../../../components/common/FtextField";
import Loader from "../../../../components/common/Loader";
import { updateOwner } from "../../../../features/apiCallAdmin";

const SSLCommerz = ({ setShow, ispOwner }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  //  loading local state
  const [isLoading, setIsLoading] = useState(false);

  // state for password type
  const [passType, setPassType] = useState("password");

  // initial values for form
  let initialValues = {
    storeId: "",
    storePassword: "",
    ipn: "",
    hasPG: true,
  };

  if (ispOwner) {
    const paymentGateway = ispOwner?.bpSettings?.paymentGateway;
    if (paymentGateway?.sslCommerz) {
      initialValues = {
        storeId: paymentGateway?.sslCommerz?.storeId,
        storePassword: paymentGateway?.sslCommerz?.storePassword,
        ipn: paymentGateway?.sslCommerz?.ipn,
      };
    }

    if (paymentGateway)
      initialValues = { ...initialValues, hasPG: ispOwner?.bpSettings?.hasPG };
  }

  const ispsslCommerzValidator = Yup.object({
    storeId: Yup.string().required(t("fieldCannotBeBlank")),
    storePassword: Yup.string().required(t("fieldCannotBeBlank")),
    ipn: Yup.string().required(t("fieldCannotBeBlank")),
    hasPG: Yup.boolean(),
  });

  const sslCommerzHandler = (values) => {
    let postBody = {
      ...ispOwner,
      bpSettings: {
        ...ispOwner.bpSettings,
        paymentGateway: {
          ...ispOwner.bpSettings.paymentGateway,
          gatewayType: "sslCommerz",
          sslCommerz: {
            storeId: values.storeId,
            storePassword: values.storePassword,
            ipn: values.ipn,
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
      validationSchema={ispsslCommerzValidator}
      onSubmit={(values) => {
        sslCommerzHandler(values);
      }}
      enableReinitialize
    >
      {() => (
        <Form>
          <div className="displayGrid3">
            <FtextField
              required
              type="text"
              label={"Store Id"}
              name="storeId"
            />

            <FtextField required type="text" label={"Ipn"} name="ipn" />

            <div>
              <FtextField
                required
                type={passType}
                label={"Store Password"}
                name="storePassword"
              />

              <div className="showPassword">
                <input
                  style={{ cursor: "pointer" }}
                  className="form-check-input shadow-none"
                  type="checkbox"
                  name="showPass"
                  id="showPass"
                  onChange={(e) =>
                    setPassType(e.target.checked ? "text" : "password")
                  }
                />
                <label
                  style={{ cursor: "pointer" }}
                  className="form-check-label text-mute"
                  htmlFor="showPass"
                >
                  &nbsp; Show Password
                </label>
              </div>
            </div>
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

export default SSLCommerz;
