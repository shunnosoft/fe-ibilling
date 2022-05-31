import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import { singleCustomerMsg } from "../../../features/customerApi";

// customer validator
const customerValidator = Yup.object({
  message: Yup.string().required("গ্রাহকের নাম লিখুন"),
});

const CustomerMessage = ({ single }) => {
  console.log(single);
  // get all customer
  const customer = useSelector(
    (state) => state?.persistedReducer?.customer?.customer
  );
  console.log(customer);

  // find editable data
  const data = customer.find((item) => item.id === single);
  console.log(data);

  const [isLoading, setIsloading] = useState(false);

  const messageHandler = (formValue) => {
    const sendingData = {
      msg: formValue.message,
      mobile: data.mobile,
    };
    singleCustomerMsg(sendingData, setIsloading);
  };
  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="customerMessageModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {data?.name} কে মেসেজ করুন
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
                  message: "",
                }}
                validationSchema={customerValidator}
                onSubmit={(values) => {
                  messageHandler(values);
                }}
                enableReinitialize
              >
                {(formik) => (
                  <Form>
                    <FtextField type="text" label="মেসেজ" name="message" />

                    <div className="modal-footer" style={{ border: "none" }}>
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
                        className="btn btn-success"
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
};

export default CustomerMessage;
