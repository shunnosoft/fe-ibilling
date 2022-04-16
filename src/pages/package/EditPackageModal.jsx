import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";

// internal imports
// import { collectorData } from "../CollectorInputs";
import "../Customer/customer.css";
// import { FtextField } from "../../../components/common/FtextField";
import { FtextField } from "../../components/common/FtextField";
import Loader from "../../components/common/Loader";
import {  editPackagewithoutmikrotik } from "../../features/apiCalls";

export default function EditPackage(props) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const ispOwnerId =useSelector(state=>state.persistedReducer.auth.ispOwnerId)

  //validator
  const collectorValidator = Yup.object({
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

  const packageEditHandler = (data) => {

    const sendingData = {
      ...data,
      id:props.package.id,
      ispOwner:ispOwnerId
    };
    console.log(sendingData)

    editPackagewithoutmikrotik(sendingData,dispatch,setIsLoading)

  };

  return (
    <div>
      {/* Model start */}
      <div
        className="modal fade modal-dialog-scrollable "
        id="editPackage"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
               প্যাকেজ ইডিট
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
                  name: props.package.name,
                  rate: props.package.rate,
                }}
                validationSchema={collectorValidator}
                onSubmit={(values) => {
                  packageEditHandler(values);
                }}
                enableReinitialize
              >
                {() => (
                  <Form>
                    <div className="collectorInputs">
                      <div className="newDisplayforpackage">
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
