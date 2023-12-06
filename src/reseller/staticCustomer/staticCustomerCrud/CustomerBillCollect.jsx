import { useEffect, useRef, useState } from "react";
import { Form, Formik } from "formik";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import ReactToPrint from "react-to-print";
import { Card } from "react-bootstrap";

//internal imports
import "../../Customer/customer.css";
import { FtextField } from "../../../components/common/FtextField";
import {
  billCollect,
  getResellerPackageRate,
} from "../../../features/apiCallReseller";
import Loader from "../../../components/common/Loader";
import RechargePrintInvoice from "../../../pages/Customer/customerCRUD/bulkOpration/RechargePrintInvoice";
import SelectField from "../../../components/common/SelectField";
import useISPowner from "../../../hooks/useISPOwner";
import { CashStack } from "react-bootstrap-icons";
import { toast } from "react-toastify";

const CustomerBillCollect = ({ customerId, customerData, status }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const resellerRechargePrint = useRef();

  // current month date
  const date = new Date();
  const monthDate = date.getMonth();

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

  // get user & current user data form useISPOwner
  const {
    role,
    ispOwnerData,
    ispOwnerId,
    resellerData,
    permission,
    userData,
    currentUser,
  } = useISPowner();

  // get reseller areas static customer form redux store
  const customer = useSelector((state) => state?.customer?.staticCustomer);

  // single customer find
  const data = customer.find((item) => item.id === customerId);

  //loading state
  const [isLoading, setLoading] = useState(false);

  // set reseller package rate
  const [packageRate, setPackageRate] = useState();
  const [billAmount, setBillAmount] = useState();

  //calculation total bill due & amount
  const [balanceDue, setBalanceDue] = useState();

  //set customer bill type
  const [billType, setBillType] = useState("bill");

  //billing date
  const [startDate, setStartDate] = useState(false);
  const [endDate, setEndDate] = useState(false);

  // bill report note checkd
  const [noteCheck, setNoteCheck] = useState(false);

  // set bill note
  const [note, setNote] = useState("");

  // customer biill date month set is requerd
  const [selectedMonth, setSelectedMonth] = useState([]);

  const [responseData, setResponseData] = useState({});
  const [test, setTest] = useState(false);

  // calculation
  const totalAmount = Number(billAmount) + Number(balanceDue);

  useEffect(() => {
    //get reseller package based commission
    data &&
      userData?.commissionType === "packageBased" &&
      userData?.commissionStyle === "fixedRate" &&
      getResellerPackageRate(
        data?.reseller,
        data?.mikrotikPackage,
        setPackageRate
      );

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

    let temp = [];

    // customer billing date
    const dataMonth = new Date(data?.billingCycle).getMonth();

    if (data?.balance === 0 && data?.paymentStatus === "unpaid") {
      // month to monthly bill
      temp.push(options[dataMonth]);
    } else if (data?.balance === 0 && data?.paymentStatus === "paid") {
      // month to monthly bill
      temp.push(options[dataMonth]);
    } else if (
      data?.balance >= data?.monthlyFee &&
      data?.paymentStatus === "paid"
    ) {
      // customer advance monthly bill
      const modVal = Math.floor(data?.balance / data?.monthlyFee);
      temp.push(options[dataMonth + modVal]);

      if (dataMonth + modVal > 11) {
        const totalMonth = dataMonth + modVal - 12;
        temp.push(options[totalMonth]);
      }
    } else if (
      data?.balance < 0 &&
      data?.paymentStatus === "unpaid" &&
      (data?.status === "active" || data?.status === "expired")
    ) {
      // customer privous monthly bill
      const modVal = Math.floor(Math.abs(data?.balance / data?.monthlyFee));

      // customer privous years total due month
      const dueMonth = dataMonth - modVal;

      //find customer privous years dou month
      if (dueMonth < 0) {
        const totalMonth = 12 - Math.abs(dueMonth);

        for (let i = totalMonth; i <= 11; i++) {
          temp.push(options[i]);
        }
      }

      //find customer current years dou month
      if (modVal < 11) {
        for (let i = dueMonth; i <= dataMonth; i++) {
          if (!(i < 0)) {
            temp.push(options[i]);
          }
        }
      }
    } else if (
      data?.balance < 0 &&
      data?.paymentStatus === "unpaid" &&
      data?.status === "inactive"
    ) {
      // customer privous monthly bill
      const modVal = Math.floor(Math.abs(data?.balance / data?.monthlyFee));

      // customer total due month
      const dueMonth = dataMonth - modVal;

      //find customer privous years dou month
      if (dueMonth < 0) {
        const totalMonth = 12 - Math.abs(dueMonth);

        for (let i = totalMonth; i <= 11; i++) {
          temp.push(options[i]);
        }
      }

      //find customer current years dou month
      if (modVal < 11) {
        for (let i = dueMonth; i <= monthDate; i++) {
          if (!(i < 0)) {
            temp.push(options[i]);
          }
        }
      }
    }

    setSelectedMonth(temp);
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

  // customer bill validation
  const BillValidatoin = Yup.object({
    amount: Yup.number()
      .min(
        billType === "bill"
          ? ((userData?.commissionType === "packageBased" &&
              userData?.commissionStyle === "fixedRate" &&
              packageRate?.ispOwnerRate) ||
              !(
                userData?.commissionType === "packageBased" &&
                userData?.commissionStyle === "fixedRate"
              )) &&
            data?.balance < data?.monthlyFee
            ? data?.monthlyFee - data?.balance
            : data?.monthlyFee
          : "",
        t("billNotAcceptable")
      )
      .integer(t("decimalNumberNotAcceptable")),
  });

  // bill amount
  const customerBillHandler = (formValue) => {
    if (
      billType !== "connectionFee" &&
      userData?.commissionType === "packageBased" &&
      userData?.commissionStyle === "fixedRate" &&
      packageRate.ispOwnerRate > formValue.amount
    ) {
      toast.error(t("rechargeAmountMustBeUptoIspOwnerRate"));
      return;
    }

    if (
      !(
        billType !== "connectionFee" &&
        userData?.commissionType === "packageBased" &&
        userData?.commissionStyle === "fixedRate"
      ) &&
      data?.monthlyFee > formValue.amount + data?.balance
    ) {
      toast.error(t("rechargeAmountMustBeUptoOrEqualMonthlyFee"));
      return;
    }

    const sendingData = {
      amount: formValue.amount,
      collectedBy: currentUser?.user.role,
      billType: billType,
      name: userData.name,
      customer: data?.id,
      ispOwner: ispOwnerId,
      user: currentUser?.user.id,
      collectorId: userData?.id, //when collector is logged in
      medium: formValue.medium,
      package: data.queue.package,
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
      setLoading,
      resetForm,
      setResponseData,
      setTest,
      status,
      ""
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
      <Card.Title className="clintTitle mb-0">
        <h5 className="profileInfo">{t("recharge")}</h5>
      </Card.Title>

      <Card.Body>
        <Formik
          initialValues={{
            amount:
              data?.balance < data?.monthlyFee
                ? data?.monthlyFee - data?.balance
                : data?.monthlyFee,
            medium: "cash",
          }}
          validationSchema={BillValidatoin}
          onSubmit={(values) => {
            customerBillHandler(values);
          }}
          enableReinitialize
        >
          {() => (
            <Form>
              <div className="monthlyBill">
                <span className="text-secondary">{data?.name}</span>&nbsp;
                <span className="text-secondary">{t("totalAmount")} ৳</span>
                <span className="text-primary">{totalAmount} </span>
              </div>

              <div className="displayGrid">
                <div className="displayGrid2">
                  <FtextField type="number" name="amount" label={t("amount")} />

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
                  <div>
                    <label className="form-control-label changeLabelFontColor">
                      {t("billType")}
                    </label>
                    <select
                      className="form-select mt-0"
                      onChange={(e) => setBillType(e.target.value)}
                    >
                      <option value="bill"> {t("bill")} </option>
                      <option value="connectionFee">
                        {t("connectionFee")}
                      </option>
                    </select>
                  </div>

                  <div className="d-flex align-self-end">
                    <input
                      type="checkbox"
                      className="form-check-input me-1"
                      id="addNOte"
                      onChange={(e) => setNoteCheck(e.target.checked)}
                      checked={noteCheck}
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
                          selected={startDate}
                          className="form-control mw-100"
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
                          selected={endDate}
                          className="form-control mw-100"
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
                        placeholder={t("noteAdd")}
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
