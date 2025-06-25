import { useMemo, useState } from "react";
import { Form, Formik } from "formik";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useEffect } from "react";
import ReactToPrint from "react-to-print";
import { useRef } from "react";
import { Card } from "react-bootstrap";
import { CashStack } from "react-bootstrap-icons";

// custom hooks import
import useISPowner from "../../../hooks/useISPOwner";

//internal imports
import { FtextField } from "../../../components/common/FtextField";
import "../../Customer/customer.css";
import {
  billCollect,
  getResellerPackageRate,
} from "../../../features/apiCallReseller";
import Loader from "../../../components/common/Loader";
import RechargePrintInvoice from "../../../pages/Customer/customerCRUD/bulkOpration/RechargePrintInvoice";
import SelectField from "../../../components/common/SelectField";

// custome function import
import customerBillMonth from "../../../pages/Customer/customerCRUD/customerBillMonth";

const CustomerBillCollect = ({ customerId, customerData, page, setShow }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const resellerRechargePrint = useRef();

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
    ispOwnerData,
    ispOwnerId,
    resellerData,
    userData,
    permission,
    currentUser,
  } = useISPowner();

  console.log({ userData });

  // get customers form redux store
  const customer = useSelector((state) => state?.customer?.customer);

  // get customer connection fee due form redux store
  const paidConnectionFee = useSelector(
    (state) => state.customer.connectionFeeDue
  );

  // single customer find
  const data = customer.find((item) => item.id === customerId);

  //loading state
  const [isLoading, setLoading] = useState(false);

  //set customer billing date
  const [startDate, setStartDate] = useState(false);
  const [endDate, setEndDate] = useState(false);

  // note check & note
  const [noteCheck, setNoteCheck] = useState(false);
  const [note, setNote] = useState("");

  // customer biill date month set is requerd
  const [selectedMonth, setSelectedMonth] = useState(null);

  // set bill type
  const [billType, setBillType] = useState("bill");

  // set reseller package rate
  const [packageRate, setPackageRate] = useState();
  const [billAmount, setBillAmount] = useState();

  // instent responce data
  const [responseData, setResponseData] = useState({});
  const [test, setTest] = useState(false);

  //calculation total bill due & amount
  const [balanceDue, setBalanceDue] = useState();
  const [billingType, setBillingType] = useState("monthly");
  const [dayOfLength, setDayOfLength] = useState(1);

  // total bill calculation
  const totalAmount =
    billType === "bill"
      ? Number(billAmount) + Number(balanceDue)
      : Number(data.connectionFee - paidConnectionFee);

  useEffect(() => {
    //get reseller package based commission
    if (data && userData?.commissionType === "packageBased") {
      getResellerPackageRate(
        data?.reseller,
        data?.mikrotikPackage,
        setPackageRate
      );
    }

    //set customer priv month due amount
    setBalanceDue(data?.balance < 0 ? Math.abs(data?.balance) : 0);

    //set customer monthly bill amount
    setBillAmount(
      data?.balance > 0 && data?.balance <= data?.monthlyFee
        ? data?.monthlyFee - data?.balance
        : data?.balance > data?.monthlyFee
        ? 0
        : data?.monthlyFee
    );

    // set customer bill month
    setSelectedMonth(customerBillMonth(data));
  }, [data]);

  //print button is clicked after successful response
  useEffect(() => {
    if (test) {
      if (
        (role === "reseller" && permission?.instantRechargeBillPrint) ||
        (role === "collector" &&
          resellerData.permission?.instantRechargeBillPrint)
      ) {
        document.getElementById("printButtonReseller").click();
        setTest(!test);
      }
    }
  }, [test]);

  //print button is clicked after successful response
  useEffect(() => {
    if (test) {
      if (
        (role === "reseller" && permission?.instantRechargeBillPrint) ||
        (role === "collector" &&
          resellerData.permission?.instantRechargeBillPrint)
      ) {
        document.getElementById("printButtonReseller").click();
        setTest(!test);
      }
    }
  }, [test]);

  // customer recharge bilkl validation
  const getBillValidationSchema = (context, t) => {
    return Yup.object({
      amount: Yup.number()
        .required(t("required"))
        .integer(t("decimalNumberNotAcceptable"))
        .min(
          (() => {
            const { billType, billingType, userData, packageRate, data } =
              context;

            if (billType === "bill" && billingType === "monthly") {
              if (
                userData?.commissionType === "packageBased" &&
                userData?.commissionStyle === "fixedRate"
              ) {
                return packageRate?.ispOwnerRate;
              } else if (
                userData?.commissionType === "packageBased" &&
                userData?.commissionStyle === "percentage"
              ) {
                return Math.round(
                  (packageRate?.ispOwnerRate * data?.monthlyFee) / 100
                );
              } else {
                return Math.round(
                  (userData?.commissionRate?.isp * data?.monthlyFee) / 100
                );
              }
            } else if (billType === "bill" && billingType === "daily") {
              if (
                userData?.commissionType === "global" &&
                userData?.commissionStyle === "percentage"
              ) {
                const date = new Date();
                const monthDate = new Date(
                  date.getFullYear(),
                  date.getMonth() + 1,
                  0
                ).getDate();
                const customerPerDayBill = data?.monthlyFee / monthDate;

                const ispOwnerDailyCommission =
                  (userData?.commissionRate?.isp *
                    (dayOfLength * customerPerDayBill)) /
                  100;

                return Math.round(ispOwnerDailyCommission);
              } else if (
                userData?.commissionType === "packageBased" &&
                userData?.commissionStyle === "fixedRate"
              ) {
                const date = new Date();
                const monthDate = new Date(
                  date.getFullYear(),
                  date.getMonth() + 1,
                  0
                ).getDate();
                const ispOwnerPerDayCommission =
                  packageRate?.ispOwnerRate / monthDate;

                const ispOwnerDailyCommission =
                  dayOfLength * ispOwnerPerDayCommission;

                return Math.round(ispOwnerDailyCommission);
              } else {
                const date = new Date();
                const monthDate = new Date(
                  date.getFullYear(),
                  date.getMonth() + 1,
                  0
                ).getDate();
                const customerPerDayBill = data?.monthlyFee / monthDate;

                const ispOwnerDailyCommission =
                  (packageRate?.ispOwnerRate *
                    (dayOfLength * customerPerDayBill)) /
                  100;

                return Math.round(ispOwnerDailyCommission);
              }
            }
          })(),
          t("billNotAcceptable")
        ),
    });
  };

  const validationSchema = useMemo(() => {
    return getBillValidationSchema(
      { billType, billingType, dayOfLength, userData, packageRate, data },
      t
    );
  }, [billType, billingType, dayOfLength, userData, packageRate, data, t]);

  // handle form customer bill amount & due
  const handleFormValue = (event, setFieldValue) => {
    if (event.target.name === "billingType") {
      setBillingType(event.target.value);
      setFieldValue("billingType", event.target.value);
      if (event.target.value === "daily") {
        setFieldValue("dayLength", 1);

        const date = new Date();
        const monthDate = new Date(
          date.getFullYear(),
          date.getMonth() + 1,
          0
        ).getDate();
        const customerPerDayBill = data?.monthlyFee / monthDate;

        setFieldValue("amount", Math.round(customerPerDayBill));
      } else {
        setFieldValue("amount", data?.monthlyFee);
      }
    }

    if (event.target.name === "dayLength") {
      setDayOfLength(Number(event.target.value));
      setFieldValue("dayLength", Number(event.target.value));
      const date = new Date();
      const monthDate = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
      ).getDate();
      const customerPerDayBill = data?.monthlyFee / monthDate;

      const dayTodayFee = customerPerDayBill * event.target.value;
      setFieldValue("amount", Math.round(dayTodayFee));
    }
  };

  // bill amount
  const customerBillHandler = (formValue) => {
    if (
      billType === "bill" &&
      billingType === "monthly" &&
      userData?.commissionType === "packageBased" &&
      userData?.commissionStyle === "fixedRate" &&
      packageRate.ispOwnerRate > formValue.amount
    ) {
      toast.error(t("rechargeAmountMustBeUptoIspOwnerRate"));
      return;
    }

    if (
      billType === "bill" &&
      billingType === "monthly" &&
      !(
        userData?.commissionType === "packageBased" &&
        userData?.commissionStyle === "fixedRate"
      ) &&
      data?.monthlyFee > formValue.amount + data?.balance
    ) {
      toast.error(t("rechargeAmountMustBeUptoOrEqualMonthlyFee"));
      return;
    }

    const sendingData = {
      ...formValue,
      collectedBy: currentUser?.user.role,
      billType: billType,
      name: userData.name,
      customer: data?.id,
      ispOwner: ispOwnerId,
      user: currentUser?.user.id,
      collectorId: userData?.id, //when collector is logged in
      medium: formValue.medium,
      package: data.pppoe.profile,
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

    console.log({ sendingData });

    billCollect(
      dispatch,
      sendingData,
      paidConnectionFee,
      setLoading,
      resetForm,
      setResponseData,
      setTest, //to verify successful response
      "pppoe",
      setShow
    );
  };

  //form resetFunction
  const resetForm = () => {
    setStartDate(false);
    setEndDate(false);
    setNote("");
    setNoteCheck(false);
    setSelectedMonth(null);
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
            amount: totalAmount,
            medium: "cash",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            customerBillHandler(values);
          }}
          enableReinitialize
        >
          {({ setFieldValue }) => (
            <Form onChange={(event) => handleFormValue(event, setFieldValue)}>
              <div className="monthlyBill">
                <span className="text-secondary">{data?.name}</span>&nbsp;
                <span className="text-secondary">{t("totalAmount")} ৳</span>
                <span className="text-primary">{totalAmount} </span>
              </div>

              <div className="displayGrid">
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
                      <option value="connectionFee">
                        {t("connectionFee")}
                      </option>
                    </select>
                  </div>

                  {billType === "bill" && (
                    <>
                      <div>
                        <label
                          htmlFor="billingType_type"
                          className="form-control-label changeLabelFontColor"
                        >
                          {t("billingType")}
                          <span className="text-danger mx-1">*</span>
                        </label>

                        <select
                          as="select"
                          name="billingType"
                          id="billingType_type"
                          className="form-select mt-0 mw-100"
                        >
                          <option value="monthly"> {t("monthly")} </option>
                          <option value="daily"> {t("daily")} </option>
                        </select>
                      </div>

                      {billingType === "daily" && (
                        <FtextField
                          type="number"
                          label="Day Length"
                          name="dayLength"
                          validation={"true"}
                        />
                      )}
                    </>
                  )}

                  <FtextField type="number" name="amount" label={t("bill")} />

                  <div>
                    <SelectField label={t("medium")} name="medium">
                      <option value="cash" selected>
                        {t("handCash")}
                      </option>
                      <option value="bKash"> {t("bKash")} </option>
                      <option value="rocket"> {t("rocket")} </option>
                      <option value="nagad"> {t("nagad")} </option>
                      <option value="others"> {t("others")} </option>
                    </SelectField>
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
                  <div className="d-flex align-self-end">
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
                        class="form-control shadow-none"
                        placeholder={t("writeNote")}
                        id="noteField"
                        onChange={(e) => setNote(e.target.value)}
                      ></textarea>
                      <label for="noteField"> {t("addNote")} </label>
                    </div>
                  </>
                )}

                {/* Print the report after instant payment component and button */}
                <>
                  {((role === "reseller" &&
                    permission?.instantRechargeBillPrint) ||
                    (role === "collector" &&
                      resellerData.permission?.instantRechargeBillPrint)) && (
                    <div className="d-none">
                      <RechargePrintInvoice
                        ref={resellerRechargePrint}
                        customerData={customerData}
                        billingData={responseData}
                        ispOwnerData={ispOwnerData}
                      />
                    </div>
                  )}

                  <div className="d-none">
                    <ReactToPrint
                      documentTitle={t("saddda")}
                      trigger={() => (
                        <div
                          title={t("printInvoiceBill")}
                          style={{ cursor: "pointer" }}
                        >
                          <button type="button" id="printButtonReseller">
                            Print
                          </button>
                        </div>
                      )}
                      content={() => resellerRechargePrint.current}
                    />
                  </div>
                </>
              </div>

              <div className="d-flex justify-content-end mt-5">
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
