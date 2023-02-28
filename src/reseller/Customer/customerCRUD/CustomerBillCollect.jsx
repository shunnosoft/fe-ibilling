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
} from "../../../features/apiCallReseller";
import Loader from "../../../components/common/Loader";
import DatePicker from "react-datepicker";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useEffect } from "react";
const animatedComponents = makeAnimated();

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

export default function CustomerBillCollect({ single }) {
  const { t } = useTranslation();
  const customer = useSelector((state) => state?.customer?.customer);

  const data = customer.find((item) => item.id === single);

  const [billType, setBillType] = useState("bill");

  const role = useSelector((state) => state.persistedReducer.auth?.role);
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );
  const userData = useSelector((state) => state.persistedReducer.auth.userData);

  const currentUser = useSelector(
    (state) => state.persistedReducer.auth?.currentUser
  );
  const collectorPermission = useSelector(
    (state) => state.persistedReducer.auth?.userData?.permissions
  );

  const resellerCommission = useSelector(
    (state) => state.persistedReducer.auth?.userData
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
  const [packageRate, setPackageRate] = useState();

  const BillValidatoin = Yup.object({
    amount: Yup.number()
      .min(
        (resellerCommission.commissionType === "packageBased" &&
          resellerCommission.commissionStyle === "fixedRate" &&
          packageRate?.ispOwnerRate) ||
          (!(
            resellerCommission.commissionType === "packageBased" &&
            resellerCommission.commissionStyle === "fixedRate"
          ) && data?.balance < data?.monthlyFee
            ? data?.monthlyFee - data?.balance
            : data?.monthlyFee),
        t("billNotAcceptable")
      )
      .integer(t("decimalNumberNotAcceptable")),
  });

  useEffect(() => {
    data &&
      resellerCommission.commissionType === "packageBased" &&
      resellerCommission.commissionStyle === "fixedRate" &&
      getResellerPackageRate(
        data?.reseller,
        data?.mikrotikPackage,
        setPackageRate
      );
  }, [data]);

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
      resellerCommission.commissionType === "packageBased" &&
      resellerCommission.commissionStyle === "fixedRate" &&
      packageRate.ispOwnerRate > formValue.amount
    ) {
      toast.error(t("rechargeAmountMustBeUptoIspOwnerRate"));
      return;
    }

    if (
      !(
        resellerCommission.commissionType === "packageBased" &&
        resellerCommission.commissionStyle === "fixedRate"
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
    billCollect(dispatch, sendingData, setLoading, resetForm);
  };

  return (
    <div>
      <div>
        <div
          className="modal fade"
          id="collectCustomerBillModal"
          tabIndex="-1"
          aria-labelledby="customerModalDetails"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content">
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
                      <div className="bill_collect_form">
                        <div className="w-100 me-2">
                          <FtextField
                            type="number"
                            name="amount"
                            label="পরিমান"
                          />
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
                        <div className="w-50">
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

                        <div className="mb-2 mt-3">
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
                              class="form-control shadow-none"
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
      </div>
    </div>
  );
}
