import React from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import "../../collector/collector.css";
import { FtextField } from "../../../components/common/FtextField";
import { postLineman } from "../../../features/linemanSlice";
import { fetchLineman } from "../../../features/linemanSlice";

export default function LinemanPOST() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // customer validator
  const linemanValidator = Yup.object({
    name: Yup.string().required("নাম দিন"),
    mobile: Yup.string()
      .min(11, "এগারো  ডিজিট এর সঠিক নম্বর দিন ")
      .max(11, "এগারো  ডিজিট এর বেশি হয়ে গেছে ")
      .required("মোবাইল নম্বর দিন "),
    address: Yup.string().required("নাম দিন"),
    email: Yup.string()
      .email("ইমেইল সঠিক নয় ")
      .required("ম্যানেজার এর ইমেইল দিতে হবে"),
    nid: Yup.string().required("NID দিন"),
    status: Yup.string().required("Choose one"),
  });

  const linemanHandler = (data) => {
    const { ispOwner } = auth;
    const mainData = {
      ispOwner: ispOwner.id,
      ...data,
    };
    postLineman(mainData);
    dispatch(fetchLineman(ispOwner.id));
  };

  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="linemanModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                নতুন লাইন-ম্যান অ্যাড করুন
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
                  // customerid: "random123",
                  name: "",
                  mobile: "",
                  address: "",
                  email: "",
                  nid: "",
                  status: "",
                  // ispOwner:
                }}
                validationSchema={linemanValidator}
                onSubmit={(values) => {
                  linemanHandler(values);
                }}
              >
                {(formik) => (
                  <Form>
                    <FtextField type="text" label="নাম" name="name" />
                    <FtextField type="text" label="মোবাইল" name="mobile" />
                    <FtextField type="text" label="এড্রেস" name="address" />
                    <FtextField type="text" label="ইমেইল" name="email" />
                    <FtextField type="text" label="NID নম্বর" name="nid" />
                    <div className="form-check customerFormCheck">
                      <p>স্টেটাস</p>
                      <div className="form-check form-check-inline">
                        <FtextField
                          label="Active"
                          className="form-check-input"
                          type="radio"
                          name="status"
                          id="status2"
                          value="active"
                        />
                      </div>
                      <div className="form-check form-check-inline">
                        <FtextField
                          label="Inactive"
                          className="form-check-input"
                          type="radio"
                          name="status"
                          id="status3"
                          value="inactive"
                        />
                      </div>
                    </div>

                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        বাতিল করুন
                      </button>
                      <button type="submit" className="btn btn-success">
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
    </div>
  );
}
