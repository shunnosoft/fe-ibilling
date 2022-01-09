import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";

// internal imports
import { editManager } from "../../features/actions/managerHandle";
import { FtextField } from "../common/FtextField";

export default function WriteModals(props) {
  const { manager } = props;

  // mangager validator
  const managerValidate = Yup.object({
    name: Yup.string()
      .min(3, "সর্বনিম্ন ৩টা অক্ষর থাকতে হবে")
      .required("ম্যানেজার এর নাম দিন"),
    mobile: Yup.string()
      .min(11, "এগারো  ডিজিট এর সঠিক নম্বর দিন ")
      .max(11, "এগারো  ডিজিট এর বেশি হয়ে গেছে ")
      .required("ম্যানেজার এর মোবাইল নম্বর দিন "),
    address: Yup.string().required("ম্যানেজার এর  এড্রেস দিন "),
    email: Yup.string()
      .email("ইমেইল সঠিক নয় ")
      .required("ম্যানেজার এর ইমেইল দিতে হবে"),
    nid: Yup.string().required("ম্যানেজার এর NID দিন"),
    image: Yup.string(),
  });

  const editManagerHandler = (data) => {
    editManager(data);
  };

  return (
    <div
      className="modal fade modal-dialog-scrollable "
      id="writeModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title" id="exampleModalLabel">
              এডিট ম্যানেজার
            </h4>
            <button
              type="button"
              className="btn-close"
              id="closeAddManagerBtn"
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
                // photo: "",
              }}
              validationSchema={managerValidate}
              onSubmit={(values) => {
                editManagerHandler(values);
              }}
            >
              {(formik) => (
                <Form>
                  <FtextField
                    type="text"
                    label={`ম্যানেজার এর বর্তমান নাম = ${manager.name}`}
                    name="name"
                  />
                  <FtextField
                    type="text"
                    label={`ম্যানেজার এর বর্তমান মোবাইল নম্বর  = ${manager.mobile}`}
                    name="mobile"
                  />
                  <FtextField
                    type="text"
                    label={`ম্যানেজার এর বর্তমান এড্রেস = ${manager.address}`}
                    name="address"
                  />
                  <FtextField
                    type="email"
                    label={`ম্যানেজার এর বর্তমান ইমেইল = ${manager.email}`}
                    name="email"
                  />
                  <FtextField
                    type="text"
                    label={`ম্যানেজার এর বর্তমান NID নম্বর = ${manager.nid}`}
                    name="nid"
                  />
                  {/* <FtextField
                    type="file"
                    label="ম্যানেজার এর ছবি "
                    name="photo"
                  /> */}

                  {/* Button */}
                  <div className="submitSection">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary marginLeft"
                    >
                      সেভ করুন
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
