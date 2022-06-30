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

export default function AddStaticCustomer() {
  const { t } = useTranslation();
  // get user bp setting
  const bpSettings = useSelector(
    (state) => state?.persistedReducer?.auth?.userData?.bpSettings
  );

  // get role from redux
  const role = useSelector((state) => state?.persistedReducer?.auth?.role);

  // get Isp owner id
  const ispOwnerId = useSelector(
    (state) => state?.persistedReducer?.auth?.ispOwnerId
  );

  const userType = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData?.bpSettings.queueType
  );

  // get all area
  const area = useSelector((state) => state?.persistedReducer?.area?.area);

  // get all mikrotik
  const Getmikrotik = useSelector(
    (state) => state?.persistedReducer?.mikrotik?.mikrotik
  );

  const ppPackage = useSelector((state) =>
    bpSettings?.hasMikrotik
      ? state?.persistedReducer?.mikrotik?.packagefromDatabase
      : state?.package?.packages
  );
  const dispatch = useDispatch();

  const [packageRate, setPackageRate] = useState({ rate: 0 });
  const [isLoading, setIsloading] = useState(false);
  const [singleMikrotik, setSingleMikrotik] = useState("");
  const [mikrotikPackage, setMikrotikPackage] = useState("");
  const [autoDisable, setAutoDisable] = useState(true);
  const [subArea, setSubArea] = useState("");
  const [billDate, setBillDate] = useState();
  const [billTime, setBilltime] = useState();
  const [maxUpLimit, setUpMaxLimit] = useState("");
  const [maxDownLimit, setDownMaxLimit] = useState("");
  const [monthlyFee, setMonthlyFee] = useState(packageRate?.rate || 0);
  // customer validator
  const customerValidator = Yup.object({
    name: Yup.string().required("গ্রাহকের নাম লিখুন"),
    mobile: Yup.string()
      .matches(/^(01){1}[3456789]{1}(\d){8}$/, "মোবাইল নম্বর সঠিক নয়")
      .min(11, "এগারো  ডিজিট এর মোবাইল নম্বর লিখুন")
      .max(11, "এগারো  ডিজিট এর বেশি হয়ে গেছে")
      .required("মোবাইল নম্বর লিখুন"),
    address: Yup.string(),
    email: Yup.string().email("ইমেইল সঠিক নয়"),
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
    // console.log(data);
    const subArea2 = document.getElementById("subAreaId").value;
    if (subArea2 === "") {
      setIsloading(false);
      return alert(t("selectSubArea"));
    }
    const { balance, ipAddress, queueName, target, ...rest } = data;
    const mainData = {
      paymentStatus: "unpaid",
      subArea: subArea2,
      ispOwner: ispOwnerId,
      mikrotik: singleMikrotik,
      mikrotikPackage: mikrotikPackage,
      billPayType: "prepaid",
      autoDisable: autoDisable,
      billingCycle: moment(billDate + " " + billTime)
        .subtract({ hours: 6 })
        .format("YYYY-MM-DDTHH:mm:ss.ms[Z]"),
      balance: -balance,
      ...rest,
      monthlyFee,
    };
    if (!bpSettings.hasMikrotik) {
      delete mainData.mikrotik;
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

  useEffect(() => {
    setBillDate(moment().endOf("day").format("YYYY-MM-DD"));
    setBilltime(moment().endOf("day").format("HH:mm"));
  }, [bpSettings, role]);

  //traget ad ip queue-{name ,target-ip,max-limit,}
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
                }}
                validationSchema={customerValidator}
                onSubmit={(values, { resetForm }) => {
                  customerHandler(values, resetForm);
                }}
              >
                {(formik) => (
                  <Form>
                    <div className="row">
                      <div className="col-lg-4 col-md-4 col-xs-6">
                        <p className="comstomerFieldsTitle">
                          {t("selectMikrotik")}
                        </p>
                        <select
                          className="form-select mw-100"
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
                      <div className="col-lg-4 col-md-4 col-xs-6">
                        <p> {t("selectArea")} </p>
                        <select
                          className="form-select mw-100"
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
                        <p>
                          {subArea ? subArea.name + " এর - " : ""}{" "}
                          {t("selectSubArea")}
                        </p>
                        <select
                          className="form-select mw-100"
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
                      {userType === "firewall-queue" && (
                        <div className="col-lg-4 col-md-4 col-xs-6">
                          <>
                            <p className="comstomerFieldsTitle">
                              {t("selectPackage")}
                            </p>
                            <select
                              name="firewallPackage"
                              className="form-select mw-100 mb-3"
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
                        {userType === "simple-queue" && (
                          <>
                            <p className="comstomerFieldsTitle">
                              {t("uploadPackge")}
                            </p>
                            <select
                              name="upPackage"
                              className="form-select mw-100 mb-3"
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
                      <div className="row mt-3">
                        {userType === "simple-queue" && (
                          <div className="col-lg-4 col-md-4 col-xs-6">
                            <p className="comstomerFieldsTitle">
                              {t("downloadPackge")}
                            </p>
                            <select
                              name="downPackage"
                              className="form-select mw-100 mb-3"
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
                          <FtextField
                            type="text"
                            label={t("NIDno")}
                            name="nid"
                          />
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-lg-4 col-md-4 col-xs-6">
                          <FtextField
                            type="text"
                            label={t("name")}
                            name="name"
                          />
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
                          <p className="customerFieldsTitle">
                            {t("billingCycle")}
                          </p>

                          <div className="timeDate">
                            <input
                              value={billDate}
                              onChange={(e) => setBillDate(e.target.value)}
                              type="date"
                            />
                            <input
                              className="billTime"
                              value={billTime}
                              onChange={(e) => setBilltime(e.target.value)}
                              type="time"
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-xs-6">
                          {bpSettings?.hasMikrotik && (
                            <div className="autoDisable">
                              <label> {t("automaticConnectionOff")} </label>
                              <input
                                type="checkBox"
                                checked={autoDisable}
                                onChange={(e) =>
                                  setAutoDisable(e.target.checked)
                                }
                              />
                            </div>
                          )}
                        </div>
                        <div
                          className="modal-footer"
                          style={{ border: "none" }}
                        >
                          <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                            disabled={isLoading}
                          >
                            {t("cancle")}
                          </button>
                          <button
                            type="submit"
                            className="btn btn-success"
                            disabled={isLoading}
                          >
                            {isLoading ? <Loader /> : t("save")}
                          </button>
                        </div>
                      </div>
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
