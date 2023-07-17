import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";
import * as Yup from "yup";
import { FtextField } from "../../components/common/FtextField";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import DatePicker from "react-datepicker";
import Loader from "../../components/common/Loader";
import { createCustomerInvoice } from "../../features/apiCalls";
import RechargePrintInvoice from "../Customer/customerCRUD/bulkOpration/RechargePrintInvoice";

const StaticCreateInvoice = ({ show, setShow, single, customerData }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const rechargePrint = useRef();

  // name of twelve months
  const options = [
    { value: "January", label: t("january") },
    { value: "February", label: t("february") },
    { value: "March", label: t("march") },
    { value: "April", label: t("april") },
    { value: "May", label: t("may") },
    { value: "June", label: t("june") },
    { value: "July", label: t("July") },
    { value: "August", label: t("august") },
    { value: "September", label: t("september") },
    { value: "October", label: t("october") },
    { value: "November", label: t("november") },
    { value: "December", label: t("december") },
  ];

  // get all role
  const role = useSelector((state) => state.persistedReducer.auth.role);

  // get ispOwner data
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // get userData
  const userData = useSelector((state) => state.persistedReducer.auth.userData);

  // get currentUser
  const currentUser = useSelector(
    (state) => state.persistedReducer.auth?.currentUser
  );

  // get currentUserId
  const currentUserId = useSelector(
    (state) => state.persistedReducer.auth?.userData?.id
  );

  // get user permission
  const permission = useSelector(
    (state) => state.persistedReducer.auth.userData.permissions
  );

  // get bpSettings
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData?.bpSettings
  );

  // get all packages
  const ppPackage = useSelector((state) =>
    bpSettings?.hasMikrotik
      ? state?.mikrotik?.packagefromDatabase
      : state?.package?.packages
  );

  // get all customer in state
  const customer = useSelector((state) => state?.customer?.staticCustomer);

  // find single data
  const data = customer.find((item) => item.id === single);

  // handleChange data state
  const [billAmount, setBillAmount] = useState();
  const [balanceDue, setBalanceDue] = useState();
  const totalAmount = Number(billAmount) + Number(balanceDue);
  const maxDiscount = totalAmount;

  // bill type state
  const [billType, setBillType] = useState("bill");

  // bill medium state
  const [medium, setMedium] = useState("cash");

  // select month for bill
  const [selectedMonth, setSelectedMonth] = useState([]);

  // bill note state
  const [note, setNote] = useState("");

  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [noteCheck, setNoteCheck] = useState(false);
  const [startDate, setStartDate] = useState(false);
  const [endDate, setEndDate] = useState(false);

  useEffect(() => {
    setBalanceDue(data?.balance > 0 ? Math.abs(data?.balance) : 0);
    setBillAmount(
      data?.balance > 0 && data?.balance <= data?.monthlyFee
        ? data?.monthlyFee - data?.balance
        : data?.balance > data?.monthlyFee
        ? 0
        : data?.monthlyFee
    );

    let temp = [];

    const dataMonth = new Date(data?.billingCycle).getMonth();

    if (data?.balance === 0 && data?.paymentStatus === "unpaid") {
      setSelectedMonth([options[dataMonth]]);
    } else if (data?.balance === 0 && data?.paymentStatus === "paid") {
      temp.push(options[dataMonth + 1]);
      if (dataMonth + 1 > 11) setSelectedMonth([]);
      else setSelectedMonth(temp);
    } else if (data?.balance > 0 && data?.paymentStatus === "paid") {
      const modVal = Math.floor(data?.balance / data?.monthlyFee);
      temp.push(options[dataMonth + modVal + 1]);

      if (dataMonth + modVal + 1 > 11) setSelectedMonth([]);
      else setSelectedMonth(temp);
    } else if (data?.balance < 0 && data?.paymentStatus === "unpaid") {
      const modVal = Math.floor(Math.abs(data?.balance / data?.monthlyFee));

      let diff = dataMonth - modVal;
      if (diff < 0) {
        diff = 0;
      }

      for (let i = diff; i <= dataMonth; i++) {
        temp.push(options[i]);
      }
      setSelectedMonth(temp);
    }
  }, [data]);

  //modal handler
  const handleClose = () => {
    setShow(false);
    resetForm();
  };

  //form resetFunction
  const resetForm = () => {
    setStartDate(false);
    setEndDate(false);
    setNote("");
    setNoteCheck(false);
    setSelectedMonth(null);
    setBillAmount(
      data?.balance > 0 && data?.balance <= data?.monthlyFee
        ? data?.monthlyFee - data?.balance
        : data?.balance > data?.monthlyFee
        ? 0
        : data?.monthlyFee
    );
  };

  // bill validation
  const billValidation = Yup.object({
    amount: Yup.number()
      .min(Math.floor(data?.monthlyFee / 3), t("billNotAcceptable"))
      .integer(t("decimalNumberNotAcceptable")),
    due: Yup.number()
      .min(0, t("dueNotAcceptable"))
      .max(
        data?.balance < 0 ? Math.abs(data?.balance) : 0,
        t("dueNotAcceptable")
      )
      .integer(t("decimalNumberNotAcceptable")),
    discount: Yup.number()
      .min(0, t("discountNotAcceptable"))
      .max(maxDiscount, t("discountNotAcceptable"))
      .integer(t("decimalNumberNotAcceptable")),
  });

  // onChange handle form value
  const handleFormValue = (event) => {
    if (event.target.name === "amount") {
      setBillAmount(event.target.value);
    }
    if (event.target.name === "due") {
      setBalanceDue(event.target.value);
    }
  };

  const findPackage = ppPackage.find((pack) =>
    pack.id.includes(data?.mikrotikPackage)
  );

  // bill amount handle
  const customerBillInvoiceHandler = (formValue) => {
    if (balanceDue > (data?.balance < 0 ? Math.abs(data?.balance) : 0)) {
      setIsLoading(false);
      return alert(t("dueNotAcceptable"));
    }

    if (balanceDue < 0) {
      setIsLoading(false);
      return alert(t("dueNotAcceptable"));
    }
    if (maxDiscount < formValue.discount) {
      setIsLoading(false);
      return alert(t("discountNotAcceptable"));
    }

    const sendingData = {
      amount: formValue.amount + formValue.due,
      discount: formValue.discount,
      name: userData.name,
      collectedBy: currentUser?.user.role,
      billType: billType,
      customer: data?.id,
      ispOwner: ispOwner,
      user: currentUser?.user.id,
      collectorId: currentUserId, //when collector is logged in
      medium,
      package: findPackage?.name,
      invoiceType: "customerInvoice",
    };

    if (note) sendingData.note = note;

    if (startDate && endDate) {
      sendingData.start = startDate.toISOString();
      sendingData.end = endDate.toISOString();
    }
    if (selectedMonth?.length > 0) {
      const monthValues = selectedMonth.map((item) => {
        return item.value;
      });
      sendingData.month = monthValues.join(",");
    }
    createCustomerInvoice(
      dispatch,
      sendingData,
      setIsLoading,
      resetForm,
      setShow
    );
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <ModalHeader closeButton>
          <ModalTitle>
            <h5
              style={{ color: "#0abb7a" }}
              className="modal-title"
              id="customerModalDetails"
            >
              {t("recharge")}
            </h5>
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Formik
            initialValues={{
              amount:
                data?.balance > 0 && data?.balance <= data?.monthlyFee
                  ? data?.monthlyFee - data?.balance
                  : data?.balance > data?.monthlyFee
                  ? 0
                  : data?.monthlyFee,
              due: data?.balance < 0 ? Math.abs(data?.balance) : 0,
              discount: 0,
            }}
            validationSchema={billValidation}
            onSubmit={(values) => {
              customerBillInvoiceHandler(values);
            }}
            enableReinitialize
          >
            {() => (
              <Form onChange={handleFormValue} id="staticInvoice">
                <table
                  className="table table-bordered"
                  style={{ lineHeight: "12px" }}
                >
                  <tbody>
                    <tr>
                      <td>{t("id")}</td>
                      <td>
                        <b>{data?.customerId}</b>
                      </td>
                      <td>{t("pppoe")}</td>
                      <td>
                        <b>{data?.pppoe.name}</b>
                      </td>
                    </tr>
                    <tr>
                      <td>{t("name")}</td>
                      <td>
                        <b>{data?.name}</b>
                      </td>
                      <td>{t("mobile")}</td>
                      <td className="text-primary">
                        <b>{data?.mobile}</b>
                      </td>
                    </tr>
                    <tr>
                      <td>{t("monthly")}</td>
                      <td className="text-success">
                        <b>{data?.monthlyFee}</b>
                      </td>
                      <td>{t("balance")}</td>
                      <td className="text-info">
                        <b>{data?.balance}</b>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <h6>
                  <span className="text-success">{t("totalBillAmount")}</span>
                  <span className="text-danger">{totalAmount} </span>
                </h6>

                <div className="bill_collect_form">
                  <div className="w-100 me-2">
                    <FtextField
                      type="number"
                      name="amount"
                      label={t("amount")}
                      value={billAmount}
                    />
                  </div>
                  <div className="w-100 me-2">
                    <FtextField type="number" name="due" label={t("due")} />
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="w-100 me-2 mb-3">
                    <label className="form-control-label changeLabelFontColor">
                      {t("billType")}
                    </label>
                    <select
                      className="form-select mt-0 mw-100"
                      onChange={(e) => setBillType(e.target.value)}
                    >
                      <option value="bill"> {t("bill")} </option>
                      {permission?.connectionFee || role !== "collector" ? (
                        <option value="connectionFee">
                          {t("connectionFee")}
                        </option>
                      ) : (
                        ""
                      )}
                    </select>
                  </div>
                  <div className="d-inline w-100 mb-3">
                    <label
                      htmlFor="receiver_type"
                      className="form-control-label changeLabelFontColor"
                    >
                      {t("medium")}
                    </label>

                    <select
                      as="select"
                      id="receiver_type"
                      className="form-select mt-0 mw-100"
                      aria-label="Default select example"
                      onChange={(e) => setMedium(e.target.value)}
                    >
                      <option value="cash" selected>
                        {t("handCash")}
                      </option>
                      <option value="bKash"> {t("bKash")} </option>
                      <option value="rocket"> {t("rocket")} </option>
                      <option value="nagad"> {t("nagad")} </option>
                      <option value="others"> {t("others")} </option>
                    </select>
                  </div>
                </div>
                <div className="month mb-2">
                  <label
                    className="form-check-label changeLabelFontColor"
                    htmlFor="selectMonth"
                  >
                    {t("selectMonth")}
                  </label>
                  <Select
                    className="mt-1"
                    value={selectedMonth}
                    onChange={(data) => setSelectedMonth(data)}
                    options={options}
                    isMulti={true}
                    placeholder={t("selectMonth")}
                    isSearchable
                    id="selectMonth"
                  />
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  {(role === "ispOwner" || permission.billDiscount) && (
                    <div className="w-50">
                      <FtextField
                        type="number"
                        name="discount"
                        label={t("discount")}
                      />
                    </div>
                  )}
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input me-1"
                      id="addNOte"
                      checked={noteCheck}
                      onChange={(e) => setNoteCheck(e.target.checked)}
                    />
                    <label
                      className="form-check-label changeLabelFontColor"
                      htmlFor="addNOte"
                    >
                      {t("noteAndDate")}
                    </label>
                  </div>
                </div>

                {noteCheck && (
                  <>
                    <div className="mt-1">
                      <div className="d-flex">
                        <div className="me-2">
                          <label className="form-control-label changeLabelFontColor">
                            {t("startDate")}
                          </label>
                          <DatePicker
                            className="form-control mw-100"
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            dateFormat="dd/MM/yyyy"
                            placeholderText={t("selectDate")}
                          />
                        </div>
                        <div>
                          <label className="form-control-label changeLabelFontColor">
                            {t("endDate")}
                          </label>

                          <DatePicker
                            className="form-control mw-100"
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            dateFormat="dd/MM/yyyy"
                            placeholderText={t("selectDate")}
                          />
                        </div>
                      </div>
                    </div>

                    <div class="form-floating mt-3">
                      <textarea
                        cols={200}
                        className="form-control shadow-none"
                        placeholder={t("writeNote")}
                        id="noteField"
                        onChange={(e) => setNote(e.target.value)}
                      ></textarea>
                      <label for="noteField"> {t("addNote")} </label>
                    </div>
                  </>
                )}

                {/* Invoice Printer Page Component with button and they are hidden*/}

                <>
                  {((role === "ispOwner" &&
                    bpSettings?.instantRechargeBillPrint) ||
                    ((role === "manager" || role === "collector") &&
                      permission?.instantRechargeBillPrint &&
                      bpSettings?.instantRechargeBillPrint)) && (
                    <div className="d-none">
                      <RechargePrintInvoice
                        ref={rechargePrint}
                        customerData={customerData}
                        ispOwnerData={userData}
                      />
                    </div>
                  )}

                  {/* <div className="d-none">
                    <ReactToPrint
                      documentTitle={t("billInvoice")}
                      trigger={() => (
                        <div
                          title={t("printInvoiceBill")}
                          style={{ cursor: "pointer" }}
                        >
                          <button type="button" id="printButton">
                            Print
                          </button>
                        </div>
                      )}
                      content={() => rechargePrint.current}
                    />
                  </div> */}
                </>
              </Form>
            )}
          </Formik>
        </ModalBody>
        <ModalFooter>
          <button
            type="submit"
            className="btn btn-success"
            form="staticInvoice"
          >
            {isLoading ? <Loader /> : t("submit")}
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default StaticCreateInvoice;
