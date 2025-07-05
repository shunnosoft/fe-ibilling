import { Form, Formik } from "formik";
import React, { useState } from "react";
import { FtextField } from "../../../components/common/FtextField";
import * as Yup from "yup";
import "./qrCodeHotspot.css";
import PackagePayment from "../MobilePayment/PackagePayment";

const SelfRegistration = ({ ispInfo, mobile }) => {
  // customer create validator
  const customerValidator = Yup.object({
    name: Yup.string()
      .required("Write Customer Name")
      .test("no-leading-zero", "Name cannot start with 0", (value) => {
        if (!value) return true;
        return !value.trim().startsWith("0");
      }),
    mobile: Yup.string()
      .matches(/^(01){1}[3456789]{1}(\d){8}$/, "Incorrect Mobile Number")
      .min(11, "Write 11 Digit Mobile Number")
      .max(11, "Over 11 Digit Mobile Number")
      .required("Write Mobile Number"),
  });

  const [showComponent, setShowComponent] = useState("");
  const [customer, setCustomer] = useState({});

  const handleSelfRegistrationInHotspot = (formValues) => {
    const sendingData = {
      ...formValues,
    };

    setShowComponent("packages");
    setCustomer(sendingData);
  };

  return (
    <>
      <Formik
        initialValues={{
          name: "",
          mobile: mobile || "",
        }}
        validationSchema={customerValidator}
        onSubmit={(values) => {
          handleSelfRegistrationInHotspot(values);
        }}
        enableReinitialize
      >
        {() => (
          <Form>
            <div className="displayGrid mb-3">
              <FtextField
                type="text"
                name="name"
                label="Name"
                validation={true}
              />
              <FtextField
                type="text"
                name="mobile"
                label="Mobile"
                validation={true}
              />
            </div>

            {showComponent !== "packages" && (
              <div className="d-flex justify-content-end mt-4">
                <button type="submit" className="btn btn-success customBtn">
                  Continue
                </button>
              </div>
            )}
          </Form>
        )}
      </Formik>

      {showComponent === "packages" && (
        <PackagePayment {...{ customer, ispInfo }} />
      )}
    </>
  );
};

export default SelfRegistration;
