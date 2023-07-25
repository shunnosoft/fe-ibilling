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
import {
  collectorProfileUpdate,
  passwordUpdate,
  profileUpdate,
  resellerProfileUpdate,
} from "../../features/apiCalls";
import { useDispatch } from "react-redux";
import Loader from "../../components/common/Loader";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Profile() {
  const { t } = useTranslation();
  const role = useSelector(
    (state) => state.persistedReducer.auth.currentUser?.user.role
  );
  const currentUser = useSelector(
    (state) => state.persistedReducer.auth.userData
  );

  const resellerId = useSelector((state) =>
    role === "reseller"
      ? state.persistedReducer.auth?.userData?.id
      : state.persistedReducer.auth?.userData?.reseller
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingpass, setIsLoadingpass] = useState(false);
  const [startRedirect, setStartRedirect] = useState(false);
  const [redirectTime, setRedirectTime] = useState(10);

  const passwordValidator = Yup.object({
    oldPassword: Yup.string().required(` ${t("oldPassword")} ***`),
    newPassword: Yup.string()
      .required(`${t("newPassword")} ***`)
      .matches(
        /^.*(?=.{8,})(?=.*\d)(?=.*[a-zA-Z]).*$/,
        "Must Contain 8 Characters,   One Alphabat, One Number"
      ),
    confrimPassword: Yup.string().oneOf(
      [Yup.ref("newPassword"), null],
      t("doNotMatchPassword")
    ),
  });
  const dispatch = useDispatch();
  const profileEditHandler = (data) => {
    if (role === "reseller") {
      const sendingData = {
        dispatch,
        data,
        resellerId,
        setIsLoading,
        setRedirectTime,
        setStartRedirect,
        mobile: currentUser.mobile,
      };

      resellerProfileUpdate(sendingData);
    }
    if (role === "collector") {
      const sendingData = {
        dispatch,
        data,
        resellerId,
        collectorId: currentUser?.id,
        setIsLoading,
        setRedirectTime,
        setStartRedirect,
        mobile: currentUser.mobile,
      };
      collectorProfileUpdate(sendingData);
    }
  };

  //   change password handler
  const changePasswordHandler = (data) => {
    delete data.confrimPassword;
    const sendingData = {
      data,
      setIsLoadingpass,
      setRedirectTime,
      setStartRedirect,
    };

    passwordUpdate(sendingData);
  };

  const styles = {
    width: "100%",
    height: "100vh",
    overflow: "hidden",
    position: "fixed",
    top: 0,
    bottom: 0,
    zIndex: "5",
  };

  return (
    <>
      {startRedirect && (
        <div style={styles}>
          <h3
            className="text-secondary text-center"
            style={{ marginTop: "10rem" }}
          >
            you are being logging out in {redirectTime} seconds...
          </h3>
        </div>
      )}

      {!startRedirect && <Sidebar />}
      <ToastContainer position="top-right" theme="colored" />

      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            {!startRedirect && (
              <FontColor>
                <FourGround>
                  <h2 className="collectorTitle"> {t("profile")} </h2>
                </FourGround>

                <FourGround>
                  <div className="collectorWrapper">
                    <div className="profileWrapper">
                      <div className="profileUpdate">
                        <h5 className="mb-4"> {t("updateProfile")}</h5>
                        <Formik
                          initialValues={{
                            name: currentUser?.name || "",
                            company: currentUser?.company || "",
                            email: currentUser?.email || "",
                            address: currentUser?.address || "",
                            mobile: currentUser?.mobile || "",
                          }}
                          onSubmit={(values) => {
                            profileEditHandler(values);
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
                                disabled={role === "collector"}
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

                              <button
                                type="submit"
                                className="btn btn-success mt-2"
                                disabled={
                                  currentUser.ispOwner ===
                                  "624f41a4291af1f48c7d75c7"
                                }
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
                                disabled={
                                  currentUser.ispOwner ===
                                  "624f41a4291af1f48c7d75c7"
                                }
                              >
                                {isLoadingpass ? (
                                  <Loader />
                                ) : (
                                  t("updatePassword")
                                )}
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
            )}
          </div>
        </div>
      </div>
    </>
  );
}
