import React, { useEffect, useState } from "react";
import Loader from "../../../components/common/Loader";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import { getSingleIspOwner } from "../../../features/apiCallAdmin";
import { getNetfeeSettings } from "../../../features/netfeeSettingsApi";
import { ispOwnerInvoiceCreate } from "../../../features/apiCalls";
import { Button, Modal } from "react-bootstrap";

const InvoiceCreate = ({ ispOwnerId, modal }) => {
  const dispatch = useDispatch();

  //get single ispOwner
  const ispOwnerData = useSelector((state) => state.admin?.singleIspOwner);

  // get all package in netFee
  const allPackage = useSelector(
    (state) => state.netfeeSettings?.netfeeSettings
  );

  //user role
  const role = useSelector((state) => state.persistedReducer.auth?.role);

  //modal open and hide state
  const [show, setShow] = useState(false);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // package Type data state
  const [type, setType] = useState("");

  // message count data state
  const [messageType, setMessageType] = useState(
    "nonMasking" || "masking" || "fixedNumber"
  );

  // message prise state
  const [smsAmount, setSmsAmount] = useState("");

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

  //subPackage state
  const [supPackage, setSubPackage] = useState(allPackage[0]?.subPackage);
  const [singlePackage, setSinglePackage] = useState(["Standard"]);
  const discount = allPackage[0]?.discount;

  //  isp owner form validation
  const validationSchema = Yup.object({
    monthlyPaymentStatus: Yup.string(),
    paymentStatus: Yup.string(),
    amount: Yup.number().required("Input Package Amount"),
  });

  //  set initial form values
  let initialValues;
  if (ispOwnerData) {
    initialValues = {
      status: "unpaid",
      amount: "",
    };
    if (type === "registration") {
      initialValues.status = ispOwnerData?.bpSettings?.paymentStatus;
    }
    if (type === "monthlyServiceCharge") {
      initialValues.status = ispOwnerData?.bpSettings?.monthlyPaymentStatus;
    }
    if (type) {
      initialValues.amount =
        type === "smsPurchase"
          ? Math.ceil(smsAmount)
          : type === "registration"
          ? ispOwnerData?.bpSettings?.registrationFee
          : type === "monthlyServiceCharge"
          ? ispOwnerData?.bpSettings?.packageRate
          : type === "migration"
          ? singlePackage[0].installation -
            (singlePackage[0].installation * discount) / 100
          : "";
    }
  }

  //modal handler
  const handleClose = () => setShow(false);

  //  handle submit
  const invoiceCreateHandler = (values) => {
    // message invoice create
    if (type === "smsPurchase") {
      if (smsCount * ispOwnerData.smsRate < 100) {
        alert("Unsuccess SMS Purchase");
      } else {
        let data = {
          amount: Math.ceil(smsAmount),
          numberOfSms: Number.parseInt(smsCount),
          ispOwner: ispOwnerData.id,
          user: ispOwnerData.user,
          type: "smsPurchase",
          smsPurchaseType: messageType,
          status: values.status,
        };
        ispOwnerInvoiceCreate(dispatch, setIsLoading, data);
      }
    }

    if (type === "monthlyServiceCharge") {
      let data = {
        amount: values.amount,
        ispOwner: ispOwnerData.id,
        user: ispOwnerData.user,
        type: "monthlyServiceCharge",
        monthlyPaymentStatus: values.status,
      };
      ispOwnerInvoiceCreate(dispatch, setIsLoading, data);
    }

    // ispOwner package change invoice create
    if (type === "migration") {
      let data = {
        status: values.status,
        amount: values.amount,
        ispOwner: ispOwnerData.id,
        user: ispOwnerData.user,
        type: "migration",
      };
      ispOwnerInvoiceCreate(dispatch, setIsLoading, data);
    }
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
  const handleSubPackage = (e) => {
    setSinglePackage([JSON.parse(e.target.value)]);
  };

  useEffect(() => {
    if (modal) {
      setShow(modal);
    }
    // message purchase
    if (messageType === "nonMasking") {
      setSmsAmount(ispOwnerData.smsRate * smsCount);
    } else if (messageType === "masking") {
      setSmsAmount(ispOwnerData.maskingSmsRate * smsCount);
    } else if (messageType === "fixedNumber") {
      setSmsAmount(ispOwnerData.fixedNumberSmsRate * smsCount);
    }

    if (allPackage) {
      setSubPackage(allPackage[0]?.subPackage);
    }
  }, [messageType, allPackage, modal]);

  // get netFee settings api call
  useEffect(() => {
    if (type === "migration") {
      getNetfeeSettings(dispatch, setIsLoading);
    }
  }, [type]);

  useEffect(() => {
    if (ispOwnerId) {
      getSingleIspOwner(ispOwnerId, dispatch, setIsLoading);
    }
  }, [ispOwnerId]);

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>
          <h5
            style={{ color: "#0abb7a" }}
            className="modal-title"
            id="ispOwnerInvoice"
          >
            Company Name: {ispOwnerData?.company}
          </h5>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
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

                {role === "superadmin" && (
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
                )}

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
                        onChange={handleSubPackage}
                      >
                        <option value="">Select Package</option>
                        {supPackage?.map((pak, index) => {
                          return (
                            <option
                              className="customOption"
                              key={index}
                              value={JSON.stringify(pak)}
                            >
                              {pak.subPackageName}
                            </option>
                          );
                        })}
                      </Field>
                    </div>

                    <div className="col-md-6 form-group">
                      <h6 className="mb-0">Customer Limit</h6>
                      <Field
                        className="form-control"
                        type="text"
                        name="customerLimit"
                        value={singlePackage[0].customer}
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
                  <Field type="number" name="amount" className="form-control" />
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>

      <Modal.Footer>
        <Button
          disabled={isLoading}
          type="button"
          className="btn btn-danger"
          onClick={handleClose}
        >
          cancel
        </Button>
        <Button disabled={isLoading} type="submit" className="btn btn-success">
          {isLoading ? <Loader /> : "submit"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InvoiceCreate;
