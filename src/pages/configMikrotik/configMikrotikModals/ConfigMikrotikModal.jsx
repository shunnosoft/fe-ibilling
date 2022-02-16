import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";

// internal imports
import "../../collector/collector.css";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import { editSingleMikrotik } from "../../../features/apiCalls";
// import {
//   fetchSingleMikrotik,
//   editSingleMikrotik,
// } from "../../../features/mikrotikSlice";

export default function ConfigMikrotikModal(props) {
  // const auth = useSelector((state) => state.auth.currentUser);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { mik } = props;

  //validator
  const mikrotikValidator = Yup.object({
    name: Yup.string().required("নাম দিতে হবে"),
    username: Yup.string().required("ইউজারনেম দিতে হবে "),
    host: Yup.string().required("মাইক্রোটিক আইপি দিতে হবে"),
    port: Yup.string().required("পোর্ট দিতে হবে"),
    password: Yup.string().required("পাসওয়ার্ড দিতে হবে"),
  });

  const mikrotikHandler = async (data) => {
    setIsLoading(true);
    if (mik) {
      const sendingData = {
        ...data,
        id: mik.id,
        ispOwner: mik.ispOwner,
        ispId: mik.ispOwner,
      };

       editSingleMikrotik(dispatch,sendingData)
    setIsLoading(false);

      
    }
  };

  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="configMikrotikModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                মাইক্রোটিক এডিট করুন
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
                  name: mik.name || "",
                  username: mik.username || "",
                  host: mik.host || "",
                  port: mik.port || "",
                  password: "",
                }}
                validationSchema={mikrotikValidator}
                onSubmit={(values) => {
                  mikrotikHandler(values);
                }}
                enableReinitialize
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
                    <FtextField
                      type="password"
                      label="পাসওয়ার্ড"
                      name="password"
                    />

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
