import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import "../../collector/collector.css";
import "../customer.css";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import {
  addCustomer,
  fetchpppoePackage,
  getSubAreas,
} from "../../../features/apiCallReseller";
import moment from "moment";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";

export default function CustomerModal() {
  const { t } = useTranslation();

  // import dispatch
  const dispatch = useDispatch();

  // get user role from redux
  const userRole = useSelector((state) => state.persistedReducer.auth?.role);

  // get user data from redux
  const userData = useSelector(
    (state) => state.persistedReducer.auth?.userData
  );

  const resellerId = useSelector((state) =>
    userRole === "reseller"
      ? state.persistedReducer.auth?.userData?.id
      : state.persistedReducer.auth?.userData?.reseller
  );

  // const area = useSelector(
  //   (state) => state.persistedReducer.auth?.userData.areas
  // );

  // get are from redux
  const area = useSelector((state) => state?.area?.area);

  // get reseller from redux
  const reseller = useSelector(
    (state) => state.persistedReducer.auth?.userData
  );

  //sub area id state
  const [subAreaId, setsubAreaId] = useState("");

  // get mikrotik from redux
  const Getmikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  // get mikrotik package from redux
  const ppPackage = useSelector((state) => state?.mikrotik?.pppoePackage);

  // package rate sate
  const [packageRate, setPackageRate] = useState("");

  // loading state
  const [isLoading, setIsloading] = useState(false);

  // set mikrotik id state
  const [singleMikrotik, setSingleMikrotik] = useState("");

  // set package state
  const [mikrotikPackage, setMikrotikPackage] = useState("");

  // auto disable state
  const [autoDisable, setAutoDisable] = useState(true);

  // set bill date state
  const [billDate, setBillDate] = useState(new Date());

  // form validation validator
  const customerValidator = Yup.object({
    name: Yup.string().required(t("writeCustomerName")),
    mobile: Yup.string()
      .matches(/^(01){1}[3456789]{1}(\d){8}$/, t("incorrectMobile"))
      .min(11, t("write11DigitMobileNumber"))
      .max(11, t("over11DigitMobileNumber"))
      .required(t("writeMobileNumber")),
    address: Yup.string(),
    email: Yup.string().email(t("incorrectEmail")),
    nid: Yup.string(),
    monthlyFee: Yup.string().required(t("writeMonthFee")),
    Pname: Yup.string().required(t("writePPPoEName")),
    Ppassword: Yup.string().required(t("writePPPoEPassword")),
    Pcomment: Yup.string(),
  });

  // select Getmikrotik
  const selectMikrotik = (e) => {
    const id = e.target.value;
    if (id && resellerId) {
      const IDs = {
        reseller: resellerId,
        mikrotikId: id,
      };
      fetchpppoePackage(dispatch, IDs);
    }
    setSingleMikrotik(id);
  };

  // select Mikrotik Package
  const selectMikrotikPackage = (e) => {
    const mikrotikPackageId = e.target.value;
    setMikrotikPackage(mikrotikPackageId);
    const temp = ppPackage.find((val) => val.id === mikrotikPackageId);
    setPackageRate(temp);
  };

  // sending data to backed
  const customerHandler = async (data, resetForm) => {
    if (!mikrotikPackage) {
      return alert(t("selectPackage"));
    }

    if (!subAreaId) {
      return alert(t("selectArea"));
    }

    const { Pname, Ppassword, Pprofile, Pcomment, ...rest } = data;
    const mainData = {
      // customerId: "randon123",
      paymentStatus: "unpaid",
      ispOwner: userData.ispOwner,
      subArea: subAreaId,
      reseller: resellerId,
      mikrotikPackage: mikrotikPackage,
      billPayType: "prepaid",
      billingCycle: billDate.toISOString(),
      pppoe: {
        name: Pname,
        password: Ppassword,
        service: "pppoe",
        comment: Pcomment,
        profile: Pprofile,
      },
      ...rest,
    };

    if (Getmikrotik.length > 0) {
      if (!singleMikrotik) {
        return alert(t("selectMikrotik"));
      }
      mainData.mikrotik = singleMikrotik;
      mainData.autoDisable = autoDisable;
    }
    addCustomer(dispatch, mainData, setIsloading, resetForm);
  };

  const selectArea = (e) => {
    setsubAreaId(e);
  };

  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="customerModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {t("addNewCustomer")}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {/* model body here */}
              <Formik
                initialValues={{
                  name: "",
                  mobile: "",
                  address: "",
                  email: "",
                  nid: "",
                  monthlyFee: packageRate?.rate || "",
                  Pname: "",
                  Pprofile: packageRate?.name || "",
                  Ppassword: "",
                  Pcomment: "",
                }}
                validationSchema={customerValidator}
                onSubmit={(values, { resetForm }) => {
                  customerHandler(values, resetForm);
                }}
                enableReinitialize
              >
                {(formik) => (
                  <Form>
                    <div className="mikrotikSection ">
                      {/* pppoe package */}
                      {(userRole === "ispOwner" ||
                        userRole === "collector" ||
                        userRole === "manager") && (
                        <>
                          <div>
                            <label className="form-control-label changeLabelFontColor">
                              {t("selectMikrotik")}
                            </label>
                            <select
                              className="form-select mw-100 mt-0"
                              aria-label="Default select example"
                              onChange={selectMikrotik}
                            >
                              <option value="">...</option>
                              {Getmikrotik?.length === undefined
                                ? ""
                                : Getmikrotik?.map((val, key) => (
                                    <option key={key} value={val.id}>
                                      {val.name}
                                    </option>
                                  ))}
                            </select>
                          </div>

                          <div>
                            <p style={{ marginBottom: "0rem" }}>
                              {t("selectPPPoEPackage")}
                            </p>
                            <select
                              style={{ width: "22rem" }}
                              className="form-select mb-3 mw-100"
                              aria-label="Default select example"
                              onChange={selectMikrotikPackage}
                            >
                              <option value="">...</option>
                              {ppPackage.length === undefined
                                ? ""
                                : ppPackage?.map((val, key) => (
                                    <option key={key} value={val.id}>
                                      {val.name}
                                    </option>
                                  ))}
                            </select>
                          </div>
                        </>
                      )}

                      {userRole === "reseller" && Getmikrotik.length > 0 && (
                        <>
                          <div>
                            <label className="form-control-label changeLabelFontColor">
                              {t("selectMikrotik")}
                            </label>
                            <select
                              className="form-select mw-100 mt-0"
                              aria-label="Default select example"
                              onChange={selectMikrotik}
                            >
                              <option value="">...</option>
                              {Getmikrotik?.length === undefined
                                ? ""
                                : Getmikrotik?.map((val, key) =>
                                    reseller.mikrotiks.map(
                                      (item) =>
                                        val.id === item && (
                                          <option key={key} value={val.id}>
                                            {val.name}
                                          </option>
                                        )
                                    )
                                  )}
                            </select>
                          </div>
                          <div>
                            <label className="form-control-label changeLabelFontColor">
                              {t("selectPackage")}
                            </label>
                            <select
                              className="form-select mb-3 mw-100 mt-0"
                              aria-label="Default select example"
                              onChange={selectMikrotikPackage}
                            >
                              <option value="">...</option>
                              {ppPackage.length === undefined
                                ? ""
                                : ppPackage?.map((val, key) =>
                                    reseller.mikrotikPackages.map(
                                      (p) =>
                                        p === val.id && (
                                          <option key={key} value={val.id}>
                                            {val.name}
                                          </option>
                                        )
                                    )
                                  )}
                            </select>
                          </div>
                        </>
                      )}

                      {userRole === "reseller" && Getmikrotik.length == 0 && (
                        <>
                          <div>
                            <label className="form-control-label changeLabelFontColor">
                              {t("selectPPPoEPackage")}
                            </label>
                            <select
                              className="form-select mb-3 mt-0 mw-100"
                              aria-label="Default select example"
                              onChange={selectMikrotikPackage}
                            >
                              <option value="">...</option>
                              {ppPackage.length === undefined
                                ? ""
                                : ppPackage?.map((val, key) =>
                                    reseller.mikrotikPackages.map(
                                      (p) =>
                                        p === val.id && (
                                          <option key={key} value={val.id}>
                                            {val.name}
                                          </option>
                                        )
                                    )
                                  )}
                            </select>
                          </div>
                        </>
                      )}

                      <FtextField
                        type="text"
                        label={t("monthFee")}
                        name="monthlyFee"
                      />
                    </div>

                    <div className="pppoeSection2">
                      <FtextField
                        type="text"
                        label={t("PPPoEName")}
                        name="Pname"
                      />
                      <FtextField
                        type="text"
                        label={t("password")}
                        name="Ppassword"
                      />
                      <FtextField
                        type="text"
                        label={t("comment")}
                        name="Pcomment"
                      />
                    </div>

                    <div className="displayGrid3">
                      <div>
                        <label className="form-control-label changeLabelFontColor">
                          {t("selectArea")}
                        </label>
                        <select
                          className="form-select mw-100 mt-0"
                          aria-label="Default select example"
                          onChange={(e) => selectArea(e.target.value)}
                        >
                          <option value="">...</option>
                          {area?.length === undefined
                            ? ""
                            : area?.map((val, key) => (
                                <option key={key} value={val.id}>
                                  {val.name}
                                </option>
                              ))}
                        </select>
                      </div>

                      <FtextField type="text" label={t("NIDno")} name="nid" />
                      <FtextField type="text" label={t("name")} name="name" />
                    </div>

                    <div className="displayGrid3">
                      <FtextField
                        type="text"
                        label={t("mobile")}
                        name="mobile"
                      />
                      <FtextField
                        type="text"
                        label={t("address")}
                        name="address"
                      />
                      <FtextField type="text" label={t("email")} name="email" />
                    </div>
                    <div className="newDisplay">
                      {userRole === "collector" ? (
                        <div className="billCycle">
                          <label className="form-control-label changeLabelFontColor">
                            {t("billingCycle")}{" "}
                          </label>

                          <DatePicker
                            className="form-control mw-100"
                            selected={billDate}
                            onChange={(date) => setBillDate(date)}
                            dateFormat="dd/MM/yyyy:hh:mm"
                            showTimeSelect
                            maxDate={billDate}
                            placeholderText={t("selectBillDate")}
                            disabled
                          />
                        </div>
                      ) : (
                        <div className="billCycle">
                          <label className="form-control-label changeLabelFontColor">
                            {t("billingCycle")}{" "}
                          </label>

                          <DatePicker
                            className="form-control mw-100"
                            selected={billDate}
                            onChange={(date) => setBillDate(date)}
                            dateFormat="dd/MM/yyyy:hh:mm"
                            showTimeSelect
                            maxDate={billDate}
                            placeholderText={t("selectBillDate")}
                          />
                        </div>
                      )}
                      {Getmikrotik.length > 0 && (
                        <div className="autoDisable">
                          <label> {t("automaticConnectionOff")} </label>
                          <input
                            type="checkBox"
                            checked={autoDisable}
                            onChange={(e) => setAutoDisable(e.target.checked)}
                          />
                        </div>
                      )}
                    </div>

                    <div className="modal-footer" style={{ border: "none" }}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        disabled={isLoading}
                      >
                        {t("cancel")}
                      </button>
                      <button
                        type="submit"
                        className="btn btn-success"
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader /> : t("save")}
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
  );
}
