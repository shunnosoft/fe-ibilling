import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import * as Yup from "yup";

// internal imports
import "../../collector/collector.css";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import { addSalaryApi } from "../../../features/apiCallStaff";

export default function StaffSalaryPostModal({ staffId }) {
  const [isLoading, setIsLoading] = useState(false);
  const auth = useSelector((state) => state.persistedReducer.auth.currentUser);
  const dispatch = useDispatch();
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  //validator
  const salaryValidaiton = Yup.object({
    amount: Yup.string().required("এমাউন্ট দিন"),
    due: Yup.string().required("বকেয়া উল্লেখ করুন না থাকলে 0 দিন"),
  });

  const staffSalaryHandler = (data, resetForm) => {
    const { amount, due, remarks } = data;
    const date = data.date.split("-");
    const year = date[0];
    const month = date[1];
    const sendingData = {
      amount,
      due,
      remarks,
      year,
      month,
      ispOwner,
      staff: staffId,
    };
    // console.log(sendingData);
    addSalaryApi(dispatch, sendingData, resetForm, setIsLoading);
  };

  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="addSalaryPostModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                স্যালারি অ্যাড করুন
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
                  amount: "",
                  due: "",
                  date: "",
                  remarks: "",
                }}
                validationSchema={salaryValidaiton}
                onSubmit={(values, { resetForm }) => {
                  staffSalaryHandler(values, resetForm);
                }}
                enableReinitialize
              >
                {(formik) => (
                  <Form className="p-5">
                    {/* first part */}

                    <div className="displayGrid3">
                      <FtextField type="text" label="এমাউন্ট" name="amount" />
                      <FtextField type="text" label="বকেয়া" name="due" />
                      <FtextField
                        type="date"
                        label="মাস এবং বছর সিলেক্ট করুন"
                        name="date"
                      />
                    </div>

                    <FtextField type="text" label="মন্তব্য" name="remarks" />

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
