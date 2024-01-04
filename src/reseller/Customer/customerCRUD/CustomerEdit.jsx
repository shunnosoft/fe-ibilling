import { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect } from "react";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import { Card, InputGroup } from "react-bootstrap";
import { Cash, Envelope, Eye, EyeSlash } from "react-bootstrap-icons";

// internal imports
import "../../collector/collector.css";
import "../customer.css";
import Loader from "../../../components/common/Loader";
import {
  editCustomer,
  fetchpppoePackage,
} from "../../../features/apiCallReseller";
import { TextField } from "../../../components/common/HorizontalTextField";

import getName from "../../../utils/getLocationName";
import useISPowner from "../../../hooks/useISPOwner";

//divisional location
import divisionsJSON from "../../../bdAddress/bd-divisions.json";
import districtsJSON from "../../../bdAddress/bd-districts.json";
import thanaJSON from "../../../bdAddress/bd-upazilas.json";
import SelectField from "../../../components/common/SelectField";

const divisions = divisionsJSON.divisions;
const districts = districtsJSON.districts;
const thana = thanaJSON.thana;

const CustomerEdit = ({ customerId, setProfileOption }) => {
  const { t } = useTranslation();

  // customer validator
  const customerValidator = Yup.object({
    name: Yup.string().required(t("writeCustomerName")),
    mobile: Yup.string()
      .matches(/^(01){1}[3456789]{1}(\d){8}$/, t("incorrectMobile"))
      .min(11, t("write11DigitMobileNumber"))
      .max(11, t("over11DigitMobileNumber")),
    address: Yup.string(),
    email: Yup.string().email(t("incorrectEmail")),
    nid: Yup.string(),
    monthlyFee: Yup.number().integer().required(t("writeMonthFee")),
    Pname: Yup.string().required(t("writePPPoEName")),
    Ppassword: Yup.string().required(t("writePPPoEPassword")),
    Pcomment: Yup.string(),
    customerBillingType: Yup.string().required(t("select billing type")),
  });

  // get user & current user data form useISPOwner
  const {
    role,
    ispOwnerId,
    bpSettings,
    resellerData,
    permission,
    permissions,
  } = useISPowner();

  //get reseller all customer
  const customer = useSelector((state) => state?.customer?.customer);

  // single customer data
  const data = customer.find((item) => item.id === customerId);

  // get reseller & collector id form redux
  const resellerId = useSelector((state) =>
    role === "reseller"
      ? state.persistedReducer.auth?.userData?.id
      : state.persistedReducer.auth?.userData?.reseller
  );

  // get mikrotik package from redux
  const withOutMtkPackage = useSelector(
    (state) => state?.mikrotik?.pppoePackage
  );

  // get reseller pppoe package in redux
  const mikrotikPackages = useSelector((state) => state.mikrotik?.pppoePackage);

  // get area from redux
  const area = useSelector((state) => state?.area?.area);

  // get ispOwner mikrotiks form redux store
  const Getmikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  //loading state
  const [isLoading, setIsloading] = useState(false);

  // with & with out mikrotik packages state
  const [ppPackage, setppPackage] = useState([]);

  // customer mikrotik package
  const [customerPackage, setCustomerPackage] = useState();

  const [autoDisable, setAutoDisable] = useState(data?.autoDisable);
  const [subArea, setSubArea] = useState("");
  const dispatch = useDispatch();
  const [activeStatus, setActiveStatus] = useState(data?.pppoe?.disabled);
  const [areaID, setAreaID] = useState("");

  // customer billing cycle date
  const [billDate, setBillDate] = useState();

  // connection date state
  const [connectionDate, setConnectionDate] = useState("");

  const [status, setStatus] = useState("");

  // initial package rate
  const [dataMikrotikPackage, setDataMikrotikPackage] = useState();

  // password type default password
  const [passType, setPassType] = useState("password");

  const [divisionalArea, setDivisionalArea] = useState({
    division: "",
    district: "",
    thana: "",
  });

  useEffect(() => {
    // get reseller pppoe package api call
    const mikrotik = {
      mikrotikId: data?.mikrotik,
    };
    if (mikrotikPackages.length === 0) fetchpppoePackage(dispatch, mikrotik);

    setAreaID(data?.subArea);
    setStatus(data?.status);
    setAutoDisable(data?.autoDisable);

    //set customer mikrotik package id
    setDataMikrotikPackage(data?.mikrotikPackage);

    setSubArea(data?.subArea);

    // set Customer billing cycle date
    if (data) setBillDate(new Date(data?.billingCycle));

    // set customer connection date
    setConnectionDate(
      data?.connectionDate ? new Date(data?.connectionDate) : null
    );

    // pppoe mikrotik & with out mikrotik packages
    if (!bpSettings?.hasMikrotik) {
      setppPackage(withOutMtkPackage);
    } else {
      setppPackage(mikrotikPackages);
    }

    //select customer district,division and thana for sync with state
    const divisionalInfo = {};

    if (data?.division) {
      const division = divisions.find((item) => item.name === data.division);
      divisionalInfo.division = division.id;
    }

    if (data?.district) {
      const district = districts.find((item) => item.name === data.district);
      divisionalInfo.district = district.id;
    }

    if (data?.thana) {
      const findThana = thana.find(
        (item) =>
          item.name === data.thana &&
          item.district_id === divisionalInfo.district
      );
      divisionalInfo.thana = findThana?.id;
    }

    setDivisionalArea({
      ...divisionalArea,
      ...divisionalInfo,
    });
  }, [Getmikrotik, data, ispOwnerId]);

  // find customer mikrotik package
  useEffect(() => {
    const fiendPackage = ppPackage.find(
      (val) => val.id === data?.mikrotikPackage
    );
    setCustomerPackage(fiendPackage);
  }, [ppPackage, data]);

  // select Mikrotik Package
  const selectMikrotikPackage = (e) => {
    setDataMikrotikPackage(e.target.value);

    // find customer mikrotik package
    const selectPakcage = ppPackage.find((val) => val.id === e.target.value);
    setCustomerPackage(selectPakcage);
  };

  // select subArea
  const selectSubArea = (data) => {
    setSubArea(data.target.value);
    setAreaID(data.target.value);
  };

  // sending data to backed
  const customerHandler = async (formValue) => {
    const { Pname, Ppassword, Pprofile, Pcomment, monthlyFee, ...rest } =
      formValue;

    // monthly bill alert
    if (Number(monthlyFee) < Number(customerPackage?.rate)) {
      return alert(t("billCannotBeReduced"));
    }

    // mobile number alert
    if (
      (role === "reseller" && permission.addCustomerWithMobile) ||
      (role === "collector" && resellerData.permission?.addCustomerWithMobile)
    ) {
      if (formValue.mobile === "") {
        setIsloading(false);
        return alert(t("writeMobileNumber"));
      }
    }

    const mainData = {
      singleCustomerID: data?.id,
      subArea: subArea,
      ispOwner: ispOwnerId,
      mikrotik: data?.mikrotik,
      mikrotikPackage: customerPackage?.id,
      monthlyFee,
      connectionDate,
      reseller: resellerId,
      billingCycle: moment(billDate).format("YYYY-MM-DDTHH:mm:ss.ms[Z]"),
      pppoe: {
        name: Pname,
        password: Ppassword,
        service: "pppoe",
        comment: Pcomment,
        profile: Pprofile,
        disabled: activeStatus,
      },
      ...rest,

      status,
    };

    if (data?.monthlyFee < customerPackage?.rate) {
      const result = customerPackage?.rate - data?.monthlyFee;
      if (result < 0) {
        mainData.balance = data?.balance - -result;
      } else {
        mainData.balance = data?.balance - result;
      }
      if (mainData.balance < data?.monthlyFee) {
        mainData.paymentStatus = "unpaid";
      }
    }

    if (Getmikrotik.length > 0) {
      mainData.mikrotik = data?.mikrotik;
      mainData.autoDisable = autoDisable;
    }

    //select customer district,division and thana for sync with state
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

    editCustomer(dispatch, mainData, setIsloading, "");
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
      <Card.Title className="clintTitle mb-0">
        <h5 className="profileInfo">{t("updateProfile")}</h5>
      </Card.Title>

      <Card.Body>
        <Formik
          initialValues={{
            name: data?.name || "",
            mobile: data?.mobile || "",
            address: data?.address || "",
            email: data?.email || "",
            nid: data?.nid || "",
            Pcomment: data?.pppoe?.comment || "",
            monthlyFee:
              dataMikrotikPackage === data?.mikrotikPackage
                ? data?.monthlyFee
                : customerPackage?.rate,
            Pname: data?.pppoe?.name || "",
            Pprofile: customerPackage?.name || data?.pppoe?.profile || "",
            Ppassword: data?.pppoe?.password || "",
            customerBillingType: data?.customerBillingType,
          }}
          validationSchema={customerValidator}
          onSubmit={(values) => {
            customerHandler(values);
          }}
          enableReinitialize
        >
          {() => (
            <Form>
              <div>
                <div className="displayGridManual6_4">
                  <label className="form-control-label manualLable">
                    {t("package")}
                    <span className="text-danger">*</span>
                  </label>

                  <select
                    className="form-select mw-100 mt-0"
                    onChange={selectMikrotikPackage}
                    disabled={!permission?.customerMikrotikPackageEdit}
                  >
                    {ppPackage?.map((val, key) => (
                      <option
                        selected={val.id === customerPackage?.id}
                        disabled={val.rate < customerPackage?.rate}
                        key={key}
                        value={val.id || ""}
                      >
                        {val.name}
                      </option>
                    ))}
                  </select>
                </div>

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
                        name="monthlyFee"
                        min={customerPackage?.rate || data?.monthlyFee}
                        disabled={!permission?.monthlyFeeEdit}
                        validation={true}
                      />
                      {data?.monthlyFee > 0 &&
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

                <TextField
                  type="text"
                  label={t("name")}
                  name="name"
                  validation={"true"}
                />

                <TextField
                  type="text"
                  label={t("PPPoEName")}
                  name="Pname"
                  validation={"true"}
                  disabled={role === "collector"}
                />

                <div className="displayGridManual6_4">
                  <label
                    class="form-control-label manualLable"
                    htmlFor="manuallyPassword"
                  >
                    {t("mobile")}
                    {(permission?.addCustomerWithMobile ||
                      resellerData.permission?.addCustomerWithMobile) && (
                      <span className="text-danger">*</span>
                    )}
                  </label>

                  <div>
                    <InputGroup>
                      <Field
                        className="form-control shadow-none"
                        type="text"
                        name="mobile"
                        validation={
                          permission?.addCustomerWithMobile ||
                          resellerData.permission?.addCustomerWithMobile
                        }
                        disabled={
                          !permission?.addCustomerWithMobile ||
                          (!resellerData.permission?.addCustomerWithMobile &&
                            role === "collector")
                        }
                      />
                      {data?.mobile &&
                        (role === "reseller" ||
                          resellerData.permission?.sendSMS) && (
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
                  <label
                    class="form-control-label manualLable"
                    htmlFor="manuallyPassword"
                  >
                    {t("password")}
                    <span className="text-danger">*</span>
                  </label>

                  <div>
                    <InputGroup>
                      <Field
                        className="form-control shadow-none"
                        type={passType}
                        name="Ppassword"
                        validation={true}
                        disabled={role === "collector"}
                      />
                      <InputGroup.Text style={{ cursor: "pointer" }}>
                        <div>
                          {passType === "password" ? (
                            <EyeSlash
                              size={22}
                              onClick={(e) => setPassType("text")}
                            />
                          ) : (
                            <Eye
                              size={22}
                              onClick={(e) => setPassType("password")}
                            />
                          )}
                        </div>
                      </InputGroup.Text>
                    </InputGroup>

                    <ErrorMessage name="Ppassword" component="div">
                      {(err) => (
                        <span className="errorMessage text-danger">{err}</span>
                      )}
                    </ErrorMessage>
                  </div>
                </div>

                <TextField type="text" label={t("NIDno")} name="nid" />

                <div className="displayGridManual6_4">
                  <label className="form-control-label manualLable">
                    {t("selectArea")} <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select mw-100 mt-0"
                    aria-label="Default select example"
                    onChange={selectSubArea}
                  >
                    {area?.length !== undefined &&
                      area?.map((val, key) => (
                        <option
                          selected={val.id === areaID}
                          key={key}
                          value={val.id || ""}
                        >
                          {val.name}
                        </option>
                      ))}
                  </select>
                </div>

                {permission?.billingCycleEdit && (
                  <div className="displayGridManual6_4">
                    <label className="form-control-label manualLable">
                      {t("billingCycle")}
                    </label>

                    <DatePicker
                      className="form-control mw-100"
                      selected={billDate}
                      onChange={(data) => setBillDate(data)}
                      timeIntervals={60}
                      showTimeSelect
                      dateFormat="MMM dd yyyy hh:mm a"
                      minDate={new Date()}
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

                <TextField
                  type="text"
                  label={t("comment")}
                  name="Pcomment"
                  disabled={role === "collector"}
                />

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

                <TextField
                  type="number"
                  label={t("connectionFee")}
                  name="connectionFee"
                  disabled={role === "collector"}
                />

                <div className="displayGridManual6_4">
                  <label className="form-control-label manualLable">
                    {t("customerBillType")}
                  </label>

                  <SelectField
                    id="exampleSelect"
                    name="customerBillingType"
                    className="form-select mw-100 mt-0"
                    validation={"true"}
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

export default CustomerEdit;
