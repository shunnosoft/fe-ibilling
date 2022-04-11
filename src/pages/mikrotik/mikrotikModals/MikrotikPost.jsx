import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";

// internal imports
import "../../collector/collector.css";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import { postMikrotik } from "../../../features/apiCalls";
// import { postMikrotik } from "../../../features/mikrotikSlice";
// import { fetchMikrotik } from "../../../features/mikrotikSlice";

export default function MikrotikPost() {
  const auth = useSelector((state) => state.persistedReducer.auth.currentUser);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  //validator
  const mikrotikValidator = Yup.object({
    name: Yup.string().required("নাম দিতে হবে"),
    username: Yup.string().required("ইউজারনেম দিতে হবে "),
    host: Yup.string().required("মাইক্রোটিক আইপি দিতে হবে"),
    port: Yup.string().required("পোর্ট দিতে হবে"),
    password: Yup.string().required("পাসওয়ার্ড দিতে হবে"),
  });

  // mikrotik handler
  const mikrotikHandler = (data) => {
    if (auth.ispOwner) {
      const sendingData = {
        ...data,
        ispOwner: auth.ispOwner.id,
      };
      postMikrotik(dispatch, sendingData, setIsLoading);
    }
  };

  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="MikrotikModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                নতুন মাইক্রোটিক অ্যাড করুন
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
                  name: "",
                  username: "",
                  host: "",
                  port: "",
                  password: "",
                }}
                validationSchema={mikrotikValidator}
                onSubmit={(values) => {
                  mikrotikHandler(values);
                }}
              >
                {() => (
                  <Form>
                    <FtextField type="text" label="নাম" name="name" />
                    <FtextField type="text" label="ইউজারনেম" name="username" />
                    <FtextField
                      type="text"
                      label="মাইক্রোটিক আইপি"
                      name="host"
                    />
                    <FtextField type="text" label="পোর্ট" name="port" />
                    <FtextField type="password" label="পাসওয়ার্ড" name="password" />

                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        বাতিল করুন
                      </button>
                      <button type="submit" className="btn btn-success">
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
    </div>
  );
}
