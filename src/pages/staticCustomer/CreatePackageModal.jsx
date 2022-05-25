import React, { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
// internal imports
// import { collectorData } from "../CollectorInputs";
import "../Customer/customer.css";
// import { FtextField } from "../../../components/common/FtextField";
import { FtextField } from "../../components/common/FtextField";
import Loader from "../../components/common/Loader";
import { addQueuePackage } from "../../features/apiCalls";

export default function CreatePackage() {
  // import dispatch
  const dispatch = useDispatch();
  // const area = useSelector((state) => state.persistedReducer.area.area);

  // const [areaIds, setAreaIds] = useState([]);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // const auth = useSelector((state) => state.persistedReducer.auth.currentUser);

  // get isp owner id in state
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // get mikrotik
  const mikrotik = useSelector(
    (state) => state?.persistedReducer?.mikrotik?.mikrotik
  );

  // form validator
  const collectorValidator = Yup.object({
    mikrotik: Yup.string().required("মাইক্রোটিক সিলেক্ট করুন"),
    name: Yup.string().required("প্যাকেজ এর নাম দিন"),

    rate: Yup.number()
      .integer()
      .min(1, "সর্বনিম্ন প্যাকেজ রেট 1")
      .required("প্যাকেজ রেট দিন"),

    // refName: Yup.string().required("রেফারেন্স নাম"),
    // refMobile: Yup.string()
    //   .min(11, "এগারো  ডিজিট এর সঠিক নম্বর দিন ")
    //   .max(11, "এগারো  ডিজিট এর বেশি হয়ে গেছে ")
    //   .required("মোবাইল নম্বর দিন "),
  });

  // add package gunction
  const packageAddHandler = (data) => {
    // console.log(data);
    const sendingData = {
      ...data,
      ispOwner: ispOwnerId,
      packageType: "queue",
    };

    // add api call
    addQueuePackage(sendingData, dispatch, setIsLoading);
  };

  return (
    <div>
      {/* Model start */}
      <div
        className="modal fade modal-dialog-scrollable "
        id="createPackage"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                নতুন স্ট্যাটিক প্যাকেজ
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
                  rate: 1,
                  mikrotik: "",
                }}
                validationSchema={collectorValidator}
                onSubmit={(values) => {
                  packageAddHandler(values);
                }}
                enableReinitialize
              >
                {() => (
                  <Form>
                    <div className="collectorInputs">
                      <div
                        className="newDisplayforpackage"
                        style={{ alignItems: "start" }}
                      >
                        <div className="mb-3 w-100">
                          <label
                            htmlFor="mikrotik"
                            className="changeLabelFontColor"
                          >
                            মাইক্রোটিক
                          </label>
                          <Field
                            className="form-select select-box"
                            as="select"
                            name="mikrotik"
                            aria-label="Default select example"
                          >
                            <option disabled selected></option>
                            {mikrotik.map((item) => (
                              <option value={item?.id}>{item?.name}</option>
                            ))}
                          </Field>
                          <ErrorMessage
                            component="div"
                            name="mikrotik"
                            className="errorMessage"
                          />
                        </div>

                        <FtextField
                          type="text"
                          label="প্যাকেজ এর নাম"
                          name="name"
                        />
                        <FtextField
                          min={0}
                          type="number"
                          label="প্যাকেজ রেট"
                          name="rate"
                        />
                      </div>
                    </div>

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
