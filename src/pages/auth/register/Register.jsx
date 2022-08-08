// external
import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// internal
import { FontColor, FourGround } from "../../../assets/js/theme";
import { NavLink } from "react-router-dom";
import "./register.css";
import { initialValues, TextField } from "./TextField";
import { asyncRegister } from "../../../features/actions/authAsyncAction";
import allpakage from "./pakageData";
import Loader from "../../../components/common/Loader";
import FormatNumber from "../../../components/common/NumberFormat";
import { useTranslation } from "react-i18next";

export default function Register() {
  const { t } = useTranslation();
  // const [packValue, setPackValue] = useState("");
  const discount = 50;
  const [pakage, setPakage] = useState(allpakage[0]);
  const [subpakage, setsubPakage] = useState(allpakage[0]["subPakage"]);
  const [singlePakage, setSinglePakage] = useState([
    // allpakage[0]["subPakage"][0],
    "Standard",
  ]);
  const [isLoading, setLoading] = useState(false);
  const validate = Yup.object({
    company: Yup.string()
      .min(3, t("minimumContaining3letter"))
      .required(t("enterOrganizationName")),
    name: Yup.string()
      .min(3, t("minimumContaining3letter"))
      .required(t("enterAdminName")),
    address: Yup.string()
      .min(3, t("minimumContaining3letter"))
      .max(100, t("maximumContaining100letter"))
      .required(t("enterYourAddress")),
    mobile: Yup.string()
      .min(11, t("write11DigitMobileNumber"))
      .max(11, t("over11DigitMobileNumber"))
      .required(t("writeMobileNumber")),
    email: Yup.string()
      .email(t("incorrectEmail"))
      .required(t("enterYourEmail")),

    refName: Yup.string().min(3, t("minimumContaining3letter")),
    refMobile: Yup.string()
      .min(11, t("write11DigitMobileNumber"))
      .max(11, t("over11DigitMobileNumber")),
  });

  const submitHandle = (values) => {
    // const selector = document.getElementById("selector");

    // const { refName, refMobile, ...rest } = values;
    let userData = {};

    const { refName, maxUser, refMobile, ...rest } = values;
    userData = {
      ...rest,
      pack: singlePakage[0].subPackageName,
      packType: pakage.packageName,
      reference: {
        name: refName || "আব্দুর রাজ্জাক",
        mobile: refMobile || "01321141790",
      },
    };

    // send user data to async function

    asyncRegister(userData, setLoading);
  };

  // show customer field
  // let showField = () => {
  //   const selector = document.getElementById("selector");
  //   const customer = document.getElementById("get_customer");

  //   setPackValue(selector.value);

  //   if (selector.value === "P4") {
  //     customer.style.display = "block";
  //   } else {
  //     document.getElementById("maxUserValue").value = "";
  //     customer.style.display = "none";
  //   }
  // };

  const handlePakageSelect = (e) => {
    // setChecked(!isChecked)
    const pakage = JSON.parse(e.target.value);
    setPakage(pakage);
    setsubPakage(pakage?.subPakage);
    const getsinglePak = pakage?.subPakage?.filter(
      (p) => p.subPackageName === singlePakage[0]?.subPackageName
    );
    setSinglePakage(getsinglePak);
  };
  const handleSubPakage = (e) => {
    setSinglePakage([JSON.parse(e.target.value)]);
  };

  return (
    <FontColor>
      <div className="register">
        <ToastContainer position="top-right" theme="colored" />
        <div className="container">
          <FourGround>
            <Formik
              initialValues={initialValues}
              validationSchema={validate}
              onSubmit={(values) => {
                submitHandle(values);
              }}
            >
              {(formik) => (
                <div className="formStyle">
                  {/* <img
                    className="mb-4 login-Logo"
                    src="/assets/img/logo.png"
                    alt=""
                    width="150"
                  /> */}
                  <h3 className="mb-4">{t("registration")} </h3>
                  <Form>
                    <TextField
                      label={t("organizationName")}
                      name="company"
                      type="text"
                    />
                    <TextField label={t("adminName")} name="name" type="text" />
                    <TextField label={t("mobile")} name="mobile" type="text" />
                    <TextField label={t("email")} name="email" type="email" />
                    <TextField
                      label={t("address")}
                      name="address"
                      type="text"
                    />

                    {/* Options */}
                    <div className="discount">
                      <span className="disspan">
                        {" "}
                        <strong className="disStrong">{discount}%</strong>{" "}
                        {t("discountWithSignUpFee")}
                      </span>
                    </div>
                    <label className="form-label mt-2">
                      {t("selectYourPreferablePackage")}
                    </label>

                    {/* <option value="">প্যাকেজ সিলেক্ট করুন</option> */}
                    {/* <div className="radiopak">
                      {allpakage.map((pak, index) => {
                        return (
                          <div className="singlePak" key={index}>
                            <input
                              className="pakinput"
                              type="radio"
                              id={pak.packageName}
                              // name="drone"
                              value={JSON.stringify(pak)}
                              // checked
                              checked={pak.packageName === pakage.packageName}
                              onChange={handlePakageSelect}
                            />
                            <label htmlFor={pak.packageName}>
                              {pak.packageNameBangla}
                            </label>
                          </div>
                        );
                      })}
                    </div> */}

                    <select
                      name="package"
                      className="customFormSelect"
                      id="selector"
                      onChange={handleSubPakage}
                    >
                      {/* <option value="">সাব প্যাকেজ সিলেক্ট করুন</option> */}

                      {subpakage?.map((pak, index) => {
                        return (
                          <option
                            className="customOption"
                            key={index}
                            value={JSON.stringify(pak)}
                          >
                            {/* {pak.subPackageName} */}

                            {`${pak.subPackageName} - ${pak.customer}`}
                          </option>
                        );
                      })}
                    </select>

                    <div className="pakinfo mt-2">
                      <span>
                        {t("customer")} :{" "}
                        {FormatNumber(singlePakage[0].customer)}
                      </span>
                      <span className="insFeespan">
                        {t("signUpFee")} :{" "}
                        {discount > 0 ? (
                          <span
                            className={
                              discount > 0 ? "strikethrough" : "mainfee"
                            }
                          >
                            {FormatNumber(singlePakage[0].installation)}
                          </span>
                        ) : (
                          ""
                        )}
                        <span className="mainfee">
                          {FormatNumber(
                            singlePakage[0].installation -
                              (singlePakage[0].installation * discount) / 100
                          )}
                        </span>
                      </span>
                      <span>
                        {t("monthFee")} :{" "}
                        {FormatNumber(singlePakage[0].monthly)}
                      </span>
                    </div>

                    {/* <div className="form-outline" id="get_customer">
                      <TextField
                        id="maxUserValue"
                        label="কাস্টমার সংখ্যা"
                        name="maxUser"
                        type="number"
                      />
                    </div> */}
                    {/* options */}

                    <div className="customInputGroup">
                      {/* <p className="referance-name">রেফারেন্স </p> */}
                      <div className="referanceField">
                        <TextField
                          label={t("referenceName")}
                          name="refName"
                          type="text"
                        />
                        <TextField
                          label={t("referenceMobile")}
                          name="refMobile"
                          type="text"
                        />
                      </div>
                    </div>

                    <button type="submit" className="submitBtn">
                      {isLoading ? <Loader></Loader> : t("register")}
                    </button>
                    <NavLink to="/">
                      <button
                        className="w-45 btn  btn-secondary registerCacleBtn"
                        type="button"
                      >
                        {t("cancel")}
                      </button>
                    </NavLink>
                  </Form>
                </div>
              )}
            </Formik>
          </FourGround>
        </div>
      </div>
    </FontColor>
  );
}
