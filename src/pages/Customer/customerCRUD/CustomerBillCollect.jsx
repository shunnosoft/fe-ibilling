import { useRef, useState } from "react";
import { Form, Formik } from "formik";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { Card } from "react-bootstrap";
import { CashStack } from "react-bootstrap-icons";
import { toast } from "react-toastify";

// custom hooks import
import useISPowner from "../../../hooks/useISPOwner";

//internal imports
import "../../Customer/customer.css";
import { FtextField } from "../../../components/common/FtextField";
import { billCollect } from "../../../features/apiCalls";
import Loader from "../../../components/common/Loader";
import RechargePrintInvoice from "./bulkOpration/RechargePrintInvoice";
import ReactToPrint from "react-to-print";

// custom function import
import customerBillMonth from "./customerBillMonth";

const CustomerBillCollect = ({ single, status, page, setShow }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const rechargePrint = useRef();

  // twelve month options
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

  // get user & current user data form useISPOwner hooks
  const {
    role,
    ispOwnerId,
    bpSettings,
    userData,
    currentUser,
    permissions,
    permission,
  } = useISPowner();

  // get all customer
  const customer = useSelector((state) =>
    status === "pppoe"
      ? state?.customer?.customer
      : state?.customer?.staticCustomer
  );

  // get currentUserId
  const currentUserId = useSelector(
    (state) => state.persistedReducer.auth?.userData?.id
  );

  // get customer connection fee due form redux store
  const paidConnectionFee = useSelector(
    (state) => state.customer.connectionFeeDue
  );

  // find editable data
  const data = customer.find((item) => item.id === single);

  // loading state
  const [isLoading, setLoading] = useState(false);

  // customer bill type
  const [billType, setBillType] = useState("bill");

  // customer bill medium
  const [medium, setMedium] = useState("cash");

  // customer biill date month set is requerd
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [billAmount, setBillAmount] = useState();

  // note check & note
  const [noteCheck, setNoteCheck] = useState(false);
  const [note, setNote] = useState("");

  //set customer billing date
  const [startDate, setStartDate] = useState(false);
  const [endDate, setEndDate] = useState(false);

  //calculation total bill due & amount
  const [balanceDue, setBalanceDue] = useState();

  //response data after API call after payment
  const [responseData, setResponseData] = useState();
  const [test, setTest] = useState(false);

  // calculation
  const totalAmount =
    billType === "bill"
      ? Number(billAmount) + Number(balanceDue)
      : Number(data.connectionFee - paidConnectionFee);
  const maxDiscount = totalAmount;

  //bill colleciton validation
  const BillValidatoin = Yup.object({
    amount: Yup.number()
      .min(0, t("billNotAcceptable"))
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
        : data?.monthlyFee
    );
  };

  useEffect(() => {
    setBalanceDue(data?.balance < 0 ? Math.abs(data?.balance) : 0);
    setBillAmount(
      data?.balance > 0 && data?.balance <= data?.monthlyFee
        ? data?.monthlyFee - data?.balance
        : data?.monthlyFee
    );

    // set customer bill month
    setSelectedMonth(customerBillMonth(data));
  }, [data]);

  //print button is clicked after successful response
  useEffect(() => {
    if (test) {
      if (
        (role === "ispOwner" && bpSettings?.instantRechargeBillPrint) ||
        ((role === "manager" || role === "collector") &&
          permission?.instantRechargeBillPrint &&
          bpSettings?.instantRechargeBillPrint)
      ) {
        document.getElementById("printButton").click();
        setTest(!test);
      }
    }
  }, [test]);

  // handle form customer bill amount & due
  const handleFormValue = (event) => {
    if (event.target.name === "amount") {
      setBillAmount(event.target.value);
      setSelectedMonth(customerBillMonth(data, event.target.value));
    }
    if (event.target.name === "due") {
      setBalanceDue(event.target.value);
    }
  };

  // bill amount
  const customerBillHandler = (formValue) => {
    if (balanceDue > (data?.balance < 0 ? Math.abs(data?.balance) : 0)) {
      setLoading(false);
      return alert(t("dueNotAcceptable"));
    }

    if (balanceDue < 0) {
      setLoading(false);
      return alert(t("dueNotAcceptable"));
    }
    if (maxDiscount < formValue.discount) {
      setLoading(false);
      return alert(t("discountNotAcceptable"));
    }

    const sendingData = {
      amount: formValue.amount + formValue.due,
      discount: formValue.discount,
      name: userData.name,
      collectedBy: currentUser?.user.role,
      billType: billType,
      customer: data?.id,
      ispOwner: ispOwnerId,
      user: currentUser?.user.id,
      collectorId: currentUserId, //when collector is logged in
      userType: data?.userType,
      medium,
      package: data?.pppoe.profile,
    };

    if (note) sendingData.note = note;

    if (startDate && endDate) {
      sendingData.start = startDate.toISOString();
      sendingData.end = endDate.toISOString();
    }

    if (billType === "connectionFee") {
      sendingData.month = "Connection Fee";
    } else {
      if (selectedMonth?.length === 0) {
        setLoading(false);
        return toast.warn(t("selctMonth"));
      } else {
        const monthValues = selectedMonth.map((item) => {
          return item.value;
        });
        sendingData.month = monthValues.join(",");
      }
    }

    billCollect(
      dispatch,
      sendingData,
      paidConnectionFee,
      setLoading,
      resetForm,
      setResponseData,
      setTest,
      setShow
    );
  };

  return (
    <>
      {page !== "recharge" && (
        <Card.Title className="clintTitle mb-0">
          <h5 className="profileInfo">{t("recharge")}</h5>
        </Card.Title>
      )}

      <Card.Body className={page === "recharge" ? "pt-0" : ""}>
        <Formik
          initialValues={{
            amount: billAmount,
            due: balanceDue,
            discount: 0,
          }}
          validationSchema={BillValidatoin}
          onSubmit={(values) => {
            customerBillHandler(values);
          }}
          enableReinitialize
        >
          {() => (
            <Form onChange={handleFormValue}>
              <div className="monthlyBill">
                <span className="text-secondary">{data?.name}</span>&nbsp;
                <span className="text-secondary">{t("totalAmount")} ৳</span>
                <span className="text-primary">{totalAmount} </span>
              </div>

              <div className="displayGrid">
                <div className="displayGrid2">
                  <FtextField type="number" name="amount" label={t("amount")} />

                  <FtextField type="number" name="due" label={t("due")} />
                </div>
                <div className="displayGrid2">
                  <div>
                    <label className="form-control-label changeLabelFontColor">
                      {t("billType")}
                    </label>
                    <select
                      className="form-select mt-0 mw-100"
                      onChange={(e) => setBillType(e.target.value)}
                    >
                      <option value="bill"> {t("bill")} </option>
                      {permission?.connectionFee ||
                        (role !== "collector" && (
                          <option value="connectionFee">
                            {t("connectionFee")}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
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

                {billType === "bill" && (
                  <div className="month">
                    <label
                      className="form-check-label changeLabelFontColor"
                      htmlFor="selectMonth"
                    >
                      {t("selectMonth")}
                    </label>

                    <Select
                      className="mt-0"
                      value={selectedMonth}
                      onChange={(data) => setSelectedMonth(data)}
                      options={options}
                      isMulti={true}
                      placeholder={t("selectMonth")}
                      isSearchable
                      id="selectMonth"
                    />
                  </div>
                )}

                <div className="displayGrid2">
                  {(role === "ispOwner" || permissions.billDiscount) && (
                    <div>
                      <FtextField
                        type="number"
                        name="discount"
                        label={t("discount")}
                      />
                    </div>
                  )}

                  <div className="d-flex align-self-end">
                    <input
                      type="checkbox"
                      className="form-check-input me-1"
                      id="addnote"
                      checked={noteCheck}
                      onChange={(e) => setNoteCheck(e.target.checked)}
                    />
                    <label
                      className="form-check-label changeLabelFontColor"
                      htmlFor="addnote"
                    >
                      {t("noteAndDate")}
                    </label>
                  </div>
                </div>

                {noteCheck && (
                  <>
                    <div className="displayGrid2">
                      <div>
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

                    <div class="form-floating">
                      <textarea
                        cols={200}
                        className="form-control shadow-none"
                        placeholder={t("writeNote")}
                        id="noteField"
                        onChange={(e) => setNote(e.target.value)}
                      ></textarea>
                      <label htmlFor="noteField"> {t("addNote")} </label>
                    </div>
                  </>
                )}
              </div>

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
                      customerData={data}
                      billingData={responseData}
                      ispOwnerData={userData}
                    />
                  </div>
                )}

                <div className="d-none">
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
                </div>
              </>

              <div className="d-flex justify-content-end mt-4">
                <button type="submit" className="btn btn-outline-success">
                  {isLoading ? (
                    <Loader />
                  ) : (
                    <span className="submitButton">
                      {t("pay")}
                      <CashStack />
                    </span>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Card.Body>
    </>
  );
};

export default CustomerBillCollect;
