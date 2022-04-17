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

export default function Register() {
  // const [packValue, setPackValue] = useState("");
  const discount = 50;
  const [pakage, setPakage] = useState(allpakage[0]);
  const [subpakage, setsubPakage] = useState(allpakage[0]["subPakage"]);
  const [singlePakage, setSinglePakage] = useState([
    allpakage[0]["subPakage"][0],
  ]);
  const [isLoading, setLoading] = useState(false);
  const validate = Yup.object({
    company: Yup.string()
      .min(3, "সর্বনিম্ন ৩ অক্ষর থাকতে হবে ")
      .required("প্রতিষ্ঠান এর নাম দিন"),
    name: Yup.string()
      .min(3, "সর্বনিম্ন ৩ অক্ষর থাকতে হবে")
      .required("এডমিনের নাম দিন"),
    address: Yup.string()
      .min(3, "সর্বনিম্ন ৩ অক্ষর থাকতে হবে")
      .max(100, "সর্বোচ্চ ১০০ অক্ষর থাকতে হবে")
      .required("আপনার ঠিকানা দিন"),
    mobile: Yup.string()
      .min(11, "এগারো  ডিজিট এর সঠিক নম্বর দিন ")
      .max(11, "এগারো  ডিজিট এর বেশি হয়ে গেছে  ")
      .required("আপনার মোবাইল নম্বর দিন "),
    email: Yup.string().email("ইমেইল সঠিক নয় ").required("আপনার ইমেইল দিন"),

    refName: Yup.string().min(3, "সর্বনিম্ন ৩টা অক্ষর থাকতে হবে"),
    refMobile: Yup.string()
      .min(11, "এগারো  ডিজিট এর সঠিক নম্বর দিন ")
      .max(11, "নাম্বার ১১ ডিজিট এর বেশি হয়ে  গেছে "),
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
    console.log(userData);

    // asyncRegister(userData, setLoading);
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
                  <h3 className="mb-4">রেজিস্ট্রেশন করুন </h3>
                  <Form>
                    <TextField
                      label="*প্রতিষ্ঠান এর নাম"
                      name="company"
                      type="text"
                    />
                    <TextField label="*এডমিনের নাম" name="name" type="text" />
                    <TextField label="*মোবাইল" name="mobile" type="text" />
                    <TextField label="*ইমেইল" name="email" type="email" />
                    <TextField label="*ঠিকানা" name="address" type="text" />

                    {/* Options */}
                    <div className="discount">
                      <span className="disspan">
                        {" "}
                        <strong className="disStrong">{discount}%</strong>{" "}
                        ডিসকাউন্ট
                      </span>
                    </div>
                    <label className="form-label mt-2">
                      আপনার পছন্দের প্যাকেজ সিলেক্ট করুন
                    </label>

                    {/* <option value="">প্যাকেজ সিলেক্ট করুন</option> */}
                    <div className="radiopak">
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
                    </div>

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
                      <span>কাস্টমারঃ {singlePakage[0].customer}</span>
                      <span className="insFeespan">
                        ইনস্টলেশন ফিঃ{" "}
                        {discount > 0 ? (
                          <span
                            className={
                              discount > 0 ? "strikethrough" : "mainfee"
                            }
                          >
                            {singlePakage[0].installation}
                          </span>
                        ) : (
                          ""
                        )}
                        <span className="mainfee">
                          {singlePakage[0].installation -
                            (singlePakage[0].installation * discount) / 100}
                        </span>
                      </span>
                      <span>মাসিক ফিঃ {singlePakage[0].monthly}</span>
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
                          label="রেফারেন্স এর নাম"
                          name="refName"
                          type="text"
                        />
                        <TextField
                          label="রেফারেন্স এর মোবাইল"
                          name="refMobile"
                          type="text"
                        />
                      </div>
                    </div>

                    <button type="submit" className="submitBtn">
                      {isLoading ? <Loader></Loader> : "রেজিস্টার"}
                    </button>
                    <NavLink to="/">
                      <button
                        className="w-45 btn  btn-secondary registerCacleBtn"
                        type="button"
                      >
                        বাতিল
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
