import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import Loader from "../../../components/common/Loader";
import { useSelector, useDispatch } from "react-redux";

// internal importsp
import { collectorData } from "../CollectorInputs";
import { FtextField } from "../../../components/common/FtextField";
import { editCollector } from "../../../features/apiCalls";
import { collectorPermission } from "./collectorPermission";
// import { getArea } from "../../../features/areaSlice";
// import {
//   editCollector,
//   fetchCollector,
// } from "../../../features/collectorSlice";

export default function CollectorEdit({ single }) {
  const dispatch = useDispatch();
  const area = useSelector((state) => state.persistedReducer.area.area);
  const [allowedAreas, setAllowedAreas] = useState([]);
  const [areaIds_Edit, setAreaIds_Edit] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    if (single) {
      setAllowedAreas(single?.areas);
      setPermissions(collectorPermission(single.permissions));
    }
  }, [single]);

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
  });

  const setAreaHandler = () => {
    const temp = document.querySelectorAll(".getValueUsingClass_Edit");
    let IDS_temp = [];
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].checked === true) {
        IDS_temp.push(temp[i].value);
      }
    }
    setAllowedAreas(IDS_temp);
    setAreaIds_Edit(IDS_temp);
  };

  const collectorEditHandler = async (data) => {
    setIsLoading(true);
    let temp = {};
    permissions.forEach((val) => {
      temp[val.value] = val.isChecked;
    });
    const newP = {
      ...single.permissions,
      ...temp,
    };
    if (single.ispOwner) {
      const sendingData = {
        ...data,
        areas: areaIds_Edit,
        ispOwner: single.ispOwner,
        ispOwnerId: single.ispOwner,
        collectorId: single.id,
        permissions: newP,
      };
      editCollector(dispatch, sendingData, setIsLoading);
    }
  };

  const handleChange = (e) => {
    const { name, checked } = e.target;
    let temp = permissions.map((val) =>
      val.value === name ? { ...val, isChecked: checked } : val
    );

    setPermissions(temp);
  };
  return (
    <div>
      {/* Model start */}
      <div
        className="modal fade modal-dialog-scrollable "
        id="collectorEditModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {single?.name} - এর প্রোফাইল এডিট করুন
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
                  name: single.name || "",
                  mobile: single.mobile || "",
                  address: single.address || "",
                  email: single.email || "",
                  nid: single.nid || "",
                  status: single.status || "",
                  //   refName: "N/A" || "",
                  //   refMobile: "N/A" || "",
                  // areas: single?.areas || [],
                }}
                validationSchema={collectorValidator}
                onSubmit={(values) => {
                  collectorEditHandler(values);
                }}
                enableReinitialize
              >
                {(formik) => (
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
                    <b className="mt-2">এরিয়া সিলেক্ট</b>
                    <div className="AllAreaClass">
                      {area?.map((val, key) => (
                        <div key={key}>
                          <h6 className="areaParent">{val.name}</h6>
                          {val.subAreas.map((v, k) => (
                            <div key={k} className="displayFlex">
                              <input
                                type="checkbox"
                                className="getValueUsingClass_Edit"
                                value={v.id}
                                checked={
                                  allowedAreas?.includes(v.id) ? true : false
                                }
                                onChange={setAreaHandler}
                              />
                              <label>{v.name}</label>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>

                    <b className="mt-2">পারমিশান পরিবর্তন করুন</b>
                    <div className="AllAreaClass">
                      {permissions.map((val, key) => (
                        <div className="CheckboxContainer" key={key}>
                          <input
                            type="checkbox"
                            className="CheckBox"
                            name={val.value}
                            checked={val.isChecked}
                            onChange={handleChange}
                          />
                          <label className="checkboxLabel">{val.label}</label>
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
