import { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";

// internal imports
// import "../../collector/collector.css";
import "../collector/collector.css";

import { FtextField } from "../../components/common/FtextField";
import Loader from "../../components/common/Loader";
import {
  addExpenditurePourpose,
  editExpenditurePourpose,
} from "../../features/apiCalls";

export default function EditPourpose({ singlePurpose }) {
  // console.log(singlePurpose);

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  //validator
  const linemanValidator = Yup.object({
    name: Yup.string().required("নাম দিন"),
  });

  // POST
  const purposeHandler = async (data, resetForm) => {
    const sendingData = {
      ...singlePurpose,
      name: data.name,
    };

    editExpenditurePourpose(dispatch, sendingData, setIsLoading, resetForm);
  };

  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="editPurpose"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                খরচ খাত এডিট করুন
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
                  name: singlePurpose.name,
                  // ispOwner:
                }}
                validationSchema={linemanValidator}
                onSubmit={(values, { resetForm }) => {
                  purposeHandler(values, resetForm);
                }}
                enableReinitialize
              >
                {(formik) => (
                  <Form>
                    <FtextField
                      type="text"
                      label=" খরচ খাতের নাম"
                      name="name"
                    />

                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
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
    </div>
  );
}
