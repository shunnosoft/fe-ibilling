import { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import "../../collector/collector.css";
import "../customer.css";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import { editCustomer } from "../../../features/apiCallReseller";
import { useEffect } from "react";
import apiLink from "../../../api/apiLink";
import moment from "moment";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";

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

export default function CustomerEdit({ single }) {
  const { t } = useTranslation();
  const { ispOwnerId } = useISPowner();
  const customer = useSelector((state) => state?.customer?.customer);

  const data = customer.find((item) => item.id === single);

  // const ispOwnerId = useSelector(
  //   (state) => state.persistedReducer.auth?.userData?.ispOwner
  // );

  const role = useSelector((state) => state.persistedReducer.auth?.role);

  const resellerId = useSelector((state) =>
    role === "reseller"
      ? state.persistedReducer.auth?.userData?.id
      : state.persistedReducer.auth?.userData?.reseller
  );

  const permission = useSelector(
    (state) => state.persistedReducer.auth?.userData?.permission
  );

  const collectorPermission = useSelector(
    (state) => state.persistedReducer.auth?.userData?.permissions
  );

  const bpSetting = useSelector(
    (state) =>
      state.persistedReducer.auth?.ispOwnerData?.bpSettings?.hasMikrotik
  );
  // get mikrotik package from redux
  const withOutMtkPackage = useSelector(
    (state) => state?.mikrotik?.pppoePackage
  );

  // get area from redux
  const area = useSelector((state) => state?.area?.area);

  // const area = useSelector(
  //   (state) => state.persistedReducer.auth?.userData.areas
  // );
  const Getmikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  const collectorResellerInfo = useSelector(
    (state) => state.resellerProfile.reseller
  );

  const [ppPackage, setppPackage] = useState([]);

  const [packageRate, setPackageRate] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [mikrotikPackage, setMikrotikPackage] = useState(data?.mikrotikPackage);
  const [autoDisable, setAutoDisable] = useState(data?.autoDisable);
  const [subArea, setSubArea] = useState("");
  const dispatch = useDispatch();
  const [activeStatus, setActiveStatus] = useState(data?.pppoe?.disabled);
  const [mikrotikName, setmikrotikName] = useState("");
  const [areaID, setAreaID] = useState("");
  const [billDate, setBillDate] = useState();
  const [billTime, setBilltime] = useState();
  const [status, setStatus] = useState("");
  // initial package rate
  const [dataPackageRate, setDataPackageRate] = useState();

  const [divisionalArea, setDivisionalArea] = useState({
    division: "",
    district: "",
    thana: "",
  });

  // initial fix package rate
  const [fixPackageRate, setFixPackageRate] = useState();

  useEffect(() => {
    setAreaID(data?.subArea);
    setStatus(data?.status);
    setAutoDisable(data?.autoDisable);
    setDataPackageRate(data?.mikrotikPackage);
    setSubArea(data?.subArea);

    if (data) setBillDate(new Date(data?.billingCycle));

    // setBilltime(moment(data?.billingCycle).format("HH:mm"));
    const temp = Getmikrotik?.find((val) => val.id === data?.mikrotik);
    setmikrotikName(temp);
    if (!bpSetting) {
      setppPackage(withOutMtkPackage);
    }
    const IDs = {
      ispOwner: ispOwnerId,
      mikrotikId: data?.mikrotik,
    };
    const fetchPac = async () => {
      try {
        const res = await apiLink.get(
          `/mikrotik/ppp/package/${IDs.mikrotikId}`
        );
        setppPackage(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    data?.mikrotik && fetchPac();
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

  // useEffect(() => {
  //   const IDs = {
  //     ispOwner: ispOwnerId,
  //     mikrotikId: data?.mikrotik,
  //   };
  //   const fetchPac = async () => {
  //     try {
  //       const res = await apiLink.get(
  //         `/mikrotik/ppp/package/${IDs.mikrotikId}`
  //       );
  //       setppPackage(res.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   data?.mikrotik && fetchPac();
  // }, [ispOwnerId, data]);

  // customer validator
  const customerValidator = Yup.object({
    name: Yup.string().required(t("writeCustomerName")),
    mobile: Yup.string()
      // .matches(/^(01){1}[3456789]{1}(\d){8}$/, "মোবাইল নম্বর সঠিক নয়")
      .min(11, t("write11DigitMobileNumber"))
      .max(11, t("over11DigitMobileNumber")),
    address: Yup.string(),
    email: Yup.string().email(t("incorrectEmail")),
    nid: Yup.string(),
    monthlyFee: Yup.string().required(t("writeMonthFee")),
    Pname: Yup.string().required(t("writePPPoEName")),
    Ppassword: Yup.string().required(t("writePPPoEPassword")),
    Pcomment: Yup.string(),
    customerBillingType: Yup.string().required(t("select billing type")),
  });

  // select Mikrotik Package
  const selectMikrotikPackage = (e) => {
    const mikrotikPackageId = e.target.value;
    setMikrotikPackage(mikrotikPackageId);
    const temp = ppPackage.find((val) => val.id === mikrotikPackageId);
    setPackageRate(temp);
  };
  useEffect(() => {
    //todo
    const mikrotikPackageId = data?.mikrotikPackage;
    setMikrotikPackage(mikrotikPackageId);
    const temp = ppPackage.find((val) => val.id === mikrotikPackageId);
    setPackageRate(temp);
  }, [data, ppPackage]);

  // select subArea
  const selectSubArea = (data) => {
    setSubArea(data.target.value);
    setAreaID(data.target.value);
    // setAreaID(single?.subArea);
  };

  // find profile package
  const findPackage = ppPackage.find((item) => item.id === dataPackageRate);

  // set package rate in state
  useEffect(() => {
    setFixPackageRate(findPackage?.rate);
  }, [findPackage?.rate]);

  // sending data to backed
  const customerHandler = async (formValue) => {
    const { Pname, Ppassword, Pprofile, Pcomment, monthlyFee, ...rest } =
      formValue;
    if (
      mikrotikPackage === data?.mikrotikPackage &&
      data?.monthlyFee === monthlyFee
    ) {
      //
    } else if (Number(monthlyFee) < Number(packageRate.rate)) {
      return alert(t("billCannotBeReduced"));
    }

    if (
      (role === "reseller" && permission.addCustomerWithMobile) ||
      (role === "collector" &&
        collectorResellerInfo.permission?.addCustomerWithMobile)
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
      mikrotikPackage: packageRate?.id,
      monthlyFee,
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
    if (data?.monthlyFee < packageRate?.rate) {
      const result = packageRate?.rate - data?.monthlyFee;
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

    editCustomer(dispatch, mainData, setIsloading);
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
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="customerEditModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {data?.name} - {t("editProfile")}
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
                  name: data?.name || "",
                  mobile: data?.mobile || "",
                  address: data?.address || "",
                  email: data?.email || "",
                  nid: data?.nid || "",
                  Pcomment: data?.pppoe?.comment || "",
                  monthlyFee:
                    mikrotikPackage === data?.mikrotikPackage
                      ? data?.monthlyFee
                      : packageRate?.rate,
                  Pname: data?.pppoe?.name || "",
                  Pprofile: packageRate?.name || data?.pppoe?.profile || "",
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
                    <div className="mikrotikSection">
                      {Getmikrotik.length > 0 && (
                        <div>
                          <label className="form-control-label changeLabelFontColor">
                            {t("selectMikrotik")}{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-select mw-100 mt-0"
                            aria-label="Default select example"
                            // onChange={selectMikrotik}
                            disabled
                            value={data?.mikrotik || ""}
                          >
                            <option value={mikrotikName?.id || ""}>
                              {mikrotikName?.name || ""}
                            </option>
                          </select>
                        </div>
                      )}
                      {/* pppoe package */}
                      <div>
                        <label className="form-control-label changeLabelFontColor">
                          {t("selectPackage")}{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select mb-3 mw-100 mt-0"
                          aria-label="Default select example"
                          onChange={selectMikrotikPackage}
                          value={mikrotikPackage}
                          disabled={!permission?.customerMikrotikPackageEdit}
                        >
                          {ppPackage &&
                            ppPackage?.map((val, key) => (
                              <option
                                selected={val.id === packageRate?.id}
                                disabled={val.rate < findPackage?.rate}
                                key={key}
                                value={val.id || ""}
                              >
                                {val.name}
                              </option>
                            ))}
                        </select>
                      </div>

                      <FtextField
                        type="text"
                        label={t("monthFee")}
                        name="monthlyFee"
                        min={packageRate?.rate || data?.monthlyFee}
                        disabled={!permission?.monthlyFeeEdit}
                        validation={"true"}
                      />
                    </div>

                    <div className="pppoeSection2">
                      {/* PPPoE Name start */}
                      {role === "collector" ? (
                        <FtextField
                          type="text"
                          label={t("PPPoEName")}
                          name="Pname"
                          validation={"true"}
                          disabled
                        />
                      ) : (
                        <FtextField
                          type="text"
                          label={t("PPPoEName")}
                          name="Pname"
                          validation={"true"}
                        />
                      )}
                      {/* PPPoE Name End */}

                      {/* Password Start */}

                      {role === "collector" ? (
                        <FtextField
                          type="text"
                          label={t("password")}
                          name="Ppassword"
                          disabled
                          validation={"true"}
                        />
                      ) : (
                        <FtextField
                          type="text"
                          label={t("password")}
                          name="Ppassword"
                          validation={"true"}
                        />
                      )}
                      {/* Password end */}

                      {/* Comment start */}
                      {role === "collector" ? (
                        <FtextField
                          type="text"
                          label={t("comment")}
                          name="Pcomment"
                          disabled
                        />
                      ) : (
                        <FtextField
                          type="text"
                          label={t("comment")}
                          name="Pcomment"
                        />
                      )}
                      {/* Comment start */}
                    </div>

                    <div className="displayGrid3">
                      <div>
                        <label className="form-control-label changeLabelFontColor">
                          {t("selectArea")}{" "}
                          <span className="text-danger">*</span>
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

                      <FtextField type="text" label={t("NIDno")} name="nid" />
                      <FtextField
                        type="text"
                        label={t("name")}
                        name="name"
                        validation={"true"}
                      />
                    </div>

                    <div className="displayGrid3">
                      <FtextField
                        disabled={
                          !collectorPermission?.customerMobileEdit &&
                          role === "collector"
                        }
                        validation={
                          permission?.addCustomerWithMobile ||
                          collectorResellerInfo.permission
                            ?.addCustomerWithMobile
                        }
                        type="text"
                        label={t("mobile")}
                        name="mobile"
                      />
                      <FtextField
                        type="text"
                        label={t("address")}
                        name="address"
                      />
                      <FtextField type="text" label={t("email")} name="email" />
                    </div>
                    <div className="displayGrid3">
                      {divisionalAreaFormData.map((item) => (
                        <div className="mb-2">
                          <label className="form-control-label changeLabelFontColor">
                            {item.text}
                          </label>
                          <select
                            className="form-select mw-100 mt-0"
                            aria-label="Default select example"
                            name={item.name}
                            id={item.id}
                            disabled={!mikrotikPackage}
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
                    </div>

                    <div className="newDisplay">
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
                      {status !== "expired" && (
                        <>
                          <div className="billCycle">
                            <p className="customerFieldsTitle">
                              {t("billingCycle")}
                            </p>

                            {role === "collector" ? (
                              <div className="timeDate">
                                <DatePicker
                                  className="form-control mw-100"
                                  selected={billDate}
                                  onChange={(data) => setBillDate(data)}
                                  showTimeSelect
                                  dateFormat="dd/MM/yyyy:hh:mm"
                                  minDate={new Date()}
                                  disabled={
                                    permission?.billingCycleEdit === false
                                  }
                                />
                                {/* <input
                                  value={billDate}
                                  onChange={(e) => setBillDate(e.target.value)}
                                  type="date"
                                  min={moment().format("YYYY-MM-DD")}
                                  disabled
                                />
                                <input
                                  className="billTime"
                                  value={billTime}
                                  onChange={(e) => setBilltime(e.target.value)}
                                  type="time"
                                  disabled
                                /> */}
                              </div>
                            ) : (
                              <div className="timeDate">
                                <DatePicker
                                  className="form-control mw-100"
                                  selected={billDate}
                                  onChange={(data) => setBillDate(data)}
                                  timeIntervals={60}
                                  showTimeSelect
                                  dateFormat="dd/MM/yyyy:hh:mm"
                                  minDate={new Date()}
                                  disabled={
                                    permission?.billingCycleEdit === false
                                  }
                                />
                                {/* <input
                                  value={billDate}
                                  onChange={(e) => setBillDate(e.target.value)}
                                  type="date"
                                  min={moment().format("YYYY-MM-DD")}
                                  disabled={!permission?.billingCycleEdit}
                                />
                                <input
                                  className="billTime"
                                  value={billTime}
                                  onChange={(e) => setBilltime(e.target.value)}
                                  type="time"
                                  disabled={!permission?.billingCycleEdit}
                                /> */}
                              </div>
                            )}
                          </div>
                        </>
                      )}

                      {Getmikrotik.length > 0 &&
                        (permission?.customerAutomaticConnectionOnOff ||
                          collectorResellerInfo.permission
                            ?.customerAutomaticConnectionOnOff) && (
                          <div className="autoDisable">
                            <label> {t("automaticConnectionOff")} </label>
                            <input
                              type="checkBox"
                              checked={autoDisable}
                              onChange={(e) => setAutoDisable(e.target.checked)}
                              disabled={!permission?.customerAutoDisableEdit}
                            />
                          </div>
                        )}
                      {status !== "expired" && (
                        <div className="pppoeStatus">
                          <p className="p-0 mt-2">{t("status")}</p>
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="staus"
                              value={"active"}
                              id="changeToActive"
                              onChange={(e) => setStatus(e.target.value)}
                              checked={status === "active"}
                              disabled={
                                permission?.customerStatusEdit
                                  ? !permission?.customerStatusEdit
                                  : !collectorPermission?.customerActivate
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor="changeToActive"
                            >
                              {t("active")}
                            </label>
                          </div>
                          {((0 < data?.balance &&
                            !permission.logicalInactive) ||
                            permission.logicalInactive) && (
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                id="inlineRadio2"
                                value={"inactive"}
                                onChange={(e) => setStatus(e.target.value)}
                                checked={status === "inactive"}
                                disabled={
                                  permission?.customerStatusEdit
                                    ? !permission?.customerStatusEdit
                                    : !collectorPermission?.customerDeactivate
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="inlineRadio2"
                              >
                                {t("in active")}
                              </label>
                            </div>
                          )}
                          {data?.status === "expired" && (
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                id="inlineRadio2"
                                disabled
                                checked={status === "expired"}
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
                      )}
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
