import React, { useEffect, useState } from "react";
import Loader from "../../../components/common/Loader";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import { getSingleIspOwner } from "../../../features/apiCallAdmin";

const InvoiceCreate = ({ ispOwnerId }) => {
  const dispatch = useDispatch();

  //get single ispOwner
  const ispOwnerData = useSelector((state) => state.admin?.singleIspOwner);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // package Type data state
  const [type, setType] = useState("");

  // message count data state
  const [messageType, setMessageType] = useState(
    "nonMasking" || "masking" || "fixedNumber"
  );

  // message prise state
  const [smsAmount, setSmsAmount] = useState(100);

  // sms count state
  const [smsCount, setSmsCount] = useState(
    Number(smsAmount) / ispOwnerData.smsRate
  );

  //get current date
  const getDay = new Date();
  const currentFirstDay = new Date(getDay.getFullYear(), getDay.getMonth(), 1);

  //invoice start and end date state
  const [startDate, setStartDate] = useState(currentFirstDay);
  const [endDate, setEndDate] = useState(getDay);

  //package customer limit state
  const [customerLimit, setCustomerLimit] = useState();

  //  isp owner form validation
  const validationSchema = Yup.object({
    smsBalance: Yup.string(),
    monthlyPaymentStatus: Yup.string(),
    paymentStatus: Yup.string(),
    pack: Yup.string(),
    customerLimit: Yup.string(),
    packageRate: Yup.string(),
  });

  //  set initial form values
  let initialValues;
  if (ispOwnerData) {
    initialValues = {
      pack: ispOwnerData?.bpSettings?.pack,
      customerLimit: ispOwnerData?.bpSettings?.customerLimit,
      status: "unpaid",
    };
    if (type === "registration") {
      initialValues.status = ispOwnerData?.bpSettings?.paymentStatus;
    }
    if (type === "monthlyServiceCharge") {
      initialValues.status = ispOwnerData?.bpSettings?.monthlyPaymentStatus;
    }
  }

  //  handle submit
  const invoiceCreateHandler = (values) => {
    console.log(values);
  };

  // message type change handler
  const changeHandler = (num) => {
    if (messageType === "nonMasking") {
      setSmsAmount(ispOwnerData.smsRate * num);
    } else if (messageType === "masking") {
      setSmsAmount(ispOwnerData.maskingSmsRate * num);
    } else if (messageType === "fixedNumber") {
      setSmsAmount(ispOwnerData.fixedNumberSmsRate * num);
    }
    setSmsCount(num);
  };
  // handler package ispOwner
  // const handleSubPackage = (e) => {
  //   console.log([JSON.parse(e.target.value)]);

  useEffect(() => {
    // message purchase
    if (messageType === "nonMasking") {
      setSmsAmount(ispOwnerData.smsRate * smsCount);
    } else if (messageType === "masking") {
      setSmsAmount(ispOwnerData.maskingSmsRate * smsCount);
    } else if (messageType === "fixedNumber") {
      setSmsAmount(ispOwnerData.fixedNumberSmsRate * smsCount);
    }
  }, [messageType]);

  useEffect(() => {
    if (ispOwnerId) {
      getSingleIspOwner(ispOwnerId, dispatch, setIsLoading);
    }
  }, [ispOwnerId]);

  return (
    <>
      <div
        className="modal fade"
        id="ispOwnerInvoiceCreate"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                style={{ color: "#0abb7a" }}
                className="modal-title"
                id="customerModalDetails"
              >
                Company Name: {ispOwnerData?.company}
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
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                  invoiceCreateHandler(values);
                }}
                enableReinitialize
              >
                {() => (
                  <Form>
                    <div className="row g-3">
                      <div className="col-md-6 form-group px-2">
                        <h6 className="mb-0">Select Type</h6>
                        <Field
                          className="form-select mw-100 mt-0"
                          as="select"
                          name="type"
                          aria-label="Default select example"
                          onChange={(e) => setType(e.target.value)}
                        >
                          <option value="">...</option>
                          <option value="smsPurchase">SMS Purchase</option>
                          <option value="registration">Registration</option>
                          <option value="monthlyServiceCharge">
                            Monthly Service Charge
                          </option>
                          <option value="migration">Migration</option>
                        </Field>
                      </div>

                      <div className="col-md-6 form-group px-2">
                        <h6 className="mb-0">Status</h6>
                        <Field
                          className="form-select mw-100 mt-0"
                          as="select"
                          name="status"
                          aria-label="Default select example"
                        >
                          <option value="paid">Paid</option>
                          <option selected value="unpaid">
                            Unpaid
                          </option>
                        </Field>
                      </div>

                      {type && type === "smsPurchase" && (
                        <>
                          <div className="col-md-6 form-group ">
                            <h6 className="mb-0">SMS Type</h6>
                            <Field
                              className="form-select mw-100 mt-0"
                              as="select"
                              name="smsType"
                              aria-label="Default select example"
                              onChange={(e) => setMessageType(e.target.value)}
                            >
                              <option selected value="nonMasking">
                                Non Masking
                              </option>
                              <option value="masking">Masking</option>
                              <option value="fixedNumber">Fixed</option>
                            </Field>
                          </div>

                          <div className="col-md-6 form-group mt-3">
                            <h6 className="mb-0">SMS</h6>
                            <Field
                              className="form-control"
                              type="number"
                              name="smsBalance"
                              onChange={(e) => changeHandler(e.target.value)}
                              value={smsCount}
                            />
                          </div>
                        </>
                      )}

                      {type && type === "migration" && (
                        <>
                          <div className="col-md-6 form-group ">
                            <h6 className="mb-0">Select Your Package</h6>
                            <Field
                              className="form-select mw-100 mt-0 fw-700"
                              name="pack"
                              aria-label="Default select example"
                              as="select"
                            >
                              <option value="">Select Package</option>
                              <option value="P1">P1</option>
                              <option value="P2">P2</option>
                              <option value="P3">P3</option>
                              <option value="P4">P4</option>
                              <option value="P5">P5</option>
                              <option value="P6">P6</option>
                              <option value="P7">P7</option>
                              <option value="P8">P8</option>
                              <option value="P9">P9</option>
                              <option value="P10">P10</option>
                              <option value="P11">P11</option>
                              <option value="P12">P12</option>
                              <option value="P13">P13</option>
                              <option value="P14">P14</option>
                              <option value="P15">P15</option>
                            </Field>
                          </div>

                          <div className="col-md-6 form-group">
                            <h6 className="mb-0">Customer Limit</h6>
                            <Field
                              className="form-control"
                              type="text"
                              name="customerLimit"
                            />
                          </div>
                        </>
                      )}

                      <div className="col-md-6 form-group px-2">
                        <h6 className="mb-0">Created Date</h6>
                        <DatePicker
                          className="form-control mw-100  me-3"
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          dateFormat="MMM dd yyyy"
                          placeholderText={"To"}
                          name="createdAt"
                        />
                      </div>

                      <div className="col-md-6 form-group px-2">
                        <h6 className="mb-0">Last Date</h6>
                        <DatePicker
                          className="form-control mw-100  me-3"
                          selected={endDate}
                          onChange={(date) => setEndDate(date)}
                          dateFormat="MMM dd yyyy"
                          placeholderText={"From"}
                          name="dueDate"
                        />
                      </div>

                      <div className="col-md-12 form-group px-2">
                        <h6 className="mb-0">Amount</h6>
                        <Field
                          type="number"
                          name="amount"
                          className="form-control"
                          value={
                            type === "smsPurchase"
                              ? Math.ceil(smsAmount)
                              : type === "registration"
                              ? ispOwnerData?.bpSettings?.registrationFee
                              : type === "monthlyServiceCharge"
                              ? ispOwnerData?.bpSettings?.packageRate
                              : ""
                          }
                        />
                      </div>
                    </div>
                    <div className="modal-footer bg-whitesmoke br  mt-4">
                      <button
                        disabled={isLoading}
                        type="button"
                        className="btn btn-danger"
                        data-bs-dismiss="modal"
                      >
                        cancel
                      </button>
                      <button
                        disabled={isLoading}
                        type="submit"
                        className="btn btn-success"
                      >
                        {isLoading ? <Loader /> : "submit"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceCreate;
