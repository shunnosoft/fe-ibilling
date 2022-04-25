import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import * as Yup from "yup";

// internal imports
import "../../collector/collector.css";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import { Card } from "react-bootstrap";
import { addStaff, updateStaffApi } from "../../../features/apiCallStaff";

export default function StaffEdit({ staffId }) {
  const [isLoading, setIsLoading] = useState(false);
  const auth = useSelector((state) => state.persistedReducer.auth.currentUser);
  const dispatch = useDispatch();
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  const staffData = useSelector((state) =>
    state.persistedReducer.staff.staff.find((item) => item.id === staffId)
  );

  //validator
  const resellerValidator = Yup.object({
    name: Yup.string().required("নাম দিন"),
    mobile: Yup.string()
      .min(11, "এগারো  ডিজিট এর সঠিক নম্বর দিন ")
      .max(11, "এগারো  ডিজিট এর বেশি হয়ে গেছে ")
      .required("মোবাইল নম্বর দিন "),
    email: Yup.string().email("ইমেইল সঠিক নয় "),
    nid: Yup.string(),
    website: Yup.string(),
    address: Yup.string(),
  });

  const staffHandler = (data, resetForm) => {
    const sendingData = {
      name: data.name,
      mobile: data.mobile,
      email: data.email,
      fatherName: data.fatherName,
      address: data.address,
      nid: data.nid,
      status: data.status,
      reference: {
        name: data.refName,
        mobile: data.refMobile,
        email: data.refEmail,
        address: data.refAddress,
        relation: data.refRelation,
        nid: data.refNid,
      },
    };
    updateStaffApi(dispatch, staffId, sendingData, setIsLoading);
  };
  const status = ["new", "active", "inactive", "banned", "deleted"];

  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="staffEditModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                কর্মচারী আপডেট করুন
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {/* model body here */}
              <Formik
                initialValues={{
                  name: staffData?.name || "",
                  mobile: staffData?.mobile || "",
                  email: staffData?.email || "",
                  fatherName: staffData?.name || "",
                  nid: staffData?.nid || "",
                  address: staffData?.address || "",
                  refName: staffData?.reference.name || "",
                  refMobile: staffData?.reference.mobile || "",
                  refEmail: staffData?.reference.email || "",
                  refAddress: staffData?.reference.address || "",
                  refRelation: staffData?.reference.relation || "",
                  refNid: staffData?.reference.data || "",
                  status: staffData?.status,
                }}
                validationSchema={resellerValidator}
                onSubmit={(values, { resetForm }) => {
                  staffHandler(values, resetForm);
                }}
                enableReinitialize
              >
                {(formik) => (
                  <Form>
                    {/* first part */}

                    <div className="displayGrid3">
                      <FtextField type="text" label="নাম" name="name" />
                      <FtextField type="text" label="মোবাইল" name="mobile" />
                      <FtextField type="text" label="ইমেইল" name="email" />
                    </div>

                    <div className="displayGrid3">
                      <FtextField
                        type="text"
                        label="পিতার নাম"
                        name="fatherName"
                      />
                      <FtextField type="text" label="NID নম্বর" name="nid" />
                      <FtextField type="text" label="ঠিকানা" name="address" />
                    </div>
                    <p className="radioTitle">স্ট্যাটাস</p>
                    <div className="form-check d-flex">
                      {status.map((value, key) => (
                        <div key={key} className="form-check">
                          <FtextField
                            label={value}
                            className="form-check-input"
                            type="radio"
                            name="status"
                            value={value}
                          />
                        </div>
                      ))}
                    </div>

                    <Card>
                      <Card.Body>
                        <Card.Title>রেফারেন্সকারীর তথ্য দিন</Card.Title>
                        <Card.Text>
                          <div className="displayGrid3">
                            <FtextField
                              type="text"
                              label="রেফারেন্স নাম"
                              name="refName"
                            />
                            <FtextField
                              type="text"
                              label="রেফারেন্স মোবাইল"
                              name="refMobile"
                            />
                            <FtextField
                              type="text"
                              label="রেফারেন্স্কারীর ইমেইল"
                              name="refEmail"
                            />
                          </div>

                          <div className="displayGrid3">
                            <FtextField
                              type="text"
                              label="রেফারেন্সকারীর NID নম্বর"
                              name="refNid"
                            />
                            <FtextField
                              type="text"
                              label="রেফারেন্সকারীর এড্রেস"
                              name="refAddress"
                            />
                            <FtextField
                              type="text"
                              label="রেফারেন্স রিলেশন"
                              name="refRelation"
                            />
                          </div>
                        </Card.Text>
                      </Card.Body>
                    </Card>

                    <div className="modal-footer modalFooterEdit">
                      <button
                        type="submit"
                        className="btn btn-success"
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader /> : "সেভ করুন"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        disabled={isLoading}
                      >
                        বাতিল করুন
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
