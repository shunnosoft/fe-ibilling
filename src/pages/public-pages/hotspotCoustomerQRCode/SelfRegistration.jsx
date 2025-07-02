import { Form, Formik } from "formik";
import React, { useState } from "react";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import { useDispatch } from "react-redux";
import { hotspotUserCreate } from "../../../features/publicHotspotApi/publicHotspot";
import HotspotPackage from "./hotspotCustomerPage/HotspotPackage";
import * as Yup from "yup";
import "./qrCodeHotspot.css";
import PackagePayment from "../MobilePayment/PackagePayment";

const SelfRegistration = ({ ispInfo }) => {
  const dispatch = useDispatch();

  // customer create validator
  const customerValidator = Yup.object({
    name: Yup.string().required("Write Customer Name"),
    mobile: Yup.string()
      .matches(/^(01){1}[3456789]{1}(\d){8}$/, "Incorrect Mobile Number")
      .min(11, "Write 11 Digit Mobile Number")
      .max(11, "Over 11 Digit Mobile Number")
      .required("Write Mobile Number"),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showComponent, setShowComponent] = useState("");
  const [selectedPackage, setHotspotPackage] = useState(null);
  const [customer, setCustomer] = useState({});

  const handleSelfRegistrationInHotspot = (formValues) => {
    const sendingData = {
      ...formValues,
      // hotspotPackage: selectedPackage.id,
      // monthlyFee: selectedPackage.rate,
    };

    setShowComponent("packages");
    setCustomer(sendingData);

    // hotspotUserCreate(dispatch, ispInfo?.id, sendingData, setIsLoading);
  };

  return (
    <>
      <Formik
        initialValues={{
          name: "",
          mobile: "",
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
              <FtextField type="text" name="name" label="Name" />
              <FtextField type="text" name="mobile" label="Mobile" />
            </div>

            <div className="displayGrid1 float-end mt-4">
              <button
                type="submit"
                className="btn btn-success customBtn"
                disabled={isLoading}
              >
                {isLoading ? <Loader /> : "Continue"}
              </button>
            </div>
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
