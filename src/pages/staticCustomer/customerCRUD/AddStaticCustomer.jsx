/* eslint-disable react-hooks/exhaustive-deps */
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
import { addStaticCustomerApi } from "../../../features/staticCustomerApi";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";

//divisional location
import divisionsJSON from "../../../bdAddress/bd-divisions.json";
import districtsJSON from "../../../bdAddress/bd-districts.json";
import thanaJSON from "../../../bdAddress/bd-upazilas.json";
import getName from "../../../utils/getLocationName";

//custom hooks
import useISPowner from "../../../hooks/useISPOwner";
import SelectField from "../../../components/common/SelectField";
import apiLink from "../../../api/apiLink";
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

export default function AddStaticCustomer({ show, setShow }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { ispOwnerId } = useISPowner();

  // get user bp setting
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.userData?.bpSettings
  );

  //get user type
  const userType = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData?.bpSettings.queueType
  );

  // get all area
  const area = useSelector((state) => state?.area?.area);

  // get all SubArea
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
  const [autoDisable, setAutoDisable] = useState(true);
  const [subArea, setSubArea] = useState("");
  const [poleBox, setPoleBox] = useState([]);
  const [areaID, setAreaID] = useState("");

  const [billDate, setBillDate] = useState(new Date());
  const [connectionDate, setConnectionDate] = useState(new Date());
  const [maxUpLimit, setUpMaxLimit] = useState("");
  const [maxDownLimit, setDownMaxLimit] = useState("");
  const [monthlyFee, setMonthlyFee] = useState(packageRate?.rate || 0);

  const [divisionalArea, setDivisionalArea] = useState({
    division: "",
    district: "",
    thana: "",
  });

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
    customerBillingType: Yup.string().required(t("select billing type")),

    // monthlyFee: Yup.number()
    //   .integer()
    //   .min(0, "সর্বনিম্ন প্যাকেজ রেট 0")
    //   .required("প্যাকেজ রেট দিন"),
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
        fetchPackagefromDatabase(dispatch, IDs, setIsloading);
      }
    }
    setSingleMikrotik(id);
  };

  // select subArea
  const selectSubArea = (data) => {
    setPoleBox([]);
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
        const getLimit = setPackageLimit(target.value, false);
        getLimit && setUpMaxLimit(getLimit);
      }

      if (target.name === "corePackage") {
        setMikrotikPackage(target.value);
        const temp = ppPackage.find((val) => val.id === target.value);
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

    let poleBoxId;
    if (bpSettings?.poleBox) {
      poleBoxId = document.getElementById("poleBoxId").value;
    }

    if (subArea2 === "") {
      setIsloading(false);
      return alert(t("selectSubArea"));
    }
    if (!mikrotikPackage) {
      setIsloading(false);
      return alert(t("selectDownloadPackage"));
    }
    const {
      balance,
      ipAddress,
      queueName,
      target,
      customerId,
      srcAddress,
      ...rest
    } = data;
    if (!bpSettings.genCustomerId) {
      if (!customerId) {
        return alert(t("writeCustomerId"));
      }
    }
    const mainData = {
      paymentStatus: "unpaid",
      area: areaID,
      subArea: subArea2,
      poleBox: poleBoxId,
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
      // if (maxUpLimit) {
      //   sendingData.queue.maxLimit = `${maxUpLimit}/${maxUpLimit}`;
      // }
    }

    if (userType === "core-queue") {
      sendingData.userType = "core-queue";
      sendingData.queue = {
        type: userType,
        srcAddress: srcAddress,
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

    addStaticCustomerApi(
      dispatch,
      sendingData,
      setIsloading,
      setShow,
      resetForm
    );
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
              {t("addNewCustomer")}
            </h5>
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Formik
            initialValues={{
              name: "",
              mobile: "",
              address: "",
              email: "",
              nid: "",
              balance: "",
              ipAddress: "",
              srcAddress: "",
              queueName: "",
              target: "",
              referenceName: "",
              referenceMobile: "",
              customerId: "",
              customerBillingType: "prepaid",
            }}
            validationSchema={customerValidator}
            onSubmit={(values, { resetForm }) => {
              customerHandler(values, resetForm);
            }}
          >
            {() => (
              <Form id="customerPost">
                <div className="displayGrid3">
                  {bpSettings?.hasMikrotik && (
                    <div>
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
                  <div>
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

                  <div>
                    <label className="form-control-label changeLabelFontColor">
                      {t("selectSubArea")}
                    </label>
                    <select
                      className="form-select mw-100 mt-0"
                      aria-label="Default select example"
                      name="subArea"
                      id="subAreaId"
                      onChange={(e) => {
                        poleHandler(e.target.value);
                      }}
                    >
                      <option value="">...</option>
                      {subArea
                        ? subArea.map((val, key) => (
                            <option key={key} value={val.id}>
                              {val.name}
                            </option>
                          ))
                        : ""}
                    </select>
                  </div>

                  {bpSettings?.poleBox && (
                    <div>
                      <label className="form-control-label changeLabelFontColor">
                        {t("selectPoleBox/splitter")}
                      </label>
                      <select
                        className="form-select mw-100 mt-0"
                        aria-label="Default select example"
                        name="poleBox"
                        id="poleBoxId"
                      >
                        <option value="">...</option>
                        {poleBox?.map((val, key) => (
                          <option key={key} value={val.id}>
                            {val.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {userType === "simple-queue" && (
                    <div>
                      <FtextField
                        type="text"
                        label={t("queueName")}
                        name="queueName"
                      />
                    </div>
                  )}

                  {userType === "simple-queue" && (
                    <div>
                      <FtextField
                        type="text"
                        label={t("ipAddress")}
                        name="target"
                      />
                    </div>
                  )}

                  {userType === "firewall-queue" && (
                    <div>
                      <FtextField
                        type="text"
                        label={t("ipAddress")}
                        name="ipAddress"
                      />
                    </div>
                  )}

                  {userType === "core-queue" && (
                    <div>
                      <FtextField
                        type="text"
                        label={t("ipAddress")}
                        name="srcAddress"
                      />
                    </div>
                  )}

                  {bpSettings?.hasMikrotik && userType === "firewall-queue" && (
                    <div>
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

                  {bpSettings?.hasMikrotik && userType === "core-queue" && (
                    <div>
                      <>
                        <label className="form-control-label changeLabelFontColor">
                          {t("selectPackage")}{" "}
                        </label>
                        <select
                          name="corePackage"
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

                  {bpSettings?.hasMikrotik && userType === "simple-queue" && (
                    <div>
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
                    </div>
                  )}

                  {bpSettings?.hasMikrotik && userType === "simple-queue" && (
                    <div>
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
                    <div>
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
                  <div>
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
                    <div>
                      <FtextField
                        type="number"
                        label={t("prevDue")}
                        name="balance"
                      />
                    </div>
                  )}
                  <div>
                    <FtextField type="text" label={t("NIDno")} name="nid" />
                  </div>

                  <div>
                    <FtextField type="text" label={t("name")} name="name" />
                  </div>
                  <div>
                    <FtextField type="text" label={t("mobile")} name="mobile" />
                  </div>
                  <div>
                    <FtextField
                      type="text"
                      label={t("address")}
                      name="address"
                    />
                  </div>

                  {divisionalAreaFormData.map((item) => (
                    <div>
                      <label className="form-control-label changeLabelFontColor">
                        {item.text}
                        {/* <span className="text-danger">*</span> */}
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

                  <div>
                    <FtextField type="text" label={t("email")} name="email" />
                  </div>
                  <div>
                    <div className="billCycle">
                      <label className="form-control-label changeLabelFontColor">
                        {t("billingCycle")}{" "}
                      </label>

                      <DatePicker
                        className="form-control mw-100"
                        selected={billDate}
                        onChange={(date) => setBillDate(date)}
                        dateFormat="MMM dd yyyy hh:mm"
                        timeIntervals={60}
                        showTimeSelect
                        placeholderText={t("selectBillDate")}
                      />
                    </div>
                  </div>
                  <div>
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
                  <div>
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
                  </div>
                  <div>
                    <FtextField
                      type="text"
                      label={t("referenceName")}
                      name="referenceName"
                      disabled={!mikrotikPackage}
                    />
                  </div>
                  <div>
                    <FtextField
                      type="text"
                      label={t("referenceMobile")}
                      name="referenceMobile"
                      disabled={!mikrotikPackage}
                    />
                  </div>

                  {!bpSettings?.genCustomerId && (
                    <FtextField
                      type="text"
                      label={t("customerId")}
                      name="customerId"
                      disabled={!mikrotikPackage}
                      validation={"true"}
                    />
                  )}

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
          <div className="modal-footer border-none">
            <button
              type="button"
              className="btn btn-secondary"
              disabled={isLoading}
              onClick={() => setShow(false)}
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              form="customerPost"
              className="btn btn-success"
              disabled={isLoading}
            >
              {isLoading ? <Loader /> : t("save")}
            </button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
}
