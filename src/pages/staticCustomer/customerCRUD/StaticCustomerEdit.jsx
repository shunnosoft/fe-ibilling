import React, { useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import "../../collector/collector.css";
import "../customer.css";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import {
  fetchPackagefromDatabase,
  getQueuePackageByIspOwnerId,
} from "../../../features/apiCalls";
import { updateStaticCustomerApi } from "../../../features/staticCustomerApi";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";

import getName from "../../../utils/getLocationName";

//divisional location
import divisionsJSON from "../../../bdAddress/bd-divisions.json";
import districtsJSON from "../../../bdAddress/bd-districts.json";
import thanaJSON from "../../../bdAddress/bd-upazilas.json";
import SelectField from "../../../components/common/SelectField";
import moment from "moment";
import { Card, InputGroup } from "react-bootstrap";
import { TextField } from "../../../components/common/HorizontalTextField";
import useISPowner from "../../../hooks/useISPOwner";
import { Cash, Envelope } from "react-bootstrap-icons";
import { toast } from "react-toastify";

const divisions = divisionsJSON.divisions;
const districts = districtsJSON.districts;
const thana = thanaJSON.thana;

const StaticCustomerEdit = ({ customerId, setProfileOption }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // customer validation
  const customerValidator = Yup.object({
    name: Yup.string().required(t("writeCustomerName")),
    mobile: Yup.string()
      .matches(/^(01){1}[3456789]{1}(\d){8}$/, t("incorrectMobile"))
      .min(11, t("write11DigitMobileNumber"))
      .max(11, t("over11DigitMobileNumber")),
    address: Yup.string(),
    email: Yup.string().email(t("incorrectEmail")),
    nid: Yup.string(),
    customerBillingType: Yup.string().required(t("select billing type")),
  });

  // get user & current user data form useISPOwner
  const { role, ispOwnerId, bpSettings, userType, permissions } = useISPowner();

  // get static customer form redux
  const customer = useSelector((state) =>
    state?.customer?.staticCustomer.find((item) => item.id === customerId)
  );

  // get all area
  const areas = useSelector((state) => state?.area?.area);

  // get all subAreas
  const storeSubArea = useSelector((state) => state.area?.subArea);

  //get all pole Box
  const storePoleBox = useSelector((state) => state.area?.poleBox);

  const packages = useSelector((state) => state?.package?.packages);

  const [packageRate, setPackageRate] = useState({ rate: 0 });
  const [isLoading, setIsloading] = useState(false);
  const [singleMikrotik, setSingleMikrotik] = useState("");
  const [mikrotikPackage, setMikrotikPackage] = useState("");
  const [autoDisable, setAutoDisable] = useState();
  const [area, setArea] = useState("");
  const [subArea, setSubArea] = useState("");
  const [areaID, setAreaID] = useState("");
  const [poleBox, setPoleBox] = useState([]);

  const [billDate, setBillDate] = useState(null);
  const [maxUpLimit, setUpMaxLimit] = useState("");
  const [maxDownLimit, setDownMaxLimit] = useState("");
  const [monthlyFee, setMonthlyFee] = useState();
  const [qDisable, setQdisable] = useState();
  const [status, setStatus] = useState("");
  const [promiseDate, setPromiseDate] = useState(null);
  const [connectionDate, setConnectionDate] = useState("");

  const [divisionalArea, setDivisionalArea] = useState({
    division: "",
    district: "",
    thana: "",
  });

  //last day of month calculation
  let day = new Date(customer?.promiseDate);
  let lastDayOfMonth = new Date(day.getFullYear(), day.getMonth() + 1, 0);

  let initialTime = new Date();
  initialTime.setHours("00");
  initialTime.setMinutes("00");

  //hour and minutes calculation
  let lastTime = new Date();
  lastTime.setHours("18");
  lastTime.setMinutes("00");

  // fix promise date
  let mxDate = new Date(customer?.billingCycle);
  mxDate.setDate(mxDate.getDate() + parseInt(20));

  // customer validator
  useEffect(() => {
    setAutoDisable(customer?.autoDisable);
    setMonthlyFee(customer?.monthlyFee);
    setSingleMikrotik(customer?.mikrotik);
    setMikrotikPackage(customer?.mikrotikPackage);
    setStatus(customer?.status);

    if (
      userType === "simple-queue" &&
      customer?.queue.type === "simple-queue"
    ) {
      setUpMaxLimit(customer?.queue?.maxLimit?.split("/")[0]);
      setDownMaxLimit(customer?.queue?.maxLimit?.split("/")[1]);
    }

    if (
      userType === "firewall-queue" &&
      customer?.queue.type === "firewall-queue"
    ) {
      if (customer?.queue?.maxLimit) {
        setUpMaxLimit(customer?.queue?.maxLimit);
      } else {
        const limit = setPackageLimit(customer?.mikrotikPackage, false);
        limit && setUpMaxLimit(`${limit}/${limit}`);
      }
    }
    setQdisable(customer?.queue.disabled);

    let temp;
    areas.map((a) => {
      a.subAreas.map((sub) => {
        if (sub === customer?.subArea) {
          temp = a.id;
        }
        return sub;
      });
      return a;
    });
    setAreaID(temp);

    const initialSubAreas = storeSubArea.filter((val) => val.area === temp);
    setSubArea(initialSubAreas);

    //Polebox initial set
    const tempu = storePoleBox?.filter(
      (pole) => pole.subArea === customer?.subArea
    );
    setPoleBox(tempu);

    const divisionalInfo = {};
    if (customer?.division) {
      const division = divisions.find(
        (item) => item.name === customer.division
      );
      divisionalInfo.division = division.id;
    }
    if (customer?.district) {
      const district = districts.find(
        (item) => item.name === customer.district
      );
      divisionalInfo.district = district.id;
    }
    if (customer?.thana) {
      const findThana = thana.find(
        (item) =>
          item.name === customer.thana &&
          item.district_id === divisionalInfo.district
      );
      divisionalInfo.thana = findThana?.id;
    }
    setDivisionalArea({
      ...divisionalArea,
      ...divisionalInfo,
    });
  }, [customer]);

  useEffect(() => {
    //ispOwner queue all package get api
    if (bpSettings?.hasMikrotik && packages.length === 0)
      getQueuePackageByIspOwnerId(ispOwnerId, dispatch, setIsloading);
  }, [customer?.mikrotik]);

  useEffect(() => {
    if (customer) {
      setBillDate(new Date(customer?.billingCycle));
      setPromiseDate(new Date(customer.promiseDate));
      setConnectionDate(
        customer?.connectionDate ? new Date(customer?.connectionDate) : null
      );
    }
  }, [customer]);

  // select subArea
  const selectSubArea = (data) => {
    const areaId = data.target.value;

    if (areaId) {
      const temp = storeSubArea.filter((val) => {
        return val.area === areaId;
      });
      setSubArea(temp);
      setAreaID(areaId);
    }
  };

  // select pole box Handler
  const poleHandler = (subAreaID) => {
    if (subAreaID) {
      const temp = storePoleBox.filter((pole) => pole.subArea === subAreaID);
      setPoleBox(temp);
    }
  };

  //function for set 0
  const setPackageLimit = (value, isDown) => {
    setMikrotikPackage(value);
    const temp = packages.find((val) => val.id === value);
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
        const temp = packages.find((val) => val.id === target.value);
        setPackageRate(temp);
        setMonthlyFee(temp.rate);
        const getLimit = setPackageLimit(target.value, false);
        getLimit && setUpMaxLimit(`${getLimit}/${getLimit}`);
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
  //divisional area formula
  const divisionalAreaFormData = [
    {
      text: t("selectDivision"),
      name: "division",
      id: "division",
      value: divisionalArea.division,
      data: divisions,
    },
    {
      text: t("selectDistrict"),
      name: "district",
      id: "district",
      value: divisionalArea.district,
      data: districts.filter(
        (item) => item.division_id === divisionalArea.division
      ),
    },
    {
      text: t("selectThana"),
      name: "thana",
      id: "thana",
      value: divisionalArea.thana,
      data: thana.filter(
        (item) => item.district_id === divisionalArea.district
      ),
    },
  ];
  // this function control the division district and thana change input
  const onDivisionalAreaChange = ({ target }) => {
    const { name, value } = target;
    //set the value of division district and thana dynamically
    setDivisionalArea({
      ...divisionalArea,
      [name]: value,
    });
  };

  // sending data to backed
  const customerHandler = async (data, resetForm) => {
    const {
      customerId,
      ipAddress,
      queueName,
      target,
      srcAddress,
      name,
      ...rest
    } = data;

    if (!bpSettings.genCustomerId) {
      if (!customerId) {
        return alert(t("writeCustomerId"));
      }
    }

    if (!mikrotikPackage) {
      setIsloading(false);
      return alert(t("selectDownloadPackage"));
    }

    if (bpSettings.addCustomerWithMobile) {
      if (data.mobile === "") {
        setIsloading(false);
        return toast.warn(t("writeMobileNumber"));
      }
    }

    const subArea2 = document.getElementById("subAreaIdEditStatic").value;

    let poleBoxId;
    if (bpSettings?.poleBox) {
      poleBoxId = document.getElementById("poleBoxEdit").value;
    }

    if (subArea2 === "") {
      setIsloading(false);
      return alert(t("selectSubArea"));
    }

    const tempBill = new Date(moment(billDate)).getTime();

    const tempPromise = new Date(moment(promiseDate)).getTime();

    let sendPromise = promiseDate;

    if (tempBill > tempPromise) {
      sendPromise = billDate;
    }

    const mainData = {
      area: areaID,
      subArea: subArea2,
      poleBox: poleBoxId,
      ispOwner: ispOwnerId,
      mikrotik: singleMikrotik,
      mikrotikPackage: mikrotikPackage,
      autoDisable: autoDisable,
      billingCycle: billDate.toISOString(),
      promiseDate: sendPromise.toISOString(),
      ...rest,
      monthlyFee: monthlyFee,
    };

    if (
      mainData.balance === "" ||
      mainData.balance === undefined ||
      mainData === null
    ) {
      delete mainData.balance;
    }

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
        disabled: qDisable,
        name: name,
      };
      if (maxUpLimit) {
        sendingData.queue.maxLimit = maxUpLimit;
      }
    }

    if (userType === "core-queue") {
      sendingData.userType = "core-queue";
      sendingData.queue = {
        srcAddress: srcAddress,
        disabled: status === "active" ? false : true,
      };
    }

    if (userType === "simple-queue") {
      sendingData.userType = "simple-queue";
      sendingData.queue = {
        name: queueName,
        type: userType,
        target,
        maxLimit: `${maxUpLimit}/${maxDownLimit}`,
        disabled: status === "active" ? false : true,
      };
    }

    if (status === "active") {
      sendingData.status = status;
    } else if (status === "inactive") {
      sendingData.status = status;
    }

    if (
      divisionalArea.district ||
      divisionalArea.division ||
      divisionalArea.thana
    ) {
      const divisionName = getName(divisions, divisionalArea.division)?.name;
      const districtName = getName(districts, divisionalArea.district)?.name;
      const thanaName = getName(thana, divisionalArea.thana)?.name;
      //if  exist add the data
      if (divisionName) sendingData.division = divisionName;
      if (districtName) sendingData.district = districtName;
      if (thanaName) sendingData.thana = thanaName;
    }

    if (!poleBoxId) {
      delete sendingData.poleBox;
    }

    // return;
    updateStaticCustomerApi(
      customer.id,
      dispatch,
      sendingData,
      setIsloading,
      resetForm
    );
  };
  return (
    <>
      <Card.Title className="clintTitle mb-0">
        <h5 className="profileInfo">{t("updateProfile")}</h5>
      </Card.Title>

      <Card.Body>
        <Formik
          initialValues={{
            name: customer?.name || "",
            mobile: customer?.mobile || "",
            address: customer?.address || "",
            email: customer?.email || "",
            balance: customer?.balance || "",
            ipAddress: customer?.queue.address || "",
            queueName: customer?.queue.name || "",
            srcAddress: customer?.queue.srcAddress || "",
            target: customer?.queue.target || "",
            customerId: customer?.customerId,
            customerBillingType: customer?.customerBillingType,
          }}
          validationSchema={customerValidator}
          onSubmit={(values, { resetForm }) => {
            customerHandler(values, resetForm);
          }}
          enableReinitialize
        >
          {() => (
            <Form>
              <div>
                {!bpSettings?.genCustomerId && (
                  <TextField
                    type="text"
                    label="Customer Id"
                    name="customerId"
                    validation={true}
                  />
                )}

                {bpSettings?.hasMikrotik && userType === "firewall-queue" && (
                  <div className="displayGridManual6_4">
                    <label className="form-control-label manualLable">
                      {t("selectPackage")}
                      <span className="text-danger">*</span>
                    </label>

                    <select
                      name="firewallPackage"
                      className="form-select mw-100 mt-0"
                      aria-label="Default select example"
                      onChange={selectMikrotikPackage}
                    >
                      {packages &&
                        packages?.map(
                          (val, key) =>
                            val.packageType === "queue" && (
                              <option
                                selected={val.id === customer?.mikrotikPackage}
                                key={key}
                                value={val.id}
                              >
                                {val.name}
                              </option>
                            )
                        )}
                    </select>
                  </div>
                )}

                {bpSettings?.hasMikrotik && userType === "core-queue" && (
                  <div className="displayGridManual6_4">
                    <label className="form-control-label manualLable">
                      {t("selectPackage")}
                      <span className="text-danger">*</span>
                    </label>

                    <select
                      name="corePackage"
                      className="form-select mw-100 mt-0"
                      aria-label="Default select example"
                      onChange={selectMikrotikPackage}
                    >
                      {packages &&
                        packages?.map(
                          (val, key) =>
                            val.packageType === "queue" && (
                              <option
                                selected={val.id === customer?.mikrotikPackage}
                                key={key}
                                value={val.id}
                              >
                                {val.name}
                              </option>
                            )
                        )}
                    </select>
                  </div>
                )}

                {bpSettings?.hasMikrotik && userType === "simple-queue" && (
                  <div className="displayGridManual6_4">
                    <label className="form-control-label manualLable">
                      {t("uploadPackge")}
                      <span className="text-danger">*</span>
                    </label>

                    <select
                      name="upPackage"
                      className="form-select mw-100 mt-0"
                      aria-label="Default select example"
                      onChange={selectMikrotikPackage}
                    >
                      {packages &&
                        packages?.map(
                          (val, key) =>
                            val.packageType === "queue" && (
                              <option
                                selected={val.id === customer?.mikrotikPackage}
                                key={key}
                                value={val.id}
                              >
                                {val.name}
                              </option>
                            )
                        )}
                    </select>
                  </div>
                )}

                {bpSettings?.hasMikrotik && userType === "simple-queue" && (
                  <div className="displayGridManual6_4">
                    <label className="form-control-label manualLable">
                      {t("downloadPackge")}
                      <span className="text-danger">*</span>
                    </label>
                    <select
                      name="downPackage"
                      className="form-select mw-100 mt-0"
                      aria-label="Default select example"
                      onChange={selectMikrotikPackage}
                    >
                      {packages &&
                        packages?.map(
                          (val, key) =>
                            val.packageType === "queue" && (
                              <option
                                selected={val.id === customer?.mikrotikPackage}
                                key={key}
                                value={val.id}
                              >
                                {val.name}
                              </option>
                            )
                        )}
                    </select>
                  </div>
                )}

                {!bpSettings?.hasMikrotik && (
                  <div className="displayGridManual6_4">
                    <label className="form-control-label manualLable">
                      {t("downloadPackge")}
                      <span className="text-danger">*</span>
                    </label>

                    <select
                      name="downPackage"
                      className="form-select mw-100 mt-0"
                      aria-label="Default select example"
                      onChange={selectMikrotikPackage}
                    >
                      {packages &&
                        packages?.map((val, key) => (
                          <option
                            selected={val.id === customer?.mikrotikPackage}
                            key={key}
                            value={val.id}
                          >
                            {val.name}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                <div className="displayGridManual6_4">
                  <label
                    class="form-control-label manualLable"
                    htmlFor="manuallyPassword"
                  >
                    {t("monthlyFee")}
                    <span className="text-danger">*</span>
                  </label>

                  <div>
                    <InputGroup>
                      <Field
                        className="form-control shadow-none"
                        type="number"
                        min={0}
                        name="monthlyFee"
                        value={monthlyFee}
                        validation={true}
                        onChange={(e) => setMonthlyFee(e.target.value)}
                      />
                      {customer?.monthlyFee > 0 && (
                        <InputGroup.Text
                          style={{ cursor: "pointer" }}
                          onClick={() => setProfileOption("recharge")}
                        >
                          <Cash size={22} title={t("recharge")} />
                        </InputGroup.Text>
                      )}
                    </InputGroup>

                    <ErrorMessage name="monthlyFee" component="div">
                      {(err) => (
                        <span className="errorMessage text-danger">{err}</span>
                      )}
                    </ErrorMessage>
                  </div>
                </div>

                <TextField
                  type="text"
                  label={t("name")}
                  name="name"
                  validation={true}
                />

                {userType === "simple-queue" && (
                  <TextField
                    type="text"
                    label={t("queueName")}
                    name="queueName"
                  />
                )}

                {userType === "firewall-queue" && (
                  <TextField
                    type="text"
                    label={t("ip")}
                    name="ipAddress"
                    validation={true}
                  />
                )}

                {userType === "core-queue" && (
                  <TextField
                    type="text"
                    label={t("ipAddress")}
                    name="srcAddress"
                    validation={true}
                  />
                )}

                {userType === "simple-queue" && (
                  <TextField
                    type="text"
                    label={t("ip")}
                    name="target"
                    validation={true}
                  />
                )}

                <div className="displayGridManual6_4">
                  <label
                    class="form-control-label manualLable"
                    htmlFor="manuallyPassword"
                  >
                    {t("mobile")}
                    {bpSettings?.addCustomerWithMobile && (
                      <span className="text-danger">*</span>
                    )}
                  </label>

                  <div>
                    <InputGroup>
                      <Field
                        className="form-control shadow-none"
                        type="text"
                        name="mobile"
                        validation={true}
                        disabled={
                          !permissions?.customerMobileEdit &&
                          role === "collector"
                        }
                      />
                      {customer?.mobile && (
                        <InputGroup.Text
                          style={{ cursor: "pointer" }}
                          onClick={() => setProfileOption("message")}
                        >
                          <Envelope size={22} title={t("message")} />
                        </InputGroup.Text>
                      )}
                    </InputGroup>

                    <ErrorMessage name="mobile" component="div">
                      {(err) => (
                        <span className="errorMessage text-danger">{err}</span>
                      )}
                    </ErrorMessage>
                  </div>
                </div>

                {!bpSettings?.hasMikrotik && (
                  <TextField
                    type="number"
                    label={t("prevDue")}
                    name="balance"
                  />
                )}

                <div className="displayGridManual6_4">
                  <label className="form-control-label manualLable">
                    {t("selectArea")} <span className="text-danger">*</span>
                  </label>

                  <select
                    className="form-select mw-100 mt-0"
                    aria-label="Default select example"
                    onChange={selectSubArea}
                  >
                    <option value="">...</option>
                    {areas?.length === undefined
                      ? ""
                      : areas.map((val, key) => (
                          <option
                            selected={val.id === areaID}
                            key={key}
                            value={val.id}
                          >
                            {val.name}
                          </option>
                        ))}
                  </select>
                </div>

                <div className="displayGridManual6_4">
                  <label className="form-control-label manualLable">
                    {t("selectSubArea")} <span className="text-danger">*</span>
                  </label>

                  <select
                    className="form-select mw-100 mt-0"
                    aria-label="Default select example"
                    name="subArea"
                    id="subAreaIdEditStatic"
                    onChange={(e) => {
                      poleHandler(e.target.value);
                    }}
                  >
                    <option value="">...</option>
                    {subArea
                      ? subArea.map((val, key) => {
                          return (
                            <option
                              selected={val.id === customer?.subArea}
                              key={key}
                              value={val.id}
                            >
                              {val.name}
                            </option>
                          );
                        })
                      : ""}
                  </select>
                </div>

                {bpSettings?.poleBox && (
                  <div className="displayGridManual6_4">
                    <label className="form-control-label manualLable">
                      {t("selectPoleBox")}
                    </label>
                    <select
                      className="form-select mw-100 mt-0"
                      aria-label="Default select example"
                      name="poleBox"
                      id="poleBoxEdit"
                    >
                      <option value="">...</option>
                      {poleBox?.map((val, key) => {
                        return (
                          <option
                            selected={val.id === customer?.poleBox}
                            key={key}
                            value={val.id}
                          >
                            {val.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}

                <div className="displayGridManual6_4">
                  <label className="form-control-label manualLable">
                    {t("billingCycle")}
                    <span className="text-danger">*</span>
                  </label>

                  <DatePicker
                    className="form-control mw-100"
                    selected={billDate}
                    onChange={(date) => setBillDate(date)}
                    dateFormat="MMM dd yyyy hh:mm a"
                    showTimeSelect
                    timeIntervals={60}
                  />
                </div>

                {bpSettings?.promiseDate &&
                  (role === "manager" || role === "ispOwner") && (
                    <div className="displayGridManual6_4">
                      <label className="form-control-label manualLable">
                        {t("promiseDate")}
                      </label>

                      <DatePicker
                        className="form-control mw-100"
                        selected={promiseDate}
                        onChange={(date) => setPromiseDate(date)}
                        dateFormat="MMM dd yyyy hh:mm a"
                        placeholderText={t("selectDate")}
                        minDate={new Date(customer?.billingCycle)}
                        maxDate={lastDayOfMonth}
                        showTimeSelect
                        timeIntervals={60}
                        minTime={initialTime}
                        maxTime={lastTime}
                      />
                    </div>
                  )}

                {divisionalAreaFormData.map((item) => (
                  <div className="displayGridManual6_4">
                    <label className="form-control-label manualLable">
                      {item.text}
                    </label>

                    <select
                      className="form-select mw-100 mt-0"
                      aria-label="Default select example"
                      name={item.name}
                      id={item.id}
                      onChange={onDivisionalAreaChange}
                      value={item.value}
                    >
                      <option value="">...</option>
                      {item.data.map((item) => (
                        <option value={item.id}>{item.name}</option>
                      ))}
                    </select>
                  </div>
                ))}

                <TextField type="text" label={t("address")} name="address" />

                <TextField type="text" label={t("email")} name="email" />

                <div className="displayGridManual6_4">
                  <label className="form-control-label manualLable">
                    {t("connectionDate")}
                  </label>

                  <DatePicker
                    className="form-control mw-100"
                    selected={connectionDate}
                    onChange={(date) => setConnectionDate(date)}
                    dateFormat="MMM dd yyyy"
                    placeholderText={t("selectDate")}
                  />
                </div>

                <div className="displayGridManual6_4">
                  <label className="form-control-label manualLable">
                    {t("customerBillType")}
                  </label>

                  <SelectField
                    id="exampleSelect"
                    name="customerBillingType"
                    className="form-select mw-100 mt-0"
                  >
                    <option value="">{t("customerBillType")}</option>

                    <option value="prepaid">{t("prepaid")}</option>
                    <option value="postpaid">{t("postPaid")}</option>
                  </SelectField>
                </div>
              </div>

              <div className="d-flex justify-content-end mt-5">
                <button type="submit" className="btn btn-outline-success">
                  {isLoading ? <Loader /> : t("save")}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Card.Body>
    </>
  );
};

export default StaticCustomerEdit;
