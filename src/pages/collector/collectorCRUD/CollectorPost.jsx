import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import Loader from "../../../components/common/Loader";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import { collectorData } from "../CollectorInputs";
import "../../Customer/customer.css";
import { FtextField } from "../../../components/common/FtextField";
import { addCollector } from "../../../features/apiCalls";
// import { getArea, fetchArea } from "../../../features/areaSlice";
// import {
//   postCollector,
//   fetchCollector,
// } from "../../../features/collectorSlice";

export default function CollectorPost() {
  const dispatch = useDispatch();
  const area = useSelector((state) => state.area.area);
  const [areaIds, setAreaIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useSelector((state) => state.auth.currentUser);

  //validator
  const collectorValidator = Yup.object({
    name: Yup.string().required("নাম ***"),
    mobile: Yup.string()
      .min(11, "এগারো  ডিজিট এর সঠিক নম্বর *** ")
      .max(11, "এগারো  ডিজিট এর বেশি হয়ে গেছে ")
      .required("মোবাইল নম্বর *** "),
    address: Yup.string().required("ঠিকানা ***"),
    email: Yup.string().email("ইমেইল সঠিক নয় ").required("ইমেইল ***"),
    nid: Yup.string().required("জাতীয় পরিচয়পত্র নম্বর"),
    status: Yup.string().required("স্টেটাস ***"),
    // refName: Yup.string().required("রেফারেন্স নাম"),
    // refMobile: Yup.string()
    //   .min(11, "এগারো  ডিজিট এর সঠিক নম্বর দিন ")
    //   .max(11, "এগারো  ডিজিট এর বেশি হয়ে গেছে ")
    //   .required("মোবাইল নম্বর দিন "),
  });

  const setAreaHandler = () => {
    const temp = document.querySelectorAll(".getValueUsingClass");
    let IDS_temp = [];
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].checked === true) {
        IDS_temp.push(temp[i].value);
      }
    }
    setAreaIds(IDS_temp);
  };

  const collectorPostHandler = async (data) => {
    setIsLoading(true);
    if (auth.ispOwner) {
      const sendingData = {
        ...data,
        areas: areaIds,
        ispOwner: auth.ispOwner.id,
      };
      addCollector(dispatch, sendingData, setIsLoading);
    }
  };

  return (
    <div>
      {/* Model start */}
      <div
        className="modal fade modal-dialog-scrollable "
        id="collectorModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                নতুন কালেক্টর অ্যাড
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <Formik
                initialValues={{
                  name: "",
                  mobile: "",
                  address: "",
                  email: "",
                  nid: "",
                  status: "",
                  //   refName: "N/A" || "",
                  //   refMobile: "N/A" || "",
                }}
                validationSchema={collectorValidator}
                onSubmit={(values) => {
                  collectorPostHandler(values);
                }}
                enableReinitialize
              >
                {() => (
                  <Form>
                    <div className="collectorInputs">
                      {collectorData.map((val, key) => (
                        <FtextField
                          key={key}
                          type={val.type}
                          label={val.label}
                          name={val.name}
                        />
                      ))}

                      {/* status */}
                      <div className="form-check customerFormCheck">
                        <p>স্টেটাস</p>
                        <div className="form-check form-check-inline">
                          <FtextField
                            label="Active"
                            className="form-check-input"
                            type="radio"
                            name="status"
                            value="active"
                          />
                        </div>
                        <div className="form-check form-check-inline">
                          <FtextField
                            label="Inactive"
                            className="form-check-input"
                            type="radio"
                            name="status"
                            value="inactive"
                          />
                        </div>
                      </div>
                      {/* status */}
                    </div>

                    {/* area */}
                    {/* area section*/}
                    <b className="mt-2">এরিয়া সিলেক্ট</b>
                    <div className="AllAreaClass">
                      {area?.map((val, key) => (
                        <div key={key}>
                          <h6 className="areaParent">{val.name}</h6>
                          {val.subAreas.map((v, k) => (
                            <div key={k} className="displayFlex">
                              <input
                                type="checkbox"
                                className="getValueUsingClass"
                                value={v.id}
                                onChange={setAreaHandler}
                              />
                              <label>{v.name}</label>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                    {/* area */}
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        disabled={isLoading}
                      >
                        বাতিল করুন
                      </button>
                      <button
                        type="submit"
                        className="btn btn-success customBtn"
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader /> : "সেভ করুন"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>

      {/* Model finish */}
    </div>
  );
}
