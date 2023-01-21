import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import "../../collector/collector.css";
import "../customer.css";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import { fetchPackagefromDatabase } from "../../../features/apiCalls";
import moment from "moment";
import { addStaticCustomerApi } from "../../../features/staticCustomerApi";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";

export default function AddStaticCustomer() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get user bp setting
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.userData?.bpSettings
  );

  // get role from redux
  const role = useSelector((state) => state.persistedReducer.auth?.role);

  // get Isp owner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  const userType = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData?.bpSettings.queueType
  );

  // get all area
  const area = useSelector((state) => state?.area?.area);

  // get all mikrotik
  const Getmikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  const ppPackage = useSelector((state) =>
    bpSettings?.hasMikrotik
      ? state?.mikrotik?.packagefromDatabase
      : state?.package?.packages
  );

  const [packageRate, setPackageRate] = useState({ rate: 0 });
  const [isLoading, setIsloading] = useState(false);
  const [singleMikrotik, setSingleMikrotik] = useState("");
  const [mikrotikPackage, setMikrotikPackage] = useState("");
  const [autoDisable, setAutoDisable] = useState(true);
  const [subArea, setSubArea] = useState("");
  const [billDate, setBillDate] = useState(new Date());
  const [connectionDate, setConnectionDate] = useState(new Date());
  const [maxUpLimit, setUpMaxLimit] = useState("");
  const [maxDownLimit, setDownMaxLimit] = useState("");
  const [monthlyFee, setMonthlyFee] = useState(packageRate?.rate || 0);
  // customer validator
  const customerValidator = Yup.object({
    name: Yup.string().required(t("writeCustomerName")),
    mobile: Yup.string()
      .matches(/^(01){1}[3456789]{1}(\d){8}$/, t("incorrectMobile"))
      .min(11, t("write11DigitMobileNumber"))
      .max(11, t("over11DigitMobileNumber")),
    referenceMobile: Yup.string()
      .matches(/^(01){1}[3456789]{1}(\d){8}$/, t("incorrectMobile"))
      .min(11, t("write11DigitMobileNumber"))
      .max(11, t("over11DigitMobileNumber")),
    address: Yup.string(),
    email: Yup.string().email(t("incorrectEmail")),
    nid: Yup.string(),
    // monthlyFee: Yup.number()
    //   .integer()
    //   .min(0, "সর্বনিম্ন প্যাকেজ রেট 0")
    //   .required("প্যাকেজ রেট দিন"),
  });

  const selectMikrotik = (e) => {
    const id = e.target.value;
    if (id && ispOwnerId) {
      const IDs = {
        ispOwner: ispOwnerId,
        mikrotikId: id,
      };
      //ToDo
      if (bpSettings?.hasMikrotik) {
        fetchPackagefromDatabase(dispatch, IDs, setIsloading);
      }
    }
    setSingleMikrotik(id);
  };

  // select subArea
  const selectSubArea = (data) => {
    const areaId = data.target.value;
    if (area) {
      const temp = area.find((val) => {
        return val.id === areaId;
      });
      setSubArea(temp);
    }
  };

  //function for set 0
  const setPackageLimit = (value, isDown) => {
    setMikrotikPackage(value);
    const temp = ppPackage.find((val) => val.id === value);
    if (isDown) {
      setPackageRate(temp);
      setMonthlyFee(temp.rate);
    }
    if (value === "unlimited") return "0";
    const getLetter = temp.name.toLowerCase();
    if (getLetter.indexOf("m") !== -1) {
      const setZero = getLetter.replace("m", "000000");
      return setZero;
    }
    if (getLetter.indexOf("k") !== -1) {
      const setZero = getLetter.replace("k", "000");
      return setZero;
    }
  };

  // select Mikrotik Package
  const selectMikrotikPackage = ({ target }) => {
    if (target.value === "0") {
      setPackageRate({ rate: 0 });
    } else {
      if (target.name === "firewallPackage") {
        setMikrotikPackage(target.value);
        const temp = ppPackage.find((val) => val.id === target.value);
        setPackageRate(temp);
        setMonthlyFee(temp.rate);
      }

      if (target.name === "upPackage") {
        const getLimit = setPackageLimit(target.value, false);
        getLimit && setUpMaxLimit(getLimit);
      }
      if (target.name === "downPackage") {
        const getLimit = setPackageLimit(target.value, true);
        getLimit && setDownMaxLimit(getLimit);
      }
    }
  };

  // sending data to backed
  const customerHandler = async (data, resetForm) => {
    const subArea2 = document.getElementById("subAreaId").value;
    if (subArea2 === "") {
      setIsloading(false);
      return alert(t("selectSubArea"));
    }
    if (!mikrotikPackage) {
      setIsloading(false);
      return alert(t("selectDownloadPackage"));
    }
    const { balance, ipAddress, queueName, target, customerId, ...rest } = data;
    if (!bpSettings.genCustomerId) {
      if (!customerId) {
        return alert(t("writeCustomerId"));
      }
    }
    const mainData = {
      paymentStatus: "unpaid",
      subArea: subArea2,
      ispOwner: ispOwnerId,
      mikrotik: singleMikrotik,
      mikrotikPackage: mikrotikPackage,
      billPayType: "prepaid",
      autoDisable: autoDisable,
      billingCycle: billDate?.toISOString(),
      connectionDate: connectionDate?.toISOString(),
      balance: -balance,
      ...rest,
      monthlyFee,
    };
    if (!bpSettings.hasMikrotik) {
      delete mainData.mikrotik;
      delete mainData.autoDisable;
    }
    if (!bpSettings.genCustomerId) {
      mainData.customerId = customerId;
    }
    let sendingData = { ...mainData };
    if (userType === "firewall-queue") {
      sendingData.userType = "firewall-queue";
      sendingData.queue = {
        type: userType,
        address: ipAddress,
        list: "allow_ip",
      };
    }
    if (userType === "simple-queue") {
      sendingData.userType = "simple-queue";
      sendingData.queue = {
        name: queueName,
        type: userType,
        target,
        maxLimit: `${maxUpLimit}/${maxDownLimit}`,
      };
    }
    addStaticCustomerApi(dispatch, sendingData, setIsloading, resetForm);
  };

  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="addStaticCustomerModal"
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
                  balance: "",
                  ipAddress: "",
                  queueName: "",
                  target: "",
                  referenceName: "",
                  referenceMobile: "",
                  customerId: "",
                }}
                validationSchema={customerValidator}
                onSubmit={(values, { resetForm }) => {
                  customerHandler(values, resetForm);
                }}
              >
                {(formik) => (
                  <Form>
                    <div className="row">
                      {bpSettings?.hasMikrotik && (
                        <div className="col-lg-4 col-md-4 col-xs-6">
                          <label className="form-control-label changeLabelFontColor">
                            {t("selectMikrotik")}{" "}
                          </label>
                          <select
                            className="form-select mw-100 mt-0"
                            aria-label="Default select example"
                            onChange={selectMikrotik}
                          >
                            <option value="">...</option>
                            {Getmikrotik.length === undefined
                              ? ""
                              : Getmikrotik.map((val, key) => (
                                  <option key={key} value={val.id}>
                                    {val.name}
                                  </option>
                                ))}
                          </select>
                        </div>
                      )}
                      <div className="col-lg-4 col-md-4 col-xs-6">
                        <label className="form-control-label changeLabelFontColor">
                          {t("selectArea")}{" "}
                        </label>
                        <select
                          className="form-select mw-100 mt-0"
                          aria-label="Default select example"
                          onChange={selectSubArea}
                        >
                          <option value="">...</option>
                          {area.length === undefined
                            ? ""
                            : area.map((val, key) => (
                                <option key={key} value={val.id}>
                                  {val.name}
                                </option>
                              ))}
                        </select>
                      </div>

                      <div className="col-lg-4 col-md-4 col-xs-6">
                        <label className="form-control-label changeLabelFontColor">
                          {subArea ? subArea.name + " এর - " : ""}{" "}
                          {t("selectSubArea")}{" "}
                        </label>
                        <select
                          className="form-select mw-100 mt-0"
                          aria-label="Default select example"
                          name="subArea"
                          id="subAreaId"
                        >
                          <option value="">...</option>
                          {subArea?.subAreas
                            ? subArea.subAreas.map((val, key) => (
                                <option key={key} value={val.id}>
                                  {val.name}
                                </option>
                              ))
                            : ""}
                        </select>
                      </div>
                    </div>
                    <div className="row mt-4">
                      {userType === "simple-queue" && (
                        <div className="col-lg-4 col-md-4 col-xs-6">
                          <FtextField
                            type="text"
                            label={t("queueName")}
                            name="queueName"
                          />
                        </div>
                      )}

                      <div className="col-lg-4 col-md-4 col-xs-6">
                        {userType === "simple-queue" && (
                          <FtextField
                            type="text"
                            label={t("ipAddress")}
                            name="target"
                          />
                        )}
                        {userType === "firewall-queue" && (
                          <>
                            <FtextField
                              type="text"
                              label={t("ipAddress")}
                              name="ipAddress"
                            />
                          </>
                        )}
                      </div>
                      {bpSettings?.hasMikrotik &&
                        userType === "firewall-queue" && (
                          <div className="col-lg-4 col-md-4 col-xs-6">
                            <>
                              <label className="form-control-label changeLabelFontColor">
                                {t("selectPackage")}{" "}
                              </label>
                              <select
                                name="firewallPackage"
                                className="form-select mw-100 mb-3 mt-0"
                                aria-label="Default select example"
                                onChange={selectMikrotikPackage}
                              >
                                <option value={"0"}>...</option>
                                {ppPackage &&
                                  ppPackage?.map(
                                    (val, key) =>
                                      val.packageType === "queue" && (
                                        <option key={key} value={val.id}>
                                          {val.name}
                                        </option>
                                      )
                                  )}
                              </select>
                            </>
                          </div>
                        )}

                      <div className="col-lg-4 col-md-4 col-xs-6">
                        {bpSettings?.hasMikrotik &&
                          userType === "simple-queue" && (
                            <>
                              <label className="form-control-label changeLabelFontColor">
                                {t("uploadPackge")}{" "}
                              </label>
                              <select
                                name="upPackage"
                                className="form-select mw-100 mt-0"
                                aria-label="Default select example"
                                onChange={selectMikrotikPackage}
                              >
                                <option value={"0"}>...</option>
                                {ppPackage &&
                                  ppPackage?.map(
                                    (val, key) =>
                                      val.packageType === "queue" && (
                                        <option key={key} value={val.id}>
                                          {val.name}
                                        </option>
                                      )
                                  )}
                              </select>
                            </>
                          )}
                      </div>
                    </div>

                    <div className="row">
                      {bpSettings?.hasMikrotik &&
                        userType === "simple-queue" && (
                          <div className="col-lg-4 col-md-4 col-xs-6">
                            <label className="form-control-label changeLabelFontColor">
                              {t("downloadPackge")}
                            </label>
                            <select
                              name="downPackage"
                              className="form-select mw-100 mb-3 mt-0"
                              aria-label="Default select example"
                              onChange={selectMikrotikPackage}
                            >
                              <option value={"0"}>...</option>
                              {ppPackage &&
                                ppPackage?.map(
                                  (val, key) =>
                                    val.packageType === "queue" && (
                                      <option key={key} value={val.id}>
                                        {val.name}
                                      </option>
                                    )
                                )}
                            </select>
                          </div>
                        )}

                      {!bpSettings?.hasMikrotik && (
                        <div className="col-lg-4 col-md-4 col-xs-6">
                          <label className="form-control-label changeLabelFontColor">
                            {t("downloadPackge")}
                          </label>
                          <select
                            name="downPackage"
                            className="form-select mw-100 mb-3 mt-0"
                            aria-label="Default select example"
                            onChange={selectMikrotikPackage}
                          >
                            <option value={"0"}>...</option>
                            {ppPackage &&
                              ppPackage?.map((val, key) => (
                                <option key={key} value={val.id}>
                                  {val.name}
                                </option>
                              ))}
                          </select>
                        </div>
                      )}
                      <div className="col-lg-4 col-md-4 col-xs-6">
                        <FtextField
                          type="number"
                          label={t("monthFee")}
                          name="monthlyFee"
                          min={0}
                          value={monthlyFee}
                          onChange={(e) => setMonthlyFee(e.target.value)}
                        />
                      </div>
                      {!bpSettings?.hasMikrotik && (
                        <div className="col-lg-4 col-md-4 col-xs-6">
                          <FtextField
                            type="number"
                            label={t("prevDue")}
                            name="balance"
                          />
                        </div>
                      )}
                      <div className="col-lg-4 col-md-4 col-xs-6">
                        <FtextField type="text" label={t("NIDno")} name="nid" />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-4 col-md-4 col-xs-6">
                        <FtextField type="text" label={t("name")} name="name" />
                      </div>
                      <div className="col-lg-4 col-md-4 col-xs-6">
                        <FtextField
                          type="text"
                          label={t("mobile")}
                          name="mobile"
                        />
                      </div>
                      <div className="col-lg-4 col-md-4 col-xs-6">
                        <FtextField
                          type="text"
                          label={t("address")}
                          name="address"
                        />
                      </div>
                      <div className="col-lg-4 col-md-4 col-xs-6">
                        <FtextField
                          type="text"
                          label={t("email")}
                          name="email"
                        />
                      </div>
                      <div className="col-lg-4 col-md-4 col-xs-6">
                        <div className="billCycle">
                          <label className="form-control-label changeLabelFontColor">
                            {t("billingCycle")}{" "}
                          </label>

                          <DatePicker
                            className="form-control mw-100"
                            selected={billDate}
                            onChange={(date) => setBillDate(date)}
                            dateFormat="MMM dd yyyy hh:mm"
                            showTimeSelect
                            placeholderText={t("selectBillDate")}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4 col-xs-6">
                        <label className="form-control-label changeLabelFontColor">
                          {t("connectionDate")}
                        </label>
                        <DatePicker
                          className="form-control mw-100"
                          selected={connectionDate}
                          onChange={(date) => setConnectionDate(date)}
                          dateFormat="MMM dd yyyy"
                          maxDate={new Date()}
                          placeholderText={t("selectDate")}
                          disabled={!mikrotikPackage}
                        />
                      </div>
                      <div className="col-lg-4 col-md-4 col-xs-6">
                        <FtextField
                          type="text"
                          label={t("referenceName")}
                          name="referenceName"
                          disabled={!mikrotikPackage}
                        />
                      </div>
                      <div className="col-lg-4 col-md-4 col-xs-6">
                        <FtextField
                          type="text"
                          label={t("referenceMobile")}
                          name="referenceMobile"
                          disabled={!mikrotikPackage}
                        />
                      </div>
                      <div className="col-lg-4 col-md-4 col-xs-6">
                        {!bpSettings?.genCustomerId && (
                          <FtextField
                            type="text"
                            label={t("customerId")}
                            name="customerId"
                            disabled={!mikrotikPackage}
                            validation={"true"}
                          />
                        )}
                      </div>
                      <div className="col-lg-4 col-md-4 col-xs-6">
                        {bpSettings?.hasMikrotik && (
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
