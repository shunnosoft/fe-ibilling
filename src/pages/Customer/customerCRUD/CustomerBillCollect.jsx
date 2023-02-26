import { useState } from "react";
import { Form, Formik } from "formik";
import { useSelector } from "react-redux";
import * as Yup from "yup";
//internal imports
import { FtextField } from "../../../components/common/FtextField";
import "../../Customer/customer.css";
import { useDispatch } from "react-redux";
import { billCollect } from "../../../features/apiCalls";
import Loader from "../../../components/common/Loader";
import DatePicker from "react-datepicker";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
const animatedComponents = makeAnimated();

export default function CustomerBillCollect({ single }) {
  const { t } = useTranslation();

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

  // get all customer
  const customer = useSelector((state) => state?.customer?.customer);

  // find editable data
  const data = customer.find((item) => item.id === single);

  // get all role
  const role = useSelector((state) => state.persistedReducer.auth.role);

  // get user permission
  const permission = useSelector(
    (state) => state.persistedReducer.auth.userData.permissions
  );

  const [billType, setBillType] = useState("bill");
  const [amount, setAmount] = useState(null);
  // const [defaultAmount, setDefault] = useState(single.monthlyFee);

  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  const userData = useSelector((state) => state.persistedReducer.auth.userData);

  const currentUser = useSelector(
    (state) => state.persistedReducer.auth?.currentUser
  );

  const currentUserId = useSelector(
    (state) => state.persistedReducer.auth?.userData?.id
  );
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);

  //billing date
  const [startDate, setStartDate] = useState(false);
  const [endDate, setEndDate] = useState(false);
  const [medium, setMedium] = useState("cash");
  const [noteCheck, setNoteCheck] = useState(false);
  const [note, setNote] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [billAmount, setBillAmount] = useState();
  const [balanceDue, setBalanceDue] = useState();
  const totalAmount = Number(billAmount) + Number(balanceDue);
  const maxDiscount = totalAmount;

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
  };

  useEffect(() => {
    setBalanceDue(data?.balance < 0 ? Math.abs(data?.balance) : 0);
    setBillAmount(
      data?.balance > 0 && data?.balance <= data?.monthlyFee
        ? data?.monthlyFee - data?.balance
        : data?.balance > data?.monthlyFee
        ? 0
        : data?.monthlyFee
    );
  }, [data]);

  const handleFormValue = (event) => {
    if (event.target.name === "amount") {
      setBillAmount(event.target.value);
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
      ispOwner: ispOwner,
      user: currentUser?.user.id,
      collectorId: currentUserId, //when collector is logged in
      userType: data?.userType,
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
    billCollect(dispatch, sendingData, setLoading, resetForm);
    setAmount(data.amount);
  };

  return (
    <div
      className="modal fade"
      id="collectCustomerBillModal"
      tabIndex="-1"
      aria-labelledby="customerModalDetails"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-scrollable">
        <div className="modal-content px-3">
          <div className="modal-header">
            <h5
              style={{ color: "#0abb7a" }}
              className="modal-title"
              id="customerModalDetails"
            >
              {t("recharge")}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={resetForm}
            ></button>
          </div>
          <div className="modal-body">
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
              validationSchema={BillValidatoin}
              onSubmit={(values) => {
                customerBillHandler(values);
              }}
              enableReinitialize
            >
              {() => (
                <Form onChange={handleFormValue}>
                  <div className="d-flex flex-wrap">
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
                  </div>
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

                  <div className="d-flex justify-content-between align-items-center">
                    {role === "ispOwner" && (
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
                      <div className="mt-3">
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
                      <div className="month pt-2">
                        <label
                          className="form-check-label changeLabelFontColor"
                          htmlFor="selectMonth"
                        >
                          {t("selectMonth")}
                        </label>
                        <Select
                          className="mt-1"
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
                  <div className="mt-4">
                    <button type="submit" className="btn btn-success">
                      {isLoading ? <Loader /> : t("submit")}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
