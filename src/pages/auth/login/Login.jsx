// external imports
import React from "react";
import { NavLink } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// internal imports
import { Background, FourGround } from "../../../assets/js/theme";
import { LoginField } from "./LoginField";
import { asyncLogin } from "../../../features/actions/authAsyncAction";
import "./login.css";
import { useDispatch } from "react-redux";
import { useRef } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { t } = useTranslation();
  const [passInputType, setPassInputType] = useState("password");

  const dispatch = useDispatch();
  const loginValidate = Yup.object({
    mobile: Yup.string()
      .min(11, t("write11DigitMobileNumber"))
      .max(11, t("over11DigitMobileNumber"))
      .required(t("fieldCannotBeBlank")),
    password: Yup.string().required(t("fieldCannotBeBlank")),
  });

  const handleLogin = (loginData) => {
    const loader = document.querySelector(".Loader");
    loader.style.display = "block";

    // send to login control
    asyncLogin(dispatch, loginData);
  };

  return (
    <Background>
      <FourGround>
        <div className="Loader"></div>
        <ToastContainer position="top-right" theme="colored" />

        <div className="text-center loginWeapper">
          <main className="form-signin">
            <Formik
              initialValues={{
                mobile: "",
                password: "",
              }}
              validationSchema={loginValidate}
              onSubmit={(loginData) => {
                handleLogin(loginData);
              }}
            >
              {(formik) => (
                <div>
                  {/* <img
                    className="mb-5 login-Logo"
                    src="/assets/img/NetFee.png"
                    alt=""
                    width="200"
                  /> */}
                  {/* <h1 className="h3 mb-3 fw-normal">
                    <FontColor>লগইন</FontColor>
                  </h1> */}
                  <Form>
                    <LoginField label={t("mobile")} name="mobile" type="text" />
                    <LoginField
                      label={t("password")}
                      name="password"
                      type={passInputType}
                      id="password"
                    />
                    <div className="showPassword">
                      <input
                        style={{ cursor: "pointer" }}
                        className="form-check-input shadow-none"
                        type="checkbox"
                        name="showPass"
                        id="showPass"
                        onChange={(e) =>
                          setPassInputType(
                            e.target.checked ? "text" : "password"
                          )
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
                    <button
                      className="btn  btn-primary mt-4 cstm-login-btn"
                      type="submit"
                    >
                      {t("logIn")}
                    </button>
                    <NavLink to="/">
                      <button
                        className="w-45 btn  btn-secondary mt-4 cstm-login-cancel"
                        type="button"
                      >
                        {t("cancel")}
                      </button>
                    </NavLink>
                    <br />
                    <br />

                    {/* <NavLink to="/" className="FotGetPassword">
                      পাসওয়ার্ড ভুলে গেছেন?
                    </NavLink> */}
                    <p className="mt-5 mb-3 text-muted">
                      &copy; {t("shunnoIT")} - {new Date().getFullYear()}
                    </p>
                  </Form>
                </div>
              )}
            </Formik>
          </main>
        </div>
      </FourGround>
    </Background>
  );
}
