import { Form, Formik, Field } from "formik";
import React from "react";
import { FtextField } from "../../../../components/common/FtextField";
import Loader from "../../../../components/common/Loader";
import * as Yup from "yup";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { updateOwner } from "../../../../features/apiCallAdmin";

const BkashForm = ({ ispOwner }) => {
  const [passType, setPassType] = useState("password");
  //  loading local state
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  // import dispatch from react redux
  const dispatch = useDispatch();
  const role = useSelector((state) => state.persistedReducer.auth?.role);

  let initialValues = {
    username: "",
    appSecret: "",
    appKey: "",
    password: "",
    isTokenized: true,
    hasPG: true,
  };

  if (ispOwner) {
    const paymentGateway = ispOwner?.bpSettings?.paymentGateway;
    if (paymentGateway?.bKash) {
      initialValues = {
        username: paymentGateway?.bKash?.username,
        appSecret: paymentGateway?.bKash?.appSecret,
        appKey: paymentGateway?.bKash?.appKey,
        password: paymentGateway?.bKash?.password,
        isTokenized: paymentGateway?.bKash?.isTokenized,
      };
    }

    if (paymentGateway)
      initialValues = { ...initialValues, hasPG: ispOwner?.bpSettings?.hasPG };
  }

  const ispBkashValidator = Yup.object({
    username: Yup.string().required(t("fieldCannotBeBlank")),
    appSecret: Yup.string().required(t("fieldCannotBeBlank")),
    appKey: Yup.string().required(t("fieldCannotBeBlank")),
    password: Yup.string().required(t("fieldCannotBeBlank")),
    isTokenized: Yup.boolean(),
    hasPG: Yup.boolean(),
  });

  const bkashHandler = (values) => {
    if (role === "admin") {
      let postBody = {
        ...ispOwner,
        bpSettings: {
          ...ispOwner.bpSettings,
          paymentGateway: {
            ...ispOwner.bpSettings.paymentGateway,
            gatewayType: "bKashPG",
            bKash: {
              username: values.username,
              appSecret: values.appSecret,
              password: values.password,
              appKey: values.appKey,
              isTokenized: values.isTokenized,
            },
          },
          hasPG: values.hasPG,
        },
      };

      updateOwner(ispOwner.id, postBody, setIsLoading, dispatch);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ispBkashValidator}
      onSubmit={(values) => {
        bkashHandler(values);
      }}
      enableReinitialize
    >
      {() => (
        <Form>
          <div className="displayGrid3">
            <FtextField
              required
              type="text"
              label={t("userName")}
              name="username"
            />
            <FtextField
              required
              type="text"
              label={t("appSecret")}
              name="appSecret"
            />

            <div>
              <FtextField
                required
                type={passType}
                label={t("password")}
                name="password"
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
                  &nbsp; {t("showPassword")}
                </label>
              </div>
            </div>

            <FtextField
              required
              type="text"
              label={t("appKey")}
              name="appKey"
            />
          </div>

          <div className="displayGrid3">
            <div className="form-check mt-4">
              <Field
                className="form-check-input"
                type="checkbox"
                id="isTokenized"
                name="isTokenized"
              />
              <label className="form-check-label" for="isTokenized">
                {t("isTokenized")}
              </label>
            </div>

            <div className="form-check mt-4">
              <Field
                className="form-check-input"
                type="checkbox"
                id="hasPG"
                name="hasPG"
              />
              <label className="form-check-label" for="hasPG">
                {t("hasPG")}
              </label>
            </div>
          </div>

          <div className="modal-footer" style={{ border: "none" }}>
            <button
              type="submit"
              className="btn btn-success"
              disabled={isLoading}
            >
              {isLoading ? <Loader /> : t("submit")}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              disabled={isLoading}
            >
              {t("cancel")}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default BkashForm;
