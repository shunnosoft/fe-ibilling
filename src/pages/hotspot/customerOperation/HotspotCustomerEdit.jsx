import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import ReactDatePicker from "react-datepicker";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Card, InputGroup } from "react-bootstrap";

//internal import
import { TextField } from "../../../components/common/HorizontalTextField";
import { getSubAreasApi } from "../../../features/actions/customerApiCall";
import { fetchMikrotik, getArea } from "../../../features/apiCalls";
import {
  editHotspotCustomer,
  getHotspotPackage,
} from "../../../features/hotspotApi";
import Loader from "../../../components/common/Loader";
import SelectField from "../../../components/common/SelectField";
import { Cash, Envelope, Eye, EyeSlash } from "react-bootstrap-icons";

const HotspotCustomerEdit = ({ customerId, setProfileOption }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // current month day
  var today = new Date();
  var getTotalMonthDate = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

  // customer validator
  const customerValidator = Yup.object({
    dayLength: Yup.number()
      .integer()
      .min(1, t("minimumDay"))
      .required(t("minimumDay")),
    name: Yup.string().required(t("writeCustomerName")),
    mobile: Yup.string()
      .matches(/^(01){1}[3456789]{1}(\d){8}$/, t("incorrectMobile"))
      .min(11, t("write11DigitMobileNumber"))
      .max(11, t("over11DigitMobileNumber"))
      .required(t("writeMobileNumber")),
    address: Yup.string(),
    email: Yup.string().email(t("incorrectEmail")),
    nid: Yup.string(),
    monthlyFee: Yup.number()
      .integer()
      .min(0, t("minimumPackageRate"))
      .required(t("enterPackageRate")),
    hotspotName: Yup.string().required(t("writePPPoEName")),
    hotspotPassword: Yup.string().required(t("writePPPoEPassword")),
    hotspotComment: Yup.string(),
    billPayType: Yup.string().required(t("select billing type")),
  });

  // get hotspot customer
  const customer = useSelector((state) => state.hotspot.customer);

  // find editable data
  const editCustomer = customer.find((item) => item.id === customerId);

  // get role
  const userRole = useSelector((state) => state.persistedReducer.auth?.role);

  // get ispOwner Id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // get bp settings
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData?.bpSettings
  );

  // get all subAreas
  const storeSubArea = useSelector((state) => state.area?.subArea);

  const mikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  // get hotspot package
  const hotspotPackage = useSelector((state) => state.hotspot.package);

  // get area
  const area = useSelector((state) => state?.area?.area);

  // get all subarea
  const subAreas = useSelector((state) => state.area?.subArea);

  // loading state
  const [hotspotPackageLoading, setHotspotPackageLoading] = useState(false);
  const [mikrotikLoading, setMikrotikLoading] = useState(false);
  const [areaLoading, setAreaLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // bill date state
  const [billDate, setBillDate] = useState(new Date());

  // customer select date state
  const [dayToday, setDayToday] = useState("");

  // connection date state
  const [promiseDate, setPromiseDate] = useState();

  // mikrotik id state
  const [mikrotikId, setMikrotikId] = useState();

  // package id state
  const [packageId, setPackageId] = useState();

  // customer package state
  const [packageInfo, setPackageInfo] = useState();

  //customer package rate state
  const [packageRate, setPackageRate] = useState();

  // password type default password
  const [passType, setPassType] = useState("password");

  // area id state
  const [areaId, setAreaId] = useState();

  // sub area id state
  const [subareaId, setSubAreaId] = useState();

  // subarea state
  const [subArea, setSubArea] = useState();

  // seclect sub area state
  const [slectSubArea, setSelectSubArea] = useState([]);

  // customer status change
  const [status, setStatus] = useState("");

  useEffect(() => {
    // get mikrotik api call
    fetchMikrotik(dispatch, ispOwnerId, setMikrotikLoading);

    // get hotspot package api call
    getHotspotPackage(dispatch, ispOwnerId, setHotspotPackageLoading);

    // get area api
    getArea(dispatch, ispOwnerId, setAreaLoading);

    // get sub area api
    getSubAreasApi(dispatch, ispOwnerId);

    // set mikrotikId into state
    setMikrotikId(editCustomer?.mikrotik);

    // customer day length
    if (editCustomer) setDayToday(editCustomer?.dayLength);

    // set billing cycle
    if (editCustomer) setBillDate(new Date(editCustomer?.billingCycle));

    // set connection Date
    if (editCustomer) setPromiseDate(new Date(editCustomer?.promiseDate));

    // set customer package info
    if (editCustomer) {
      const customerPackage = hotspotPackage?.find(
        (val) => val.id === editCustomer?.hotspotPackage
      );
      setPackageInfo(customerPackage);
    }

    // set customer package rate
    if (editCustomer) setPackageRate(editCustomer?.monthlyFee);

    // set package id
    if (editCustomer) setPackageId(editCustomer?.hotspotPackage);

    // set sub area id
    if (editCustomer) setSubAreaId(editCustomer?.subArea);

    // set status
    if (editCustomer) setStatus(editCustomer?.status);
  }, [editCustomer]);

  useEffect(() => {
    let temp;
    area.map((a) => {
      a.subAreas.map((sub) => {
        if (sub === editCustomer?.subArea) {
          temp = a.id;
        }
        return sub;
      });
      return a;
    });
    setAreaId(temp);

    const initialSubAreas = storeSubArea.filter((val) => val.area === temp);
    setSelectSubArea(initialSubAreas);
  }, [area, editCustomer, storeSubArea]);

  // subarea handler
  const selectArea = (areaId) => {
    if (area) {
      const filterSubarea = area.find((val) => val.id === areaId);
      setSubArea(filterSubarea);
      const allSub = storeSubArea.filter((val) => val.area === areaId);
      setSelectSubArea(allSub);
      setSubAreaId(allSub[0].id);
    }
  };

  // customer day length package rate handle
  const customerDayLengthHandle = (e) => {
    if (Number(e.target.value) === getTotalMonthDate) {
      setPackageRate(packageInfo?.rate);
    } else {
      const cusotmerPerDayBill = packageInfo?.rate / getTotalMonthDate;

      const dayTodayFee = cusotmerPerDayBill * Number(e.target.value);
      setPackageRate(Math.trunc(dayTodayFee));
    }
    setDayToday(e.target.value);
  };

  //customer package handle
  const customerPackageHandle = (e) => {
    setPackageId(e.target.value);
    const filterPackageRate = hotspotPackage.find(
      (item) => item.id === e.target.value
    );
    setPackageInfo(filterPackageRate);

    if (Number(dayToday) === getTotalMonthDate) {
      setPackageRate(filterPackageRate?.rate);
    } else {
      const cusotmerPerDayBill = filterPackageRate?.rate / getTotalMonthDate;

      const dayTodayFee = cusotmerPerDayBill * Number(dayToday);
      setPackageRate(Math.trunc(dayTodayFee));
    }
  };

  // handle Submit
  const handleSubmit = (data) => {
    if (!mikrotikId) {
      setIsLoading(false);
      return alert(t("selectMikrotik"));
    }

    if (!packageId) {
      setIsLoading(false);
      return alert(t("selectPackage"));
    }

    if (!subareaId) {
      setIsLoading(false);
      return alert(t("selectSubarea"));
    }

    const sendingData = {
      address: data?.address,
      area: slectSubArea[0]?.area,
      subArea: subareaId,
      ispOwner: ispOwnerId,
      mikrotik: mikrotikId,
      hotspotPackage: packageId,
      email: data?.email,
      mobile: data?.mobile,
      billPayType: data.billPayType,
      autoDisable: false,
      promiseDate: promiseDate?.toISOString(),
      billingCycle: billDate?.toISOString(),
      balance: 0,
      dayLength: Number(dayToday),
      monthlyFee: data?.monthlyFee,
      name: data?.name,
      nid: data?.nid,
      hotspot: {
        name: data.hotspotName,
        password: data.hotspotPassword,
        comment: data.hotspotComment,
        profile: data.hotspotProfile,
      },
      status: status,
    };
    editHotspotCustomer(dispatch, sendingData, customerId, setIsLoading);
  };

  return (
    <>
      <Card.Title className="clintTitle mb-0">
        <h5 className="profileInfo">{t("updateProfile")}</h5>
      </Card.Title>

      <Card.Body>
        <Formik
          initialValues={{
            dayLength: dayToday,
            name: editCustomer?.name || "",
            mobile: editCustomer?.mobile || "",
            address: editCustomer?.address || "",
            email: editCustomer?.email || "",
            nid: editCustomer?.nid || "",
            monthlyFee: packageRate,
            hotspotName: editCustomer?.hotspot.name || "",
            hotspotProfile:
              editCustomer?.hotspot.profile || packageInfo?.name || "",
            hotspotPassword: editCustomer?.hotspot.password || "",
            hotspotComment: editCustomer?.hotspot.comment || "",
            balance: editCustomer?.balance || 0,
            billPayType: editCustomer?.billPayType || "",
          }}
          validationSchema={customerValidator}
          onSubmit={(values) => handleSubmit(values)}
          enableReinitialize
        >
          {() => (
            <Form>
              <div>
                <TextField
                  type="number"
                  label={t("dayLength")}
                  name="dayLength"
                  disabled={userRole !== "ispOwner"}
                  validation={"true"}
                  onChange={customerDayLengthHandle}
                />

                <div className="displayGridManual6_4">
                  <label className="form-control-label manualLable">
                    {t("selectPackage")}
                    <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select mw-100 mt-0"
                    onChange={customerPackageHandle}
                  >
                    <option value="">...</option>
                    {hotspotPackage &&
                      hotspotPackage?.map((val, key) => (
                        <>
                          {val.mikrotik === mikrotikId && (
                            <option
                              key={key}
                              value={val.id}
                              status="package"
                              selected={editCustomer?.hotspotPackage === val.id}
                            >
                              {val.name}
                            </option>
                          )}
                        </>
                      ))}
                  </select>
                </div>

                <div className="displayGridManual6_4">
                  <label
                    class="form-control-label manualLable"
                    htmlFor="manuallyPassword"
                  >
                    {t("packageRate")}
                    <span className="text-danger">*</span>
                  </label>

                  <div>
                    <InputGroup>
                      <Field
                        className="form-control shadow-none"
                        type="number"
                        min={0}
                        name="monthlyFee"
                        disabled={!(packageId && userRole === "ispOwner")}
                      />
                      {editCustomer?.monthlyFee > 0 && (
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
                  disabled={!packageId}
                  validation={"true"}
                />

                <TextField
                  type="text"
                  label={t("hotspotName")}
                  name="hotspotName"
                  disabled={!packageId}
                  validation={"true"}
                />

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
                        disabled={!packageId}
                      />
                      {editCustomer?.mobile && (
                        <InputGroup.Text
                          validation={true}
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
                        name="hotspotPassword"
                        disabled={!packageId}
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

                    <ErrorMessage name="hotspotPassword" component="div">
                      {(err) => (
                        <span className="errorMessage text-danger">{err}</span>
                      )}
                    </ErrorMessage>
                  </div>
                </div>

                <TextField
                  type="text"
                  label={t("NIDno")}
                  name="nid"
                  disabled={!packageId}
                />

                <div className="displayGridManual6_4">
                  <label className="form-control-label manualLable">
                    {t("selectArea")} <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select mw-100 mt-0"
                    aria-label="Default select example"
                    onChange={(event) => selectArea(event.target.value)}
                    disabled={!packageId}
                  >
                    <option value="">...</option>
                    {area.length &&
                      area?.map((val, key) => (
                        <option
                          key={key}
                          value={val.id}
                          selected={val.id === areaId}
                        >
                          {val.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="displayGridManual6_4">
                  <label className="form-control-label manualLable">
                    {t("selectSubArea")}
                    <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select mw-100 mt-0"
                    aria-label="Default select example"
                    name="subArea"
                    id="subAreaIdHotspot"
                    onChange={(event) => setSubAreaId(event.target.value)}
                    disabled={!packageId}
                  >
                    <option value="">...</option>
                    {subArea?.subAreas &&
                      subArea.subAreas.map((val, key) => (
                        <option
                          key={key}
                          value={val.id}
                          selected={val.id === editCustomer?.subArea}
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

                  <ReactDatePicker
                    className="form-control mw-100"
                    selected={billDate}
                    onChange={(date) => setBillDate(date)}
                    dateFormat="MMM dd yyyy hh:mm"
                    showTimeSelect
                    placeholderText={t("selectBillDate")}
                    disabled={!(packageId && userRole === "ispOwner")}
                  />
                </div>

                <div className="displayGridManual6_4">
                  <label className="form-control-label manualLable">
                    {t("promiseDate")}
                  </label>
                  <ReactDatePicker
                    className="form-control mw-100"
                    selected={promiseDate}
                    onChange={(date) => setPromiseDate(date)}
                    dateFormat="MM/dd/yyyy"
                    placeholderText={t("selectDate")}
                    disabled={!packageId}
                  />
                </div>

                <TextField
                  type="text"
                  label={t("address")}
                  name="address"
                  disabled={!packageId}
                />

                <TextField
                  type="text"
                  label={t("email")}
                  name="email"
                  disabled={!packageId}
                />

                <TextField
                  type="text"
                  label={t("comment")}
                  name="hotspotComment"
                  disabled={!packageId}
                />

                <div className="displayGridManual6_4">
                  <label className="form-control-label manualLable">
                    {t("customerBillType")}
                  </label>

                  <SelectField
                    id="exampleSelect"
                    name="billPayType"
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

export default HotspotCustomerEdit;
