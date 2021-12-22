// external imports
import React from "react";
import { NavLink } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// internal imports
import { Background, FontColor, FourGround } from "../../../assets/js/theme";
import { LoginField } from "./LoginField";
import { asyncLogin } from "../../../features/actions/authAsyncAction";
import "./login.css";

export default function Login() {
  const loginValidate = Yup.object({
    mobile: Yup.string()
      .min(11, "১১ ডিজিট এর সঠিক নম্বর দিন ")
      .max(11, "নাম্বার ১১ ডিজিট এর বেশি হয়ে  গেছে ")
      .required("ফিল্ড ফাঁকা রাখা যাবে না "),
    password: Yup.string().required("ফিল্ড ফাঁকা রাখা যাবে না "),
  });

  const handleLogin = (loginData) => {
    const loader = document.querySelector(".Loader");
    loader.style.display = "block";

    // send to login control
    asyncLogin(loginData);
  };

  return (
    <Background>
      <FourGround>
        <div className="Loader"></div>
        <ToastContainer
          toastStyle={{ backgroundColor: "#992c0c", color: "white" }}
        />

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
                  <img
                    className="mb-4 login-Logo"
                    src="https://bayannopay.com/logo.png"
                    alt=""
                    width="100"
                  />
                  <h1 className="h3 mb-3 fw-normal">
                    <FontColor>লগইন</FontColor>
                  </h1>
                  <Form>
                    <LoginField label="মোবাইল" name="mobile" type="text" />
                    <LoginField
                      label="পাসওয়ার্ড"
                      name="password"
                      type="password"
                    />
                    <button
                      className="btn  btn-primary mt-4 cstm-login-btn"
                      type="submit"
                    >
                      Sign in
                    </button>
                    <NavLink to="/">
                      <button
                        className="w-45 btn  btn-secondary mt-4 cstm-login-cancle"
                        type="button"
                      >
                        Cancel
                      </button>
                    </NavLink>
                    <br />
                    <br />

                    <NavLink to="/" className="FotGetPassword">
                      Forget Password?
                    </NavLink>
                    <p className="mt-5 mb-3 text-muted">&copy;2021</p>
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
