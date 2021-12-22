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

export default function Register() {
  const [packValue, setPackValue] = useState("");

  const validate = Yup.object({
    company: Yup.string()
      .min(3, "সর্বনিম্ন ৩টা অক্ষর থাকতে হবে ")
      .required("কোম্পানির নাম দিন"),
    name: Yup.string()
      .min(3, "সর্বনিম্ন ৩টা অক্ষর থাকতে হবে")
      .required("আপনার নাম দিন"),
    mobile: Yup.string()
      .min(11, "এগারো  ডিজিট এর সঠিক নম্বর দিন ")
      .max(11, "এগারো  ডিজিট এর বেশি হয়ে গেছে  ")
      .required("আপনার মোবাইল নম্বর দিন "),
    email: Yup.string()
      .email("ইমেইল সঠিক নয় ")
      .required("আপনার ইমেইল দিতে হবে"),
    refName: Yup.string()
      .min(3, "সর্বনিম্ন ৩টা অক্ষর থাকতে হবে")
      .required("রেফারেন্সএর  নাম দিন"),
    refMobile: Yup.string()
      .min(11, "এগারো  ডিজিট এর সঠিক নম্বর দিন ")
      .max(11, "নাম্বার ১১ ডিজিট এর বেশি হয়ে  গেছে ")
      .required("রেফারেন্সএর  মোবাইল নম্বর দিন "),
  });

  const submitHandle = (values) => {
    const selector = document.getElementById("selector");
    const loader = document.querySelector(".Loader");

    loader.style.display = "block";

    if (packValue === "") {
      alert("Select Pack");
      document.querySelector(".Loader").style.display = "none";
      return;
    }

    // const { refName, refMobile, ...rest } = values;
    let userData = {};

    if (selector.value === "P4") {
      const { refName, refMobile, ...rest } = values;
      userData = {
        ...rest,
        pack: packValue,
        reference: {
          name: refName,
          mobile: refMobile,
        },
      };
    } else {
      const { refName, maxUser, refMobile, ...rest } = values;
      userData = {
        ...rest,
        pack: packValue,
        reference: {
          name: refName,
          mobile: refMobile,
        },
      };
    }
    // send user data to async function
    asyncRegister(userData);
  };

  // show customer field
  let showField = () => {
    const selector = document.getElementById("selector");
    const customer = document.getElementById("get_customer");

    setPackValue(selector.value);

    if (selector.value === "P4") {
      customer.style.display = "block";
    } else {
      document.getElementById("maxUserValue").value = "";
      customer.style.display = "none";
    }
  };

  return (
    <FontColor>
      <div className="register">
        <div className="Loader"></div>
        <ToastContainer />
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
                  <h2>Registration</h2>
                  <Form>
                    <TextField
                      label="কোম্পানির  নাম"
                      name="company"
                      type="text"
                    />
                    <TextField label="নিজের নাম" name="name" type="text" />
                    <TextField label="মোবাইল" name="mobile" type="text" />
                    <TextField label="ইমেইল" name="email" type="email" />

                    {/* Options */}
                    <label className="form-label mt-2">
                      আপনার পছন্দের প্যাকেজ সিলেক্ট করুন
                    </label>
                    <select
                      name="package"
                      className="form-select shadow-none"
                      id="selector"
                      onChange={showField}
                    >
                      <option value="">ওপেন </option>
                      <option value="Basic">Basic</option>
                      <option value="Bronze">Bronze</option>
                      <option value="Silver">Silver</option>
                      <option value="Gold">Gold</option>
                      <option value="Platinum">Platinum</option>
                      <option value="Diamond">Diamond</option>
                      <option value="Old">Old</option>
                      <option value="P1">P1</option>
                      <option value="P2">P2</option>
                      <option value="P3">P3</option>
                      <option value="P4">P4</option>
                    </select>

                    <div className="form-outline" id="get_customer">
                      <TextField
                        id="maxUserValue"
                        label="কাস্টমার সংখ্যা"
                        name="maxUser"
                        type="number"
                      />
                    </div>
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
                      রেজিস্টার
                    </button>
                    <NavLink to="/">
                      <button
                        className="w-45 btn  btn-secondary registerCacleBtn"
                        type="button"
                      >
                        Cancel
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
