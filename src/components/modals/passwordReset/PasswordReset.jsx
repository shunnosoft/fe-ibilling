import React from "react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
  InputGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

//internal import
import Loader from "../../common/Loader";
import {
  PasswordResetApi,
  mobilePasswordApi,
  newPasswordApi,
} from "../../../features/resetPasswordApi";

const PasswordReset = ({ show, setShow, userId }) => {
  const { t } = useTranslation();

  // new password validation
  const newPasswordValidator = Yup.object({
    newPassword: Yup.string()
      .min(8, t("wrrtePassword"))
      .required(t("wrrtePassword")),
  });

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // reset future data
  const [resetFuture, setResetFuture] = useState("default");

  // password type default password
  const [passType, setPassType] = useState("password");

  // modal close handler
  const handleClose = () => {
    setShow(false);
    setResetFuture("default");
  };

  // customer password reset handle
  const customerNewPassword = (values, resetForm) => {
    // customer manually password
    const data = { password: values.newPassword };

    if (resetFuture === "default") {
      PasswordResetApi(userId, setShow, setIsLoading, setResetFuture);
    } else if (resetFuture === "manually") {
      newPasswordApi(
        userId,
        data,
        resetForm,
        setShow,
        setIsLoading,
        setResetFuture
      );
    } else {
      mobilePasswordApi(userId, setShow, setIsLoading, setResetFuture);
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <ModalHeader closeButton>
          <ModalTitle>
            <h5 className="modal-title" id="exampleModalLabel">
              {t("passwordReset")}
            </h5>
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="container">
            <Formik
              initialValues={{
                newPassword: "",
              }}
              validationSchema={
                resetFuture === "manually" && newPasswordValidator
              }
              onSubmit={(values, { resetForm }) => {
                customerNewPassword(values, resetForm);
              }}
              enableReinitialize
            >
              {() => (
                <Form id="resetPassword">
                  <div className="container">
                    <div className="radioSelect mt-0">
                      <input
                        className="getValueUsingClass"
                        type="radio"
                        value="default"
                        id="defaultPassword"
                        onChange={(e) => {
                          setResetFuture(e.target.value);
                        }}
                        checked={resetFuture === "default"}
                      />
                      <label
                        class="form-check-label templateLabel"
                        htmlFor="defaultPassword"
                      >
                        {t("defaultPassword")}
                      </label>
                    </div>

                    <div className="radioSelect">
                      <input
                        className="getValueUsingClass"
                        type="radio"
                        value="mobile"
                        id="mobilePassword"
                        onChange={(e) => {
                          setResetFuture(e.target.value);
                        }}
                        checked={resetFuture === "mobile"}
                      />
                      <label
                        class="form-check-label templateLabel"
                        htmlFor="mobilePassword"
                      >
                        {t("mobileNumberPassword")}
                      </label>
                    </div>

                    <div className="radioSelect">
                      <input
                        className="getValueUsingClass"
                        type="radio"
                        value="manually"
                        id="manuallyPassword"
                        onChange={(e) => {
                          setResetFuture(e.target.value);
                        }}
                        checked={resetFuture === "manually"}
                      />
                      <label
                        class="form-check-label templateLabel"
                        htmlFor="manuallyPassword"
                      >
                        {t("manuallyPassword")}
                      </label>
                    </div>

                    {resetFuture === "manually" && (
                      <>
                        <InputGroup className="my-1">
                          <Field
                            className="form-control shadow-none"
                            type={passType}
                            name="newPassword"
                            placeholder={t("inputYourPassword")}
                          />
                          <InputGroup.Checkbox
                            aria-label="Checkbox for following text input"
                            onChange={(e) =>
                              setPassType(
                                e.target.checked ? "text" : "password"
                              )
                            }
                          />
                        </InputGroup>
                        <ErrorMessage name="newPassword" component="div">
                          {(err) => (
                            <span className="errorMessage text-danger">
                              {err}
                            </span>
                          )}
                        </ErrorMessage>
                      </>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="displayGrid1">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleClose}
              disabled={isLoading}
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              form="resetPassword"
              className="btn btn-outline-success"
              disabled={isLoading}
            >
              {isLoading ? <Loader /> : t("save")}
            </button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default PasswordReset;
