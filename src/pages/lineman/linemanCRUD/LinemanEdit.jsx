import React from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";

// internal imports
import "../../collector/collector.css";
import "../../Customer/customer.css";
import { FtextField } from "../../../components/common/FtextField";
import { editLineman } from "../../../features/linemanSlice";

export default function LinemanEdit() {
  const auth = useSelector((state) => state.auth);
  const LINEMAN = useSelector((state) => state.lineman.singleLineman);
  // customer validator
  const customerEditValidator = Yup.object({
    name: Yup.string().required("নাম দিন"),
    mobile: Yup.string()
      .min(11, "এগারো  ডিজিট এর সঠিক নম্বর দিন ")
      .max(11, "এগারো  ডিজিট এর বেশি হয়ে গেছে ")
      .required("মোবাইল নম্বর দিন "),
    address: Yup.string().required("নাম দিন"),
    email: Yup.string().email("ইমেইল সঠিক নয় ").required("ইমেইল দিতে হবে"),
    nid: Yup.string().required("NID দিন"),
    status: Yup.string().required("Choose one"),
  });

  const linemanEditHandler = (data) => {
    const { ispOwner } = auth;
    const mainData = {
      linemanID: LINEMAN.id,
      ispID: ispOwner.id,
      ispOwner: ispOwner.id,
      ...data,
    };

    console.log(mainData);
    editLineman(mainData);
  };

  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="linemanEditModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {`${LINEMAN.name}`} এর তথ্য এডিট করুন
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
                  name: LINEMAN.name,
                  mobile: LINEMAN.mobile,
                  address: LINEMAN.address,
                  email: LINEMAN.email,
                  nid: LINEMAN.nid,
                  status: LINEMAN.status,
                }}
                validationSchema={customerEditValidator}
                onSubmit={(values) => {
                  linemanEditHandler(values);
                }}
                enableReinitialize
              >
                {(lm) => (
                  <Form>
                    <FtextField
                      type="text"
                      label={`নাম`}
                      name="name"
                      //   value={LINEMAN.name}
                    />
                    <FtextField type="text" label={`মোবাইল`} name="mobile" />
                    <FtextField type="text" label={`এড্রেস`} name="address" />
                    <FtextField type="text" label={`ইমেইল`} name="email" />
                    <FtextField type="text" label={`NID নম্বর`} name="nid" />
                    <div className="form-check customerFormCheck">
                      <p>স্টেটাস</p>
                      <div className="form-check form-check-inline">
                        <FtextField
                          label="Active"
                          className="form-check-input"
                          type="radio"
                          name="status"
                          id="status1"
                          value="active"
                        />
                      </div>
                      <div className="form-check form-check-inline">
                        <FtextField
                          label="Inactive"
                          className="form-check-input"
                          type="radio"
                          name="status"
                          id="status2"
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
