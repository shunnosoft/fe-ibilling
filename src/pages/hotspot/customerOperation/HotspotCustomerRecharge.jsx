import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import DatePicker from "react-datepicker";
import * as Yup from "yup";
import { CashStack } from "react-bootstrap-icons";
import { toast } from "react-toastify";

// internal import
import { FtextField } from "../../../components/common/FtextField";
import useISPowner from "../../../hooks/useISPOwner";
import Loader from "../../../components/common/Loader";
import { billCollect } from "../../../features/hotspotApi";

const HotspotCustomerRecharge = ({ customerId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  //curent date
  const today = new Date();

  // current month
  const monthDate = today.getMonth();

  //   current month day
  const monthDay = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

  // get user & current user data form useISPOwner
  const { role, ispOwnerId, userData, permissions, currentUser } =
    useISPowner();

  // customer bill recharge validation
  const BillValidatoin = Yup.object({
    amount: Yup.number()
      .min(0, t("billNotAcceptable"))
      .integer(t("decimalNumberNotAcceptable")),
  });

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

  // get hotspot customer
  const customer = useSelector((state) => state.hotspot.customer);

  // single customer find
  const data = customer.find((val) => val.id === customerId);

  //loading state
  const [isLoading, setIsLoading] = useState(false);

  // bil type state
  const [billType, setBillType] = useState("bill");

  // medium state
  const [medium, setMedium] = useState("cash");

  // customer biill date month set is requerd
  const [selectedMonth, setSelectedMonth] = useState(null);

  // note check & note
  const [noteCheck, setNoteCheck] = useState(false);

  // note state
  const [note, setNote] = useState();

  // start date state
  const [startDate, setStartDate] = useState(false);

  // end date state
  const [endDate, setEndDate] = useState(false);

  // Month select according to customer billing cycle
  useEffect(() => {
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

  // bill collect according to customer daily length
  const customerBillHandler = (formValue) => {
    const sendingData = {
      amount: formValue.amount,
      name: userData.name,
      collectedBy: currentUser?.user.role,
      billType: billType,
      hotspotCustomer: data?.id,
      customer: data?.id,
      ispOwner: ispOwnerId,
      user: currentUser?.user.id,
      collectorId: userData.id, //when collector is logged in
      userType: data?.userType,
      medium,
      package: data.hotspot.profile,
    };

    if (note) sendingData.note = note;

    if (startDate && endDate) {
      sendingData.start = startDate.toISOString();
      sendingData.end = endDate.toISOString();
    }

    //  there will be loginc according to customer day length
    if (
      data?.dayLength === 30 ||
      data?.dayLength === 31 ||
      data?.dayLength === monthDay
    ) {
      if (selectedMonth?.length === 0) {
        setIsLoading(false);
        return toast.warn(t("selctMonth"));
      } else {
        const monthValues = selectedMonth?.map((item) => {
          return item.value;
        });
        sendingData.month = monthValues?.join(",");
      }
    } else {
      sendingData.month = `${data?.dayLength}days`;
    }
    // recharge api call
    billCollect(dispatch, sendingData, setIsLoading, resetForm);
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
            dayLength: data?.dayLength,
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
                <span className="text-secondary">{data?.name}</span>
                &nbsp;
                <span className="text-secondary">{t("totalAmount")} ৳</span>
                <span className="text-primary">{data?.monthlyFee} </span>
              </div>
              <div className="displayGrid">
                <div className="displayGrid2">
                  <FtextField type="number" name="amount" label={t("amount")} />

                  <FtextField
                    type="number"
                    name="dayLength"
                    label={t("dayLength")}
                    disabled
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
                      {permissions?.connectionFee ||
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

                {/* there will be options according to customer day length */}
                {(data?.dayLength === 30 ||
                  data?.dayLength === 31 ||
                  data?.dayLength === monthDay) && (
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

                <div className="d-flex justify-content-end">
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

export default HotspotCustomerRecharge;
