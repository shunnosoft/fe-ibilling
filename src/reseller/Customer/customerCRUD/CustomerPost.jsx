import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";

// custom hooks import
import useISPowner from "../../../hooks/useISPOwner";

// internal imports
import "../../collector/collector.css";
import "../customer.css";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import {
  addCustomer,
  getResellerPackageRate,
} from "../../../features/apiCallReseller";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import getName from "../../../utils/getLocationName";

//divisional location
import divisionsJSON from "../../../bdAddress/bd-divisions.json";
import districtsJSON from "../../../bdAddress/bd-districts.json";
import thanaJSON from "../../../bdAddress/bd-upazilas.json";
import SelectField from "../../../components/common/SelectField";
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

const CustomerModal = ({ show, setShow }) => {
  const { t } = useTranslation();
  // import dispatch
  const dispatch = useDispatch();

  // get user & current user data form useISPOwner hooks
  const { role, hasMikrotik, resellerData, userData, permission } =
    useISPowner();

  // get are from redux
  const area = useSelector((state) => state?.area?.area);

  // get mikrotik from redux
  const Getmikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  // get mikrotik package from redux
  const ppPackage = useSelector((state) => state?.mikrotik?.pppoePackage);

  // reseller id from role base
  const resellerId = role === "collector" ? userData.reseller : userData.id;

  // package commission rate
  const [packageCommission, setPackageCommission] = useState();

  //sub area id state
  const [subAreaId, setsubAreaId] = useState("");

  // package rate sate
  const [packageRate, setPackageRate] = useState("");

  // loading state
  const [isLoading, setIsloading] = useState(false);

  // set mikrotik id state
  const [singleMikrotik, setSingleMikrotik] = useState("");

  // set package state
  const [mikrotikPackage, setMikrotikPackage] = useState("");

  // mikrorik package state
  const [mikrotikPackages, setMikrotikPackages] = useState([]);

  // auto disable state
  const [autoDisable, setAutoDisable] = useState(true);

  // set bill date state
  const [billDate, setBillDate] = useState(new Date());

  const [divisionalArea, setDivisionalArea] = useState({
    division: "",
    district: "",
    thana: "",
  });

  // get api calls
  useEffect(() => {
    mikrotikPackage &&
      userData?.commissionType === "packageBased" &&
      userData?.commissionStyle === "fixedRate" &&
      getResellerPackageRate(resellerId, mikrotikPackage, setPackageCommission);
  }, [mikrotikPackage]);

  //modal show handler
  const handleClose = () => {
    setShow(false);
  };

  // form validation validator
  const customerValidator = Yup.object({
    name: Yup.string().required(t("writeCustomerName")),
    mobile: Yup.string()
      .matches(/^(01){1}[3456789]{1}(\d){8}$/, t("incorrectMobile"))
      .min(11, t("write11DigitMobileNumber"))
      .max(11, t("over11DigitMobileNumber")),
    address: Yup.string(),
    email: Yup.string().email(t("incorrectEmail")),
    nid: Yup.string(),
    monthlyFee: Yup.number()
      .required(t("writeMonthFee"))
      .min(
        packageCommission && packageCommission?.ispOwnerRate
          ? packageCommission?.ispOwnerRate
          : packageRate?.rate,
        t("packageRateMustBeUpToIspOwnerCommission")
      ),
    Pname: Yup.string().required(t("writePPPoEName")),
    Ppassword: Yup.string().required(t("writePPPoEPassword")),
    Pcomment: Yup.string(),
    customerBillingType: Yup.string().required(t("select billing type")),
  });

  // select Getmikrotik
  const selectMikrotik = (e) => {
    const id = e.target.value;
    if (id) {
      const mikrotikPackage = ppPackage.filter(
        (pack) => pack.mikrotik === id && pack.packageType === "pppoe"
      );
      setMikrotikPackages(mikrotikPackage);
    } else {
      setMikrotikPackages([]);
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

    if (
      (role === "reseller" && permission.addCustomerWithMobile) ||
      (role === "collector" && resellerData.permission?.addCustomerWithMobile)
    ) {
      if (data.mobile === "") {
        setIsloading(false);
        return alert(t("writeMobileNumber"));
      }
    }

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

    addCustomer(dispatch, mainData, setIsloading, resetForm, setShow);
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
              monthlyFee: packageRate?.rate || "",
              Pname: "",
              Pprofile: packageRate?.name || "",
              Ppassword: "",
              Pcomment: "",
              customerBillingType: "prepaid",
              connectionFee: "",
            }}
            validationSchema={customerValidator}
            onSubmit={(values, { resetForm }) => {
              customerHandler(values, resetForm);
            }}
            enableReinitialize
          >
            {() => (
              <Form id="customerPost">
                <div className="displayGrid3">
                  {/* ispOwner collector */}
                  {role === "collector" && (
                    <>
                      {hasMikrotik && (
                        <div>
                          <label className="form-control-label changeLabelFontColor">
                            {t("selectMikrotik")}
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-select mw-100 mt-0"
                            aria-label="Default select example"
                            onChange={selectMikrotik}
                          >
                            <option value="">...</option>
                            {Getmikrotik?.map((val, key) => (
                              <option key={key} value={val.id}>
                                {val.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div>
                        <label className="form-control-label changeLabelFontColor">
                          {t("selectPackage")}
                          <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select mw-100 mt-0"
                          aria-label="Default select example"
                          onChange={selectMikrotikPackage}
                        >
                          <option value="">...</option>
                          {mikrotikPackages?.map((val, key) => (
                            <option key={key} value={val.id}>
                              {val.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  {role === "reseller" && Getmikrotik.length > 0 && (
                    <>
                      {hasMikrotik && (
                        <div>
                          <label className="form-control-label changeLabelFontColor">
                            {t("selectMikrotik")}
                            <span className="text-danger">*</span>
                          </label>

                          <select
                            className="form-select mw-100 mt-0"
                            aria-label="Default select example"
                            onChange={selectMikrotik}
                          >
                            <option value="">...</option>
                            {Getmikrotik?.map((val, key) =>
                              userData.mikrotiks.map(
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
                      )}

                      <div>
                        <label className="form-control-label changeLabelFontColor">
                          {t("selectPackage")}
                          <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select mw-100 mt-0"
                          aria-label="Default select example"
                          onChange={selectMikrotikPackage}
                        >
                          <option value="">...</option>
                          {mikrotikPackages?.map((val, key) => (
                            <option key={key} value={val.id}>
                              {val.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  {role === "reseller" && Getmikrotik.length === 0 && (
                    <div>
                      <label className="form-control-label changeLabelFontColor">
                        {t("selectPPPoEPackage")}
                        <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select mt-0 mw-100"
                        aria-label="Default select example"
                        onChange={selectMikrotikPackage}
                      >
                        <option value="">...</option>
                        {ppPackage?.map((val, key) => (
                          <option key={key} value={val.id}>
                            {val.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <FtextField
                    type="text"
                    label={t("monthFee")}
                    name="monthlyFee"
                    validation={"true"}
                    disabled={!permission?.monthlyFeeEdit}
                  />

                  <FtextField
                    type="text"
                    label={t("PPPoEName")}
                    name="Pname"
                    validation={"true"}
                  />

                  <FtextField
                    type="text"
                    label={t("password")}
                    name="Ppassword"
                    validation={"true"}
                  />

                  <FtextField
                    type="text"
                    label={t("comment")}
                    name="Pcomment"
                  />

                  <div>
                    <label className="form-control-label changeLabelFontColor">
                      {t("selectArea")} <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select mw-100 mt-0"
                      aria-label="Default select example"
                      onChange={(e) => setsubAreaId(e.target.value)}
                    >
                      <option value="">...</option>
                      {area?.map((val, key) => (
                        <option key={key} value={val.id}>
                          {val.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <FtextField type="text" label={t("NIDno")} name="nid" />

                  <FtextField
                    type="text"
                    label={t("name")}
                    name="name"
                    validation={"true"}
                  />

                  <FtextField
                    type="text"
                    label={t("mobile")}
                    validation={
                      permission?.addCustomerWithMobile ||
                      resellerData.permission?.addCustomerWithMobile
                    }
                    name="mobile"
                  />
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
                      >
                        <option value="">...</option>
                        {item.data.map((item) => (
                          <option value={item.id}>{item.name}</option>
                        ))}
                      </select>
                    </div>
                  ))}

                  {role === "collector" ? (
                    <div className="billCycle">
                      <label className="form-control-label changeLabelFontColor">
                        {t("billingCycle")}
                      </label>

                      <DatePicker
                        className="form-control mw-100"
                        selected={billDate}
                        onChange={(date) => setBillDate(date)}
                        dateFormat="dd/MM/yyyy:hh:mm"
                        showTimeSelect
                        timeIntervals={60}
                        maxDate={billDate}
                        placeholderText={t("selectBillDate")}
                        disabled
                      />
                    </div>
                  ) : (
                    <div className="billCycle">
                      <label className="form-control-label changeLabelFontColor">
                        {t("billingCycle")}
                      </label>

                      <DatePicker
                        className="form-control mw-100"
                        selected={billDate}
                        onChange={(date) => setBillDate(date)}
                        dateFormat="dd/MM/yyyy:hh:mm"
                        timeIntervals={60}
                        showTimeSelect
                        maxDate={billDate}
                        placeholderText={t("selectBillDate")}
                        disabled={permission?.billingCycleEdit === false}
                      />
                    </div>
                  )}

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
                    validation={"true"}
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
          <button
            type="button"
            className="btn btn-secondary"
            disabled={isLoading}
            onClick={handleClose}
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
        </ModalFooter>
      </Modal>
    </>
  );
};

export default CustomerModal;
