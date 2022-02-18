import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import Loader from "../../../components/common/Loader";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import { collectorData } from "../CollectorInputs";
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
  const [subArea, setSubArea] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const auth = useSelector((state) => state.auth.currentUser);

  //validator
  const collectorValidator = Yup.object({
    name: Yup.string().required("নাম দিন"),
    mobile: Yup.string()
      .min(11, "এগারো  ডিজিট এর সঠিক নম্বর দিন ")
      .max(11, "এগারো  ডিজিট এর বেশি হয়ে গেছে ")
      .required("মোবাইল নম্বর দিন "),
    address: Yup.string().required("ঠিকানা দিন"),
    email: Yup.string().email("ইমেইল সঠিক নয় ").required("ইমেইল দিন"),
    nid: Yup.string().required("জাতীয় পরিচয়পত্র নম্বর"),
    status: Yup.string().required("স্টেটাস দিন"),
    // refName: Yup.string().required("রেফারেন্স নাম"),
    // refMobile: Yup.string()
    //   .min(11, "এগারো  ডিজিট এর সঠিক নম্বর দিন ")
    //   .max(11, "এগারো  ডিজিট এর বেশি হয়ে গেছে ")
    //   .required("মোবাইল নম্বর দিন "),
  });

  // fetch Area fro select option
  // useEffect(() => {
  //   if (auth.ispOwner) {
  //     dispatch(fetchArea(auth.ispOwner.id));
  //   }
  // }, [dispatch, auth.ispOwner]);

  // select subArea
  const selectSubArea = (data) => {
    const areaId = data.target.value;
    if (area) {
      const temp = area.find((val) => {
        return val.id === areaId;
      });
      setSubArea(temp);
    }
  };

  const collectorPostHandler = async (data) => {
    setIsLoading(true);
    const OneSubArea = document.getElementById("subAreaId").value;
    if (OneSubArea === "") {
      setIsLoading(false);
      return alert("সাব-এরিয়া সিলেক্ট করতে হবে");
    }
    if (auth.ispOwner) {
      const sendingData = {
        ...data,
        areas: OneSubArea,
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
                    <hr />
                    <p>এরিয়া সিলেক্ট করুন</p>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      onChange={selectSubArea}
                    >
                      <option value="">...</option>
                      {area.length === undefined
                        ? ""
                        : area.map((val, key) => (
                            <option key={key} value={val.id}>
                              {val.name}
                            </option>
                          ))}
                    </select>
                    <br />
                    <p>
                      {subArea ? subArea.name + " এর - " : ""} সাব-এরিয়া সিলেক্ট
                      করুন
                    </p>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      name="subArea"
                      id="subAreaId"
                    >
                      <option value="">...</option>
                      {subArea?.subAreas
                        ? subArea.subAreas.map((val, key) => (
                            <option key={key} value={val.id}>
                              {val.name}
                            </option>
                          ))
                        : ""}
                    </select>
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
