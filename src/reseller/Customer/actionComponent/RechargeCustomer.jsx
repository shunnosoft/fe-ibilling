import { useState } from "react";
import { Form, Formik } from "formik";
import { useSelector } from "react-redux";
import * as Yup from "yup";
//internal imports
import { FtextField } from "../../../components/common/FtextField";
import "../../Customer/customer.css";
import { useDispatch } from "react-redux";
import {
  billCollect,
  getResellerPackageRate,
  resellerInfo,
} from "../../../features/apiCallReseller";
import Loader from "../../../components/common/Loader";
import DatePicker from "react-datepicker";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useEffect } from "react";
import ReactToPrint from "react-to-print";
import { useRef } from "react";
import RechargePrintInvoice from "../../../pages/Customer/customerCRUD/bulkOpration/RechargePrintInvoice";
import { Modal, ModalBody, ModalHeader, ModalTitle } from "react-bootstrap";

const options = [
  { value: "January", label: "জানুয়ারী" },
  { value: "February", label: "ফেব্রুয়ারী" },
  { value: "March", label: "মার্চ" },
  { value: "April", label: "এপ্রিল" },
  { value: "May", label: "মে" },
  { value: "June", label: "জুন" },
  { value: "July", label: "জুলাই" },
  { value: "August", label: "আগস্ট" },
  { value: "September", label: "সেপ্টেম্বর" },
  { value: "October", label: "অক্টোবর" },
  { value: "November", label: "নভেম্বর" },
  { value: "December", label: "ডিসেম্বর" },
];

const RechargeCustomer = ({ show, setShow, single, customerData }) => {
  const { t } = useTranslation();

  // current month date
  const date = new Date();
  const monthDate = date.getMonth();

  const customer = useSelector((state) => state?.customer?.customer);

  const data = customer.find((item) => item.id === single);

  const [billType, setBillType] = useState("bill");

  //get roles
  const role = useSelector((state) => state.persistedReducer.auth?.role);

  //get userData info
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  //get userData
  const userData = useSelector((state) => state.persistedReducer.auth.userData);

  //get resellerId from userData store
  const resellerId = useSelector(
    (state) => state.persistedReducer.auth?.userData?.reseller
  );

  //get current loggen in user
  const currentUser = useSelector(
    (state) => state.persistedReducer.auth?.currentUser
  );

  //get resellerCommission
  const resellerCommission = useSelector(
    (state) => state.persistedReducer.auth?.userData
  );

  //get collectorPermission
  const collectorPermission = useSelector(
    (state) => state.persistedReducer.auth?.userData?.permissions
  );

  // get user permission
  const resellerPermission = useSelector(
    (state) => state.persistedReducer.auth.userData.permission
  );

  //get currentUserId
  const currentUserId = useSelector(
    (state) => state.persistedReducer.auth?.userData?.id
  );
  const dispatch = useDispatch();

  const collectorResellerInfo = useSelector(
    (state) => state.resellerProfile.reseller
  );

  const [isLoading, setLoading] = useState(false);

  //billing date
  const [startDate, setStartDate] = useState(false);
  const [endDate, setEndDate] = useState(false);
  const [medium, setMedium] = useState("cash");
  const [noteCheck, setNoteCheck] = useState(false);
  const [note, setNote] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [packageRate, setPackageRate] = useState();
  const resellerRechargePrint = useRef();

  const [responseData, setResponseData] = useState({});
  const [test, setTest] = useState(false);

  const BillValidatoin = Yup.object({
    amount: Yup.number()
      .min(
        (resellerCommission?.commissionType === "packageBased" &&
          resellerCommission?.commissionStyle === "fixedRate" &&
          packageRate?.ispOwnerRate) ||
          (!(
            resellerCommission?.commissionType === "packageBased" &&
            resellerCommission?.commissionStyle === "fixedRate"
          ) && data?.balance < data?.monthlyFee
            ? data?.monthlyFee - data?.balance
            : data?.monthlyFee),
        t("billNotAcceptable")
      )
      .integer(t("decimalNumberNotAcceptable")),
  });

  //print button is clicked after successful response
  useEffect(() => {
    if (test) {
      if (
        (role === "reseller" && resellerPermission?.instantRechargeBillPrint) ||
        (role === "collector" &&
          collectorPermission?.instantRechargeBillPrint &&
          collectorResellerInfo?.permission?.instantRechargeBillPrint)
      ) {
        document.getElementById("printButtonReseller").click();
        setTest(!test);
      }
    }
  }, [test]);

  //api is called to get reseller info for the reseller collector customer
  useEffect(() => {
    role === "collector" && resellerInfo(resellerId, dispatch);
  }, [resellerId]);

  useEffect(() => {
    data &&
      resellerCommission?.commissionType === "packageBased" &&
      resellerCommission?.commissionStyle === "fixedRate" &&
      getResellerPackageRate(
        data?.reseller,
        data?.mikrotikPackage,
        setPackageRate
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

  //modal show handler
  const handleClose = () => {
    setShow(false);
  };

  //form resetFunction
  const resetForm = () => {
    setStartDate(false);
    setEndDate(false);
    setNote("");
    setNoteCheck(false);
    setSelectedMonth(null);
  };

  // bill amount
  const customerBillHandler = (formValue) => {
    if (
      resellerCommission?.commissionType === "packageBased" &&
      resellerCommission?.commissionStyle === "fixedRate" &&
      packageRate.ispOwnerRate > formValue.amount
    ) {
      toast.error(t("rechargeAmountMustBeUptoIspOwnerRate"));
      return;
    }

    if (
      !(
        resellerCommission?.commissionType === "packageBased" &&
        resellerCommission?.commissionStyle === "fixedRate"
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
      ispOwner: ispOwner,
      user: currentUser?.user.id,
      collectorId: currentUserId, //when collector is logged in
      medium,
      package: data.pppoe.profile,
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

    billCollect(
      dispatch,
      sendingData,
      setLoading,
      resetForm,
      setResponseData,
      setTest, //to verify successful response
      "pppoe",
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
                data?.balance < data?.monthlyFee
                  ? data?.monthlyFee - data?.balance
                  : data?.monthlyFee,
            }}
            validationSchema={BillValidatoin}
            onSubmit={(values) => {
              customerBillHandler(values);
            }}
            enableReinitialize
          >
            {() => (
              <Form>
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

                <div className="displayGrid">
                  <div className="displayGrid2">
                    <FtextField type="number" name="amount" label="পরিমান" />

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
                        {role === "reseller" ||
                        collectorPermission?.connectionFee ? (
                          <option value="connectionFee">
                            {t("connectionFee")}
                          </option>
                        ) : (
                          ""
                        )}
                      </select>
                    </div>

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
                      resellerPermission?.instantRechargeBillPrint) ||
                      (role === "collector" &&
                        collectorPermission?.instantRechargeBillPrint &&
                        collectorResellerInfo?.permission
                          ?.instantRechargeBillPrint)) && (
                      <div className="d-none">
                        <RechargePrintInvoice
                          ref={resellerRechargePrint}
                          customerData={customerData}
                          billingData={responseData}
                          ispOwnerData={userData}
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

                <div className="mt-4 float-end">
                  <button type="submit" className="btn btn-success">
                    {isLoading ? <Loader /> : t("submit")}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </Modal>
    </>
  );
};

export default RechargeCustomer;
