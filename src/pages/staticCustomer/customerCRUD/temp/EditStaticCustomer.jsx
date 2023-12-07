import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import "../../../collector/collector.css";
import "../../customer.css";
import { FtextField } from "../../../../components/common/FtextField";
import Loader from "../../../../components/common/Loader";
import { fetchPackagefromDatabase } from "../../../../features/apiCalls";
import { updateStaticCustomerApi } from "../../../../features/staticCustomerApi";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";

import getName from "../../../../utils/getLocationName";

//divisional location
import divisionsJSON from "../../../../bdAddress/bd-divisions.json";
import districtsJSON from "../../../../bdAddress/bd-districts.json";
import thanaJSON from "../../../../bdAddress/bd-upazilas.json";
import SelectField from "../../../../components/common/SelectField";
import moment from "moment";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";

const divisions = divisionsJSON.divisions;
const districts = districtsJSON.districts;
const thana = thanaJSON.thana;

export default function EditStaticCustomer({
  show,
  setShow,
  single,
  handleActiveFilter,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const customer = useSelector((state) =>
    state?.customer?.staticCustomer.find((item) => item.id === single)
  );
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.userData?.bpSettings
  );

  // get user permission
  const permission = useSelector(
    (state) => state.persistedReducer.auth.userData.permissions
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
  const areas = useSelector((state) => state?.area?.area);

  // get all subAreas
  const storeSubArea = useSelector((state) => state.area?.subArea);

  //get all pole Box
  const storePoleBox = useSelector((state) => state.area?.poleBox);

  // get all mikrotik
  const Getmikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  const ppPackage = useSelector((state) => state?.package?.packages);

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
    const IDs = {
      ispOwner: ispOwnerId,
      mikrotikId: customer?.mikrotik,
    };
    if (bpSettings?.hasMikrotik) {
      fetchPackagefromDatabase(dispatch, IDs, setIsloading);
    }
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
    connectionFee: Yup.number(),
  });

  //modal show handler
  const handleClose = () => {
    setShow(false);
  };

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
    const { customerId, ipAddress, queueName, target, srcAddress, ...rest } =
      data;
    if (!bpSettings.genCustomerId) {
      if (!customerId) {
        return alert(t("writeCustomerId"));
      }
    }
    if (!mikrotikPackage) {
      setIsloading(false);
      return alert(t("selectDownloadPackage"));
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
      };
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
      "",
      setShow,
      "",
      handleActiveFilter
    );
  };
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="xl"
      >
        <ModalHeader closeButton>
          <ModalTitle>
            <h5 className="modal-title" id="exampleModalLabel">
              {customer?.name} {t("updateCustomer")}
            </h5>
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
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
              connectionFee: customer?.connectionFee || 0,
              customerBillingType: customer?.customerBillingType,
            }}
            validationSchema={customerValidator}
            onSubmit={(values, { resetForm }) => {
              customerHandler(values, resetForm);
            }}
            enableReinitialize
          >
            {() => (
              <Form id="customerEdit">
                <div className="displayGrid3">
                  {bpSettings?.hasMikrotik && (
                    <div>
                      <label className="form-control-label changeLabelFontColor">
                        {t("selectMikrotik")}
                      </label>
                      <select
                        className="form-select mw-100 mt-0"
                        aria-label="Default select example"
                        onChange={selectMikrotik}
                        disabled
                      >
                        <option value="">...</option>
                        {Getmikrotik.length === undefined
                          ? ""
                          : Getmikrotik.map((val, key) => (
                              <option
                                selected={val.id === customer?.mikrotik}
                                key={key}
                                value={val.id}
                              >
                                {val.name}
                              </option>
                            ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="form-control-label changeLabelFontColor">
                      {t("selectArea")}
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

                  <div>
                    <label className="form-control-label changeLabelFontColor">
                      {t("selectSubArea")}
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
                    <div>
                      <label className="form-control-label changeLabelFontColor">
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

                  {userType === "core-queue" && (
                    <FtextField
                      type="text"
                      label={t("ipAddress")}
                      name="srcAddress"
                    />
                  )}

                  {userType === "simple-queue" && (
                    <FtextField
                      type="text"
                      label={t("queueName")}
                      name="queueName"
                    />
                  )}

                  {userType === "simple-queue" && (
                    <FtextField type="text" label={t("ip")} name="target" />
                  )}

                  {userType === "firewall-queue" && (
                    <FtextField type="text" label={t("ip")} name="ipAddress" />
                  )}

                  {bpSettings?.hasMikrotik && userType === "firewall-queue" && (
                    <div>
                      <label className="form-control-label changeLabelFontColor">
                        {t("selectPackage")}
                      </label>
                      <select
                        name="firewallPackage"
                        className="form-select mw-100"
                        aria-label="Default select example"
                        onChange={selectMikrotikPackage}
                      >
                        {ppPackage &&
                          ppPackage?.map(
                            (val, key) =>
                              val.packageType === "queue" && (
                                <option
                                  selected={
                                    val.id === customer?.mikrotikPackage
                                  }
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
                    <div>
                      <label className="form-control-label changeLabelFontColor">
                        {t("selectPackage")}
                      </label>
                      <select
                        name="corePackage"
                        className="form-select mw-100 mt-0"
                        aria-label="Default select example"
                        onChange={selectMikrotikPackage}
                      >
                        {ppPackage &&
                          ppPackage?.map(
                            (val, key) =>
                              val.packageType === "queue" && (
                                <option
                                  selected={
                                    val.id === customer?.mikrotikPackage
                                  }
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
                    <div>
                      <label className="form-control-label changeLabelFontColor">
                        {t("uploadPackge")}
                      </label>
                      <select
                        name="upPackage"
                        className="form-select mw-100 mt-0"
                        aria-label="Default select example"
                        onChange={selectMikrotikPackage}
                      >
                        {ppPackage &&
                          ppPackage?.map(
                            (val, key) =>
                              val.packageType === "queue" && (
                                <option
                                  selected={
                                    val.id === customer?.mikrotikPackage
                                  }
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
                    <div>
                      <label className="form-control-label changeLabelFontColor">
                        {t("downloadPackge")}
                      </label>
                      <select
                        name="downPackage"
                        className="form-select mw-100 mt-0"
                        aria-label="Default select example"
                        onChange={selectMikrotikPackage}
                      >
                        {ppPackage &&
                          ppPackage?.map(
                            (val, key) =>
                              val.packageType === "queue" && (
                                <option
                                  selected={
                                    val.id === customer?.mikrotikPackage
                                  }
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
                    <div>
                      <label className="form-control-label changeLabelFontColor">
                        {t("downloadPackge")}
                      </label>
                      <select
                        name="downPackage"
                        className="form-select mw-100 mt-0"
                        aria-label="Default select example"
                        onChange={selectMikrotikPackage}
                      >
                        {ppPackage &&
                          ppPackage?.map((val, key) => (
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

                  <FtextField
                    type="number"
                    label={t("monthFee")}
                    name="monthlyFee"
                    min={0}
                    value={monthlyFee}
                    onChange={(e) => setMonthlyFee(e.target.value)}
                  />

                  {!bpSettings?.hasMikrotik && (
                    <FtextField
                      type="number"
                      label={t("prevDue")}
                      name="balance"
                    />
                  )}

                  <FtextField type="text" label={t("name")} name="name" />

                  <FtextField
                    type="text"
                    label={t("mobile")}
                    name="mobile"
                    disabled={
                      !permission?.customerMobileEdit && role === "collector"
                    }
                  />

                  {divisionalAreaFormData.map((item) => (
                    <div>
                      <label className="form-control-label changeLabelFontColor">
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

                  <FtextField type="text" label={t("address")} name="address" />

                  <FtextField type="text" label={t("email")} name="email" />

                  <div>
                    <label className="form-control-label changeLabelFontColor">
                      {t("billingCycle")}
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

                  <SelectField
                    label={t("customerBillType")}
                    id="exampleSelect"
                    name="customerBillingType"
                    className="form-select mw-100 mt-0"
                  >
                    <option value="">{t("customerBillType")}</option>

                    <option value="prepaid">{t("prepaid")}</option>
                    <option value="postpaid">{t("postPaid")}</option>
                  </SelectField>

                  {bpSettings?.promiseDate &&
                    (role === "manager" || role === "ispOwner") && (
                      <div>
                        <label className="form-control-label changeLabelFontColor">
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

                  <div>
                    <label className="form-control-label changeLabelFontColor mt-0">
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

                  <FtextField
                    type="number"
                    name="connectionFee"
                    label={t("connectionFeeDue")}
                  />

                  {!bpSettings?.genCustomerId && (
                    <FtextField
                      type="text"
                      label="Customer Id"
                      name="customerId"
                    />
                  )}

                  <div>
                    <p> {t("status")} </p>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="status"
                        value={"active"}
                        disabled={
                          !permission?.customerActivate && role !== "ispOwner"
                        }
                        checked={status === "active"}
                        onChange={(e) => setStatus("active")}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="inlineRadio1"
                      >
                        {t("active")}
                      </label>
                    </div>

                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="inlineRadio2"
                        value={"inactive"}
                        disabled={
                          !permission?.customerDeactivate && role !== "ispOwner"
                        }
                        checked={status === "inactive"}
                        onChange={(e) => setStatus("inactive")}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="inlineRadio2"
                      >
                        {t("in active")}
                      </label>
                    </div>

                    {customer?.status === "expired" && (
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          id="inlineRadio2"
                          checked={status === "expired"}
                          disabled
                        />
                        <label
                          className="form-check-label"
                          htmlFor="inlineRadio2"
                        >
                          {t("expired")}
                        </label>
                      </div>
                    )}
                  </div>

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
              </Form>
            )}
          </Formik>
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShow(false)}
            disabled={isLoading}
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            form="customerEdit"
            className="btn btn-success"
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : t("save")}
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
}
