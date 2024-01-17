import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";

// internal imports
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";

//divisional location
import divisionsJSON from "../../../bdAddress/bd-divisions.json";
import districtsJSON from "../../../bdAddress/bd-districts.json";
import thanaJSON from "../../../bdAddress/bd-upazilas.json";
import getName from "../../../utils/getLocationName";

// custom hooks import
import SelectField from "../../../components/common/SelectField";
import { addResellerStaticCustomer } from "../../../features/apiCallReseller";
import useISPowner from "../../../hooks/useISPOwner";

const divisions = divisionsJSON.divisions;
const districts = districtsJSON.districts;
const thana = thanaJSON.thana;

const AddStaticCustomer = ({ show, setShow }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get user & current user data form useISPOwner hooks
  const { role, hasMikrotik, resellerData, userData, permission } =
    useISPowner();

  // user customer type get form ispOwner bpSetting
  const userType = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData?.bpSettings.queueType
  );

  // get all area form reseller profile
  const area = useSelector((state) => state?.area?.area);

  // get ispOwner all mikrotik form redux store
  const Getmikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  // get mikrotik package from redux
  const ppPackage = useSelector((state) => state?.mikrotik?.pppoePackage);

  // reseller id from role base
  const resellerId = role === "collector" ? userData.reseller : userData.id;

  const [packageRate, setPackageRate] = useState({ rate: 0 });
  const [isLoading, setIsloading] = useState(false);
  const [singleMikrotik, setSingleMikrotik] = useState("");
  const [mikrotikPackage, setMikrotikPackage] = useState("");
  const [autoDisable, setAutoDisable] = useState(true);
  const [subArea, setSubArea] = useState("");
  const [billDate, setBillDate] = useState(new Date());
  const [maxUpLimit, setUpMaxLimit] = useState("");
  const [maxDownLimit, setDownMaxLimit] = useState("");
  const [monthlyFee, setMonthlyFee] = useState(packageRate?.rate || 0);

  // mikrorik package state
  const [mikrotikPackages, setMikrotikPackages] = useState([]);

  const [divisionalArea, setDivisionalArea] = useState({
    division: "",
    district: "",
    thana: "",
  });

  //modal show handler
  const handleClose = () => {
    setShow(false);
  };

  // customer validator
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
    customerBillingType: Yup.string().required(t("select billing type")),
  });

  // select Getmikrotik
  const selectMikrotik = (e) => {
    const id = e.target.value;
    if (id) {
      const mikrotikPackage = ppPackage.filter(
        (pack) => pack.mikrotik === id && pack.packageType === "queue"
      );
      setMikrotikPackages(mikrotikPackage);
    } else {
      setMikrotikPackages([]);
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

  // sending data to backed
  const customerHandler = async (data, resetForm) => {
    const { balance, ipAddress, queueName, target, ...rest } = data;
    const mainData = {
      paymentStatus: "unpaid",
      subArea: subArea,
      ispOwner: userData.ispOwner,
      reseller: resellerId,
      mikrotik: singleMikrotik,
      mikrotikPackage: mikrotikPackage,
      billPayType: "prepaid",
      autoDisable: autoDisable,
      billingCycle: moment(billDate)
        .subtract({ hours: 6 })
        .format("YYYY-MM-DDTHH:mm:ss.ms[Z]"),
      balance: -balance,
      ...rest,
      monthlyFee,
    };

    if (userType === "firewall-queue") {
      mainData.userType = "firewall-queue";
      mainData.queue = {
        type: userType,
        address: ipAddress,
        list: "allow_ip",
      };
    }

    if (userType === "simple-queue") {
      mainData.userType = "simple-queue";
      mainData.queue = {
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
      if (divisionName) mainData.division = divisionName;
      if (districtName) mainData.district = districtName;
      if (thanaName) mainData.thana = thanaName;
    }

    if (!hasMikrotik) {
      delete mainData.mikrotik;
    }

    addResellerStaticCustomer(
      dispatch,
      mainData,
      setIsloading,
      resetForm,
      setShow
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
            <h5 className="modal-title text-secondary" id="exampleModalLabel">
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
              queueName: "",
              target: "",
              customerBillingType: "prepaid",
              connectionFee: "",
            }}
            validationSchema={customerValidator}
            onSubmit={(values, { resetForm }) => {
              customerHandler(values, resetForm);
            }}
          >
            {() => (
              <Form id="customerPost">
                <div className="displayGrid3">
                  {hasMikrotik && (
                    <div>
                      <label className="form-control-label changeLabelFontColor">
                        {t("selectMikrotik")}
                        <span className="text-danger ms-1">*</span>
                      </label>
                      <select
                        className="form-select mw-100 mt-0"
                        aria-label="Default select example"
                        onChange={selectMikrotik}
                      >
                        <option value="">...</option>
                        {Getmikrotik.map((val, key) => (
                          <option key={key} value={val.id}>
                            {val.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="form-control-label changeLabelFontColor">
                      {t("selectArea")}
                      <span className="text-danger ms-1">*</span>
                    </label>
                    <select
                      className="form-select mw-100 mt-0"
                      aria-label="Default select example"
                      onChange={(event) => setSubArea(event.target.value)}
                    >
                      <option value="">...</option>
                      {area.map((val, key) => (
                        <option key={key} value={val.id}>
                          {val.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {userType === "simple-queue" && (
                    <FtextField
                      type="text"
                      label={t("ipAddress")}
                      name="target"
                      validation={true}
                    />
                  )}

                  {userType === "firewall-queue" && (
                    <FtextField
                      type="text"
                      label={t("ipAddress")}
                      name="ipAddress"
                      validation={true}
                    />
                  )}

                  {userType === "firewall-queue" && (
                    <div>
                      <label className="form-control-label changeLabelFontColor">
                        {t("selectPackage")}
                        <span className="text-danger ms-1">*</span>
                      </label>
                      <select
                        name="firewallPackage"
                        className="form-select mw-100 mt-0"
                        aria-label="Default select example"
                        onChange={selectMikrotikPackage}
                      >
                        <option value={"0"}>...</option>
                        {mikrotikPackages?.map(
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

                  {userType === "simple-queue" && (
                    <div>
                      <label className="form-control-label changeLabelFontColor">
                        {t("uploadPackge")}
                        <span className="text-danger ms-1">*</span>
                      </label>
                      <select
                        name="upPackage"
                        className="form-select mw-100 mt-0"
                        aria-label="Default select example"
                        onChange={selectMikrotikPackage}
                      >
                        <option value={"0"}>...</option>
                        {mikrotikPackages?.map(
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

                  {userType === "simple-queue" && (
                    <div>
                      <label className="form-control-label changeLabelFontColor">
                        {t("downloadPackge")}
                        <span className="text-danger ms-1">*</span>
                      </label>
                      <select
                        name="downPackage"
                        className="form-select mw-100 mt-0"
                        aria-label="Default select example"
                        onChange={selectMikrotikPackage}
                      >
                        <option value={"0"}>...</option>
                        {mikrotikPackages?.map(
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

                  <FtextField
                    type="number"
                    label={t("monthFee")}
                    name="monthlyFee"
                    min={0}
                    value={monthlyFee}
                    onChange={(e) => setMonthlyFee(e.target.value)}
                    validation={true}
                  />

                  {!hasMikrotik && (
                    <FtextField
                      type="number"
                      label={t("prevDue")}
                      name="balance"
                    />
                  )}

                  {userType === "simple-queue" && (
                    <FtextField
                      type="text"
                      label={t("queueName")}
                      name="queueName"
                    />
                  )}

                  <FtextField
                    type="text"
                    label={t("name")}
                    name="name"
                    validation={true}
                  />

                  <FtextField
                    type="text"
                    label={t("mobile")}
                    name="mobile"
                    validation={permission.addCustomerWithMobile}
                  />

                  <FtextField type="text" label={t("NIDno")} name="nid" />

                  <FtextField type="text" label={t("address")} name="address" />

                  <FtextField type="text" label={t("email")} name="email" />

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

                  <div>
                    <label className="form-control-label changeLabelFontColor">
                      {t("billingCycle")}
                      <span className="text-danger ms-1">*</span>
                    </label>
                    <DatePicker
                      className="form-control mw-100"
                      selected={billDate}
                      onChange={(data) => setBillDate(data)}
                      showTimeSelect
                      timeIntervals={60}
                      dateFormat="dd/MM/yyyy:hh:mm"
                      minDate={billDate}
                      disabled={permission?.billingCycleEdit === false}
                    />
                  </div>

                  <FtextField
                    type="number"
                    label={t("connectionFee")}
                    name="connectionFee"
                  />
                  <SelectField
                    label={t("customerBillType")}
                    id="exampleSelect"
                    name="customerBillingType"
                    className="form-select mw-100 mt-0"
                    validation={true}
                  >
                    <option value="">{t("customerBillType")}</option>

                    <option value="prepaid">{t("prepaid")}</option>
                    <option value="postpaid">{t("postPaid")}</option>
                  </SelectField>

                  {Getmikrotik.length > 0 &&
                    (permission?.customerAutoDisableEdit ||
                      resellerData.permission?.customerAutoDisableEdit) && (
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
              {isLoading ? <Loader /> : t("submit")}
            </button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default AddStaticCustomer;
