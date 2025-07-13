import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import { useState } from "react";
import Select from "react-select";
import ReactDatePicker from "react-datepicker";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { FtextField } from "../../../components/common/FtextField";
import makeAnimated from "react-select/animated";
import Loader from "../../../components/common/Loader";
import { billCollect } from "../../../features/hotspotApi";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";
import { Card } from "react-bootstrap";
import { CashStack } from "react-bootstrap-icons";
const animatedComponents = makeAnimated();

const RechargeCustomer = ({ show, setShow, customerId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

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

  const BillValidatoin = Yup.object({
    amount: Yup.number()
      .min(0, t("billNotAcceptable"))
      .integer(t("decimalNumberNotAcceptable")),
  });

  // user data
  const userData = useSelector((state) => state.persistedReducer.auth.userData);

  // current user
  const currentUser = useSelector(
    (state) => state.persistedReducer.auth?.currentUser
  );

  // get isp owner id
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // get all role
  const role = useSelector((state) => state.persistedReducer.auth.role);

  // get user permission
  const permission = useSelector(
    (state) => state.persistedReducer.auth.userData.permissions
  );

  // get hotspot customer
  const customer = useSelector((state) => state.hotspot.customer);

  // find recharge customer
  const data = customer.find((item) => item.id === customerId);

  // note state
  const [note, setNote] = useState();

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // amount state
  const [amount, setAmount] = useState(null);

  // month state
  const [selectedMonth, setSelectedMonth] = useState(null);

  // start date state
  const [startDate, setStartDate] = useState(false);

  // end date state
  const [endDate, setEndDate] = useState(false);

  // note check state
  const [noteCheck, setNoteCheck] = useState(false);

  // medium state
  const [medium, setMedium] = useState("cash");

  // bil type state
  const [billType, setBillType] = useState("bill");

  //form resetFunction
  const resetForm = () => {
    setStartDate(false);
    setEndDate(false);
    setNote("");
    setNoteCheck(false);
    setSelectedMonth(null);
  };

  const customerBillHandler = (formValue) => {
    const sendingData = {
      amount: formValue.amount,
      name: userData.name,
      collectedBy: currentUser?.user.role,
      billType: billType,
      hotspotCustomer: data?.id,
      ispOwner: ispOwner,
      user: currentUser?.user.id,
      collectorId: userData.id, //when collector is logged in
      userType: data?.userType,
      medium,
      package: data.hotspot.profile,
      due: 0,
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

    // recharge api call
    billCollect(dispatch, sendingData, setIsLoading, setShow, resetForm);
    setAmount(data.amount);
  };

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size={"md"}
        header={data?.name + " " + t("recharge")}
      >
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
                    <td>{t("hotspot")}</td>
                    <td>
                      <b>{data?.hotspot.name}</b>
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
                    <td className="text-primary">
                      <b>{data?.monthlyFee}</b>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="monthlyBill">
                <span className="text-secondary">{data?.name}</span>&nbsp;
                <span className="text-secondary">{t("totalAmount")} ৳</span>
                <span className="text-primary">{data?.monthlyFee} </span>
              </div>

              <div className="displayGrid">
                <div className="displayGrid2">
                  <FtextField type="number" name="amount" label={t("amount")} />

                  <div className="d-inline w-100">
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
                      <option value="others"> {t("otext-thers")} </option>
                    </select>
                  </div>

                  <div>
                    <label className="form-control-label changeLabelFontColor">
                      {t("billType")}
                    </label>
                    <select
                      className="form-select mt-0 mw-100"
                      onChange={(e) => setBillType(e.target.value)}
                    >
                      <option value="bill"> {t("bill")} </option>
                    </select>
                  </div>

                  <div className="text-right mt-4">
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
                  <div className="displayGrid">
                    <div className="displayGrid2">
                      <div>
                        <label className="form-control-label changeLabelFontColor">
                          {t("startDate")}
                        </label>
                        <ReactDatePicker
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
                        <ReactDatePicker
                          className="form-control mw-100"
                          selected={endDate}
                          onChange={(date) => setEndDate(date)}
                          dateFormat="dd/MM/yyyy"
                          placeholderText={t("selectDate")}
                        />
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
                        defaultValue={selectedMonth}
                        onChange={setSelectedMonth}
                        options={options}
                        isMulti={true}
                        placeholder={t("selectMonth")}
                        isSearchable
                        components={animatedComponents}
                        id="selectMonth"
                      />
                    </div>

                    <div class="form-floating">
                      <textarea
                        cols={200}
                        class="form-control shadow-none"
                        placeholder={t("writeNote")}
                        id="noteField"
                        onChange={(e) => setNote(e.target.value)}
                      />
                      <label for="noteField"> {t("addNote")} </label>
                    </div>
                  </div>
                )}
              </div>

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
      </ComponentCustomModal>
    </>
  );
};

export default RechargeCustomer;
