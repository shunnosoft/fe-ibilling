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
  getAllCustomerCount,
  passwordUpdate,
  profileUpdate,
} from "../../features/apiCalls";
import { useDispatch } from "react-redux";
import Loader from "../../components/common/Loader";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tab, Tabs } from "react-bootstrap";
import moment from "moment/moment";
import { badge } from "../../components/common/Utils";
import { useEffect } from "react";
import QrCode from "./QrCode";

export default function Profile() {
  const { t } = useTranslation();
  // get all role
  const role = useSelector((state) => state.persistedReducer.auth.role);

  const currentUser = useSelector(
    (state) => state.persistedReducer.auth.userData
  );

  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingpass, setIsLoadingpass] = useState(false);
  const [startRedirect, setStartRedirect] = useState(false);
  const [redirectTime, setRedirectTime] = useState(10);
  const [customerCount, setCustomerCount] = useState();

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
    const sendingData = {
      dispatch,
      data,
      role,
      id: ispOwnerId,
      mobile: currentUser.mobile,
      setIsLoading,
      setRedirectTime,
      setStartRedirect,
    };

    profileUpdate(sendingData);
  };
  //   change password handler
  const changePasswordHandler = (data) => {
    delete data.confrimPassword;
    const sendingData = {
      data,
      role,
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

  useEffect(() => {
    role === "ispOwner" && getAllCustomerCount(ispOwnerId, setCustomerCount);
  }, []);

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
            {!startRedirect && (
              <FontColor>
                <FourGround>
                  <h2 className="collectorTitle"> {t("profile")} </h2>
                </FourGround>

                <FourGround>
                  <Tabs
                    defaultActiveKey={"settings"}
                    id="uncontrolled-tab-example"
                    className="mb-3"
                  >
                    <Tab eventKey="settings" title={t("settings")}>
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
                    </Tab>
                    <Tab eventKey="profile" title={t("profile")}>
                      <div className="collectorWrapper">
                        <div className="profileWrapper d-flex">
                          <table class="table table-bordered">
                            <tbody>
                              {role === "ispOwner" && (
                                <>
                                  <tr>
                                    <td>{t("netFeeId")}</td>
                                    <td>
                                      <b>{currentUser?.netFeeId}</b>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>{t("company")}</td>
                                    <td>{currentUser?.company}</td>
                                  </tr>
                                </>
                              )}
                              <tr>
                                <td>{t("name")}</td>
                                <td>{currentUser?.name}</td>
                              </tr>
                              <tr>
                                <td>{t("mobile")}</td>
                                <td>{currentUser?.mobile}</td>
                              </tr>
                              <tr>
                                <td>{t("email")}</td>
                                <td>{currentUser?.email}</td>
                              </tr>
                              <tr>
                                <td>{t("address")}</td>
                                <td>{currentUser?.address}</td>
                              </tr>
                              <tr>
                                <td>{t("createdAt")}</td>
                                <td>
                                  {moment(currentUser?.createdAt).format("lll")}
                                </td>
                              </tr>
                              {role !== "collector" && (
                                <>
                                  <tr>
                                    <td>{t("dueDate")}</td>
                                    <td>
                                      {moment(
                                        currentUser.bpSettings?.monthlyDueDate
                                      ).format("lll")}
                                    </td>
                                  </tr>
                                </>
                              )}
                            </tbody>
                          </table>
                          {role === "ispOwner" && (
                            <>
                              <table class="table table-bordered">
                                <tbody>
                                  <tr>
                                    <td>{t("package")}</td>
                                    <td>
                                      <b>{currentUser.bpSettings?.pack}</b>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>{t("packageRate")}</td>
                                    <td>
                                      {currentUser.bpSettings?.packageRate}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>{t("customerLimit")}</td>
                                    <td>
                                      {currentUser.bpSettings?.customerLimit}
                                    </td>
                                  </tr>
                                  {role === "ispOwner" && (
                                    <tr>
                                      <td>{t("total customer")}</td>
                                      <td>{customerCount?.customersCount}</td>
                                    </tr>
                                  )}
                                  <tr>
                                    <td>{t("customerType")}</td>
                                    <td>
                                      {currentUser.bpSettings?.customerType.map(
                                        (item) => item + " "
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>{t("paymentStatus")}</td>
                                    <td>
                                      {badge(
                                        currentUser.bpSettings?.paymentStatus
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>{t("nonMaskingRate")}</td>
                                    <td>{currentUser?.smsRate}</td>
                                  </tr>
                                  <tr>
                                    <td>{t("fixedNumberSmsRate")}</td>
                                    <td>{currentUser?.fixedNumberSmsRate}</td>
                                  </tr>
                                  <tr>
                                    <td>{t("maskingSmsRate")}</td>
                                    <td>{currentUser?.maskingSmsRate}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </>
                          )}
                        </div>
                      </div>
                    </Tab>
                    <Tab eventKey="qrCode" title={t("qrCode")}>
                      <div className="collectorWrapper overflow-hidden">
                        <div className="profileWrapper">
                          <QrCode
                            size={290}
                            ispInfo={{
                              company: currentUser?.company,
                              mobile: currentUser?.mobile,
                              netFeeId: currentUser?.netFeeId,
                              address: currentUser?.address,
                            }}
                          />
                        </div>
                      </div>
                    </Tab>
                  </Tabs>
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
