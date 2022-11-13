import React from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";

// internal import
import "./profile.css";
import { FtextField } from "../../components/common/FtextField";
import { FontColor, FourGround } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import useDash from "../../assets/css/dash.module.css";
import { passwordUpdate, profileUpdate } from "../../features/apiCalls";
import { useDispatch } from "react-redux";
import Loader from "../../components/common/Loader";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Profile() {
  const { t } = useTranslation();
  // const role = useSelector(state=>state.persistedReducer.auth.currentUser?.user.role);
  const currentUser = useSelector(
    (state) => state.persistedReducer.auth.userData
  );

  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingpass, setIsLoadingpass] = useState(false);

  const passwordValidator = Yup.object({
    mobile: Yup.string()
      // .matches(/^(01){1}[3456789]{1}(\d){8}$/, "মোবাইল নম্বর সঠিক নয়")
      .min(11, t("write11DigitMobileNumber"))
      .max(11, t("over11DigitMobileNumber")),
    oldPassword: Yup.string().required(`${t("oldPassword")} ***`),
    newPassword: Yup.string()
      .required(`${t("newPassword")} ***`)
      .matches(
        /^.*(?=.{8,})(?=.*\d)(?=.*[a-zA-Z]).*$/,
        "Must Contain 8 Characters,   One Alphabat, One Number"
      ),
    confrimPassword: Yup.string().oneOf(
      [Yup.ref("newPassword"), null],
      `${t("doNotMatchPassword")}`
    ),
  });

  const profileValidator = Yup.object({
    name: Yup.string().required(t("writeCustomerName")),
    company: Yup.string().required(t("writeCompanyName")),
    email: Yup.string().email(t("incorrectEmail")),
    address: Yup.string(),
    mobile: Yup.string()
      // .matches(/^(01){1}[3456789]{1}(\d){8}$/, "মোবাইল নম্বর সঠিক নয়")
      .min(11, t("write11DigitMobileNumber"))
      .max(11, t("over11DigitMobileNumber")),
    signature: Yup.string(),
  });

  const dispatch = useDispatch();
  const progileEditHandler = (data) => {
    // delete data.mobile;
    profileUpdate(dispatch, data, ispOwnerId, setIsLoading);
  };

  //   change password handler
  const changePasswordHandler = (data) => {
    delete data.confrimPassword;
    passwordUpdate(data, setIsLoadingpass);
  };
  return (
    <>
      <Sidebar />
      <ToastContainer
        className="bg-green"
        toastStyle={{
          backgroundColor: "#677078",
          color: "white",
          fontWeight: "500",
        }}
      />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <h2 className="collectorTitle"> {t("profile")} </h2>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper">
                  <div className="profileWrapper">
                    <div className="profileUpdate">
                      <h5 className="mb-4"> {t("updateProfile")} </h5>
                      <Formik
                        initialValues={{
                          name: currentUser?.name || "",
                          company: currentUser?.company || "",
                          email: currentUser?.email || "",
                          address: currentUser?.address || "",
                          signature: currentUser?.signature || "",
                          mobile: currentUser?.mobile || "",
                        }}
                        validationSchema={profileValidator}
                        onSubmit={(values) => {
                          progileEditHandler(values);
                        }}
                        enableReinitialize
                      >
                        {() => (
                          <Form>
                            <FtextField
                              type="text"
                              label={t("name")}
                              name="name"
                            />
                            <FtextField
                              type="text"
                              label={t("company")}
                              name="company"
                            />

                            <FtextField
                              type="email"
                              label={t("email")}
                              name="email"
                            />
                            <FtextField
                              type="text"
                              label={t("mobile")}
                              name="mobile"
                            />
                            <FtextField
                              type="text"
                              label={t("address")}
                              name="address"
                            />
                            <FtextField
                              type="text"
                              label={t("signature")}
                              name="signature"
                            />
                            <button
                              type="submit"
                              className="btn btn-success mt-2"
                            >
                              {isLoading ? <Loader /> : t("update")}
                            </button>
                          </Form>
                        )}
                      </Formik>
                    </div>
                    <div className="passwordUpdate">
                      <h5 className="mb-4 marginTop20">
                        {t("changePassword")}
                      </h5>
                      <Formik
                        initialValues={{
                          oldPassword: "",
                          newPassword: "",
                        }}
                        validationSchema={passwordValidator}
                        onSubmit={(values) => {
                          changePasswordHandler(values);
                        }}
                      >
                        {() => (
                          <Form>
                            <FtextField
                              type="password"
                              name="oldPassword"
                              label={t("oldPassword")}
                            />
                            <FtextField
                              type="password"
                              name="newPassword"
                              label={t("newPassword")}
                            />
                            <FtextField
                              type="password"
                              name="confrimPassword"
                              label={t("againNewPassword")}
                            />
                            <button
                              type="submit"
                              className="btn btn-success mt-2"
                            >
                              {isLoadingpass ? <Loader /> : t("updatePassword")}
                            </button>
                          </Form>
                        )}
                      </Formik>
                    </div>
                  </div>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
}
