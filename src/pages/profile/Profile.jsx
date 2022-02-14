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
import { ispOwner } from "../../features/authSlice";

export default function Profile() {
  const currentUser = useSelector(ispOwner);

  const passwordValidator = Yup.object({
    oldPassword: Yup.string().required("Old পাসওয়ার্ড ***"),
    newPassword: Yup.string().required("New পাসওয়ার্ড ***").min(3),
  });

  const progileEditHandler = (data) => {
    console.log("Updated Data: ", data);
  };

  //   change password handler
  const changePasswordHandler = (data) => {
    console.log("Password Data: ", data);
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
                <h2 className="collectorTitle">প্রোফাইল</h2>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper">
                  <div className="profileWrapper">
                    <div className="profileUpdate">
                      <h5 className="mb-4">প্রোফাইল আপডেট</h5>
                      <Formik
                        initialValues={{
                          name: currentUser.name || "",
                          company: currentUser.company || "",
                          mobile: currentUser.mobile || "",
                          email: currentUser.email || "",
                          smsRate: currentUser.smsRate || "",
                        }}
                        onSubmit={(values) => {
                          progileEditHandler(values);
                        }}
                        enableReinitialize
                      >
                        {() => (
                          <Form>
                            <FtextField type="text" label={`নাম`} name="name" />
                            <FtextField
                              type="text"
                              label={`কোম্পানি`}
                              name="company"
                            />
                            <FtextField
                              type="text"
                              label={`মোবাইল`}
                              name="mobile"
                            />
                            <FtextField
                              type="email"
                              label={`ইমেইল`}
                              name="email"
                            />
                            <FtextField
                              type="text"
                              label={`SMS রেট`}
                              name="smsRate"
                            />
                            <button
                              type="submit"
                              className="btn btn-success mt-2"
                            >
                              আপডেট
                            </button>
                          </Form>
                        )}
                      </Formik>
                    </div>
                    <div className="passwordUpdate">
                      <h5 className="mb-4 marginTop20">
                        পাসওয়ার্ড পরিবর্তন করুন
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
                              label="Old পাসওয়ার্ড"
                            />
                            <FtextField
                              type="password"
                              name="newPassword"
                              label="New পাসওয়ার্ড"
                            />
                            <button
                              type="submit"
                              className="btn btn-success mt-2"
                            >
                              পাসওয়ার্ড আপডেট
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
