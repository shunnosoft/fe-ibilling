import React, { useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

// internal imports
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import { fetchPackagefromDatabase } from "../../../features/apiCalls";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import { updateResellerStaticCustomer } from "../../../features/apiCallReseller";
import getName from "../../../utils/getLocationName";
import useISPowner from "../../../hooks/useISPOwner";

//divisional location
import divisionsJSON from "../../../bdAddress/bd-divisions.json";
import districtsJSON from "../../../bdAddress/bd-districts.json";
import thanaJSON from "../../../bdAddress/bd-upazilas.json";
import SelectField from "../../../components/common/SelectField";
import { Card, InputGroup } from "react-bootstrap";
import { TextField } from "../../../components/common/HorizontalTextField";
import { Cash, Envelope } from "react-bootstrap-icons";

const divisions = divisionsJSON.divisions;
const districts = districtsJSON.districts;
const thana = thanaJSON.thana;

const StaticCustomerEdit = ({ customerId, setProfileOption }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  let initialTime = new Date();
  initialTime.setHours("00");
  initialTime.setMinutes("00");

  //hour and minutes calculation
  let lastTime = new Date();
  lastTime.setHours("18");
  lastTime.setMinutes("00");

  // get user & current user data form useISPOwner
  const {
    role,
    ispOwnerId,
    bpSettings,
    resellerData,
    permission,
    permissions,
  } = useISPowner();

  // get User Type
  const userType = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData?.bpSettings.queueType
  );

  //find reseller id form user data
  const resellerId = useSelector((state) =>
    role === "reseller"
      ? state.persistedReducer.auth?.userData?.id
      : state.persistedReducer.auth?.userData?.reseller
  );

  // get reseller customer form redux store & find single user
  const customer = useSelector((state) =>
    state?.customer?.staticCustomer.find((item) => item.id === customerId)
  );

  // get all area
  const areas = useSelector((state) => state?.area?.area);

  // get mikrotik & with out mikrotik package
  const ppPackage = useSelector((state) =>
    bpSettings?.hasMikrotik
      ? state?.mikrotik?.packagefromDatabase
      : state?.package?.packages
  );

  // loading state
  const [isLoading, setIsloading] = useState(false);

  const [packageRate, setPackageRate] = useState({ rate: 0 });
  const [singleMikrotik, setSingleMikrotik] = useState("");
  const [mikrotikPackage, setMikrotikPackage] = useState("");
  const [autoDisable, setAutoDisable] = useState();
  const [billDate, setBillDate] = useState(null);
  const [maxUpLimit, setUpMaxLimit] = useState("");
  const [maxDownLimit, setDownMaxLimit] = useState("");
  const [monthlyFee, setMonthlyFee] = useState();
  const [qDisable, setQdisable] = useState();
  const [status, setStatus] = useState("");
  const [promiseDate, setPromiseDate] = useState(null);
  const [connectionDate, setConnectionDate] = useState("");
  const [currentRate, setCurrentRate] = useState("");

  //set division,district & thana state
  const [divisionalArea, setDivisionalArea] = useState({
    division: "",
    district: "",
    thana: "",
  });

  //last day of month calculation
  let day = new Date(customer?.promiseDate);
  let lastDayOfMonth = new Date(day.getFullYear(), day.getMonth() + 1, 0);

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
    setQdisable(customer?.queue.disabled);

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
    const IDs = {
      ispOwner: ispOwnerId,
      mikrotikId: customer?.mikrotik,
    };
    if (bpSettings?.hasMikrotik) {
      fetchPackagefromDatabase(dispatch, IDs, setIsloading);
    }
  }, [customer?.mikrotik]);

  useEffect(() => {
    const pac = ppPackage?.find((pac) => pac.id === customer?.mikrotikPackage);
    setCurrentRate(pac?.rate);
  }, [customer, ppPackage]);

  useEffect(() => {
    if (customer) {
      setBillDate(new Date(customer?.billingCycle));
      setPromiseDate(new Date(customer.promiseDate));
      setConnectionDate(
        customer?.connectionDate ? new Date(customer?.connectionDate) : null
      );
    }
  }, [customer]);

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
        fetchPackagefromDatabase(dispatch, IDs);
      }
    }
    setSingleMikrotik(id);
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
    const { customerId, ipAddress, queueName, target, ...rest } = data;
    if (!bpSettings.genCustomerId) {
      if (!customerId) {
        return alert(t("writeCustomerId"));
      }
    }
    if (!mikrotikPackage) {
      setIsloading(false);
      return alert(t("selectDownloadPackage"));
    }

    const tempBill = new Date(moment(billDate)).getTime();

    const tempPromise = new Date(moment(promiseDate)).getTime();

    let sendPromise = promiseDate;

    if (tempBill > tempPromise) {
      sendPromise = billDate;
    }

    const mainData = {
      ispOwner: ispOwnerId,
      mikrotik: singleMikrotik,
      mikrotikPackage: mikrotikPackage,
      autoDisable: autoDisable,
      billingCycle: billDate,
      promiseDate: sendPromise,
      connectionDate: connectionDate,
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

    // return;
    updateResellerStaticCustomer(
      customer.id,
      resellerId,
      dispatch,
      sendingData,
      setIsloading
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
                    label={t("customerId")}
                    name="customerId"
                    validation={true}
                  />
                )}

                {bpSettings?.hasMikrotik && userType === "firewall-queue" && (
                  <div className="displayGridManual6_4">
                    <label className="form-control-label manualLable">
                      {t("selectPackage")}{" "}
                      <span className="text-danger">*</span>
                    </label>

                    <select
                      name="firewallPackage"
                      className="form-select mw-100"
                      onChange={selectMikrotikPackage}
                    >
                      {ppPackage?.map(
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
                      {t("uploadPackge")} <span className="text-danger">*</span>
                    </label>

                    <select
                      name="upPackage"
                      className="form-select mw-100 mt-0"
                      onChange={selectMikrotikPackage}
                    >
                      {ppPackage?.map(
                        (val, key) =>
                          val.packageType === "queue" && (
                            <option
                              disabled={val.rate < Number(currentRate)}
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
                      {t("downloadPackge")}{" "}
                      <span className="text-danger">*</span>
                    </label>

                    <select
                      name="downPackage"
                      className="form-select mw-100 mt-0 mb-3"
                      onChange={selectMikrotikPackage}
                    >
                      {ppPackage?.map(
                        (val, key) =>
                          val.packageType === "queue" && (
                            <option
                              disabled={val.rate < Number(currentRate)}
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
                      {t("downloadPackge")}{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <select
                      name="downPackage"
                      className="form-select mw-100 mt-0 mb-3"
                      onChange={selectMikrotikPackage}
                    >
                      {ppPackage?.map((val, key) => (
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
                      {customer?.monthlyFee > 0 &&
                        ((role === "reseller" &&
                          permission?.customerRecharge) ||
                          (role === "collector" &&
                            resellerData.permission?.customerRecharge &&
                            permissions?.billPosting)) && (
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

                {!bpSettings?.hasMikrotik && (
                  <TextField
                    type="number"
                    label={t("prevDue")}
                    name="balance"
                  />
                )}

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

                {userType === "firewall-queue" && (
                  <TextField
                    type="text"
                    label={t("ip")}
                    name="ipAddress"
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
                          !resellerData.permission?.customerMobileEdit &&
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

                <div className="displayGridManual6_4">
                  <label className="form-control-label manualLable">
                    {t("selectArea")} <span className="text-danger">*</span>
                  </label>

                  <select className="form-select mw-100 mt-0">
                    <option value="">...</option>
                    {areas.length &&
                      areas.map((val, key) => (
                        <option
                          selected={val.id === customer?.subArea}
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
                    {t("billingCycle")} <span className="text-danger">*</span>
                  </label>

                  <DatePicker
                    className="form-control mw-100"
                    selected={billDate}
                    onChange={(date) => setBillDate(date)}
                    dateFormat="MMM dd yyyy hh:mm a"
                    showTimeSelect
                    timeIntervals={60}
                    disabled={permission?.billingCycleEdit === false}
                  />
                </div>

                {bpSettings?.promiseDate && role === "reseller" && (
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
                      showTimeSelect
                      minDate={new Date(customer?.billingCycle)}
                      maxDate={lastDayOfMonth}
                      timeIntervals={60}
                      minTime={initialTime}
                      maxTime={lastTime}
                    />
                  </div>
                )}

                {divisionalAreaFormData?.map((item) => (
                  <div className="displayGridManual6_4">
                    <label className="form-control-label manualLable">
                      {item.text}
                    </label>

                    <select
                      className="form-select mw-100 mt-0"
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
                  <label className="form-control-label manualLable mt-0">
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
