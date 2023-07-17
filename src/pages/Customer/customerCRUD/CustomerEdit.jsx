import { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import "../../collector/collector.css";
import "../customer.css";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import {
  editCustomer,
  fetchMikrotik,
  fetchPackagefromDatabase,
} from "../../../features/apiCalls";
import { useEffect } from "react";
import DatePicker from "react-datepicker";
import { useTranslation } from "react-i18next";

//divisional location
import divisionsJSON from "../../../bdAddress/bd-divisions.json";
import districtsJSON from "../../../bdAddress/bd-districts.json";
import thanaJSON from "../../../bdAddress/bd-upazilas.json";
import getName from "../../../utils/getLocationName";

//custom hook
import useISPowner from "../../../hooks/useISPOwner";
import SelectField from "../../../components/common/SelectField";
import { getPoleBoxApi } from "../../../features/actions/customerApiCall";
import { toast } from "react-toastify";

const divisions = divisionsJSON.divisions;
const districts = districtsJSON.districts;
const thana = thanaJSON.thana;

export default function CustomerEdit(props) {
  const { t } = useTranslation();

  //calling custom hook here
  const { ispOwnerId, hasMikrotik } = useISPowner();

  // get all customer
  const customer = useSelector((state) => state?.customer?.customer);

  // find editable data
  const data = customer.find((item) => item.id === props.single);
  console.log(data);

  // get isp owner id
  // const ispOwnerId = useSelector(
  //   (state) => state.persistedReducer.auth?.ispOwnerId
  // );

  // get all area
  const area = useSelector((state) => state?.area?.area);

  // get all subAreas
  const storeSubArea = useSelector((state) => state.area?.subArea);

  // get mikrotiks
  const mikrotiks = useSelector((state) => state?.mikrotik?.mikrotik);

  // get bp setting
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData?.bpSettings
  );

  // get all role
  const role = useSelector((state) => state.persistedReducer.auth?.role);

  // get user permission
  const permission = useSelector(
    (state) => state.persistedReducer.auth.userData.permissions
  );

  // get pppoe package
  const ppPackage = useSelector((state) =>
    hasMikrotik
      ? state?.mikrotik?.packagefromDatabase
      : state?.package?.packages
  );

  // get subarea poleBox
  const poleBox = useSelector((state) => state.area?.poleBox);

  const [packageRate, setPackageRate] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [isLoadingPole, setIsLoadingPole] = useState(false);
  const [mikrotikPackage, setMikrotikPackage] = useState("");

  const [autoDisable, setAutoDisable] = useState(data?.autoDisable);

  const [subArea, setSubArea] = useState([]);
  const dispatch = useDispatch();

  const [activeStatus, setActiveStatus] = useState(data?.pppoe?.disabled);
  const [mikrotikName, setmikrotikName] = useState("");
  const [areaID, setAreaID] = useState("");
  const [subAreaId, setSubAreaId] = useState("");
  const [connectionDate, setConnectionDate] = useState("");
  const [billDate, setBillDate] = useState();
  const [status, setStatus] = useState("");
  const [promiseDate, setPromiseDate] = useState(null);
  const [subAreasPoleBox, setSubAreasPoleBox] = useState([]);
  const [poleBoxIds, setPoleBoxIds] = useState("");
  const [poleBoxId, setPoleBoxId] = useState("");

  const [packageId, setPackageId] = useState("");
  //component states
  const [_loading, setLoading] = useState(false);

  const [divisionalArea, setDivisionalArea] = useState({
    division: "",
    district: "",
    thana: "",
  });

  //last day of month calculation
  let day = new Date(data?.billingCycle);
  let lastDayOfMonth = new Date(day.getFullYear(), day.getMonth() + 1, 0);

  let initialTime = new Date(data?.billingCycle);
  initialTime.setHours("00");
  initialTime.setMinutes("00");

  //hour and minutes calculation
  let lastTime = new Date(data?.billingCycle);
  lastTime.setHours("18");
  lastTime.setMinutes("00");

  useEffect(() => {
    if (data) setBillDate(new Date(data?.billingCycle));
    if (data) setPromiseDate(new Date(data.promiseDate));
    setAutoDisable(data?.autoDisable);

    setPackageId(data?.mikrotikPackage);
    setStatus(data?.status);
    setConnectionDate(
      data?.connectionDate ? new Date(data?.connectionDate) : null
    );
    const IDs = {
      ispOwner: ispOwnerId,
      mikrotikId: data?.mikrotik,
    };

    if (bpSettings?.hasMikrotik) {
      fetchPackagefromDatabase(dispatch, IDs, setIsloading);
    }
    //select customer district,division and thana for sync with state
    const divisionalInfo = {};
    if (data?.division) {
      const division = divisions.find((item) => item.name === data.division);
      divisionalInfo.division = division.id;
    }
    if (data?.district) {
      const district = districts.find((item) => item.name === data.district);
      divisionalInfo.district = district?.id;
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
  }, [bpSettings, ispOwnerId, data]);

  useEffect(() => {
    const temp = mikrotiks.find((val) => val.id === data?.mikrotik);
    setmikrotikName(temp);
  }, [mikrotiks, data, ispOwnerId]);

  useEffect(() => {
    fetchMikrotik(dispatch, ispOwnerId, setLoading);
  }, [ispOwnerId]);

  useEffect(() => {
    let temp;
    area.map((a) => {
      a.subAreas.map((sub) => {
        if (sub === data?.subArea) {
          setAreaID(a.id);
          temp = a.id;
        }
        return sub;
      });
      return a;
    });
    setSubAreaId(data?.subArea);
    setPoleBoxId(data?.poleBox);
    const initialSubAreas = storeSubArea.filter((val) => val.area === temp);
    setSubArea(initialSubAreas);

    const subPoleBox = poleBox.filter((val) => {
      return val.subArea === data?.subArea;
    });
    setSubAreasPoleBox(subPoleBox);
  }, [area, data, storeSubArea]);

  // get subarea poleBox
  useEffect(() => {
    getPoleBoxApi(dispatch, ispOwnerId, setIsLoadingPole);
  }, []);

  // customer validator
  const customerValidator = Yup.object({
    // customerId: Yup.string().required(t("writeCustomerId")),
    name: Yup.string().required(t("writeCustomerName")),
    mobile: Yup.string()
      // .matches(/^(01){1}[3456789]{1}(\d){8}$/, "মোবাইল নম্বর সঠিক নয়")
      .min(11, t("write11DigitMobileNumber"))
      .max(11, t("over11DigitMobileNumber")),
    address: Yup.string(),
    email: Yup.string().email(t("incorrectEmail")),
    nid: Yup.string(),
    monthlyFee: Yup.number()
      .integer()
      .min(0, t("minimumPackageRate"))
      .required(t("enterPackageRate")),
    Pname: Yup.string().required(t("writePPPoEName")),
    Ppassword: Yup.string().required(t("writePPPoEPassword")),
    Pcomment: Yup.string(),
    customerBillingType: Yup.string().required(t("select billing type")),

    // balance: Yup.number().integer(),
  });

  // select Mikrotik Package
  useEffect(() => {
    const mikrotikPackageId = data?.mikrotikPackage;
    setMikrotikPackage(mikrotikPackageId);
    const temp = ppPackage.find((val) => val.name === mikrotikPackageId);
    setPackageRate(temp);
  }, [data, ppPackage]);

  const selectMikrotikPackage = (e) => {
    const mikrotikPackageId = e.target.value;
    setMikrotikPackage(mikrotikPackageId);
    setPackageId(mikrotikPackageId);
    const temp = ppPackage.find((val) => val.id === mikrotikPackageId);
    setPackageRate(temp);
  };

  // select subArea
  const selectSubArea = (data) => {
    const areaId = data.target.value;

    if (areaId) {
      const temp = storeSubArea.filter((val) => {
        return val.area === areaId;
      });
      setAreaID(areaId);
      setSubArea(temp);
    }
  };

  // sending data to backed
  const customerHandler = async (formValue) => {
    setIsloading(true);
    const subArea2 = document.getElementById("subAreaIdFromEdit").value;
    if (subArea2 === "") {
      setIsloading(false);
      return alert(t("selectSubArea"));
    }

    if (!billDate) {
      setIsloading(false);
      return alert(t("selectBillDate"));
    }

    const {
      customerId,
      Pname,
      Ppassword,
      Pprofile,
      Pcomment,
      customerBillingType,
      ...rest
    } = formValue;
    console.log(customerBillingType);

    if (!bpSettings.genCustomerId) {
      if (customerId === "") {
        setIsloading(false);
        return alert(t("writeCustomerId"));
      }
    }

    if (bpSettings?.addCustomerWithMobile) {
      if (formValue.mobile === "") {
        setIsloading(false);
        return alert(t("writeMobileNumber"));
      }
    }

    if (data?.paymentStatus === "unpaid") {
      if (status === "active" && customerBillingType === "postpaid") {
        setIsloading(false);
        return toast.warn(t("rechargeYourCustomer"));
      }
    }

    const mainData = {
      singleCustomerID: data?.id,
      area: areaID,
      subArea: subArea2,
      poleBox: poleBoxIds,
      ispOwner: ispOwnerId,
      mikrotikPackage: packageId,
      autoDisable: autoDisable,
      connectionDate,
      billingCycle: billDate.toISOString(),
      promiseDate: promiseDate.toISOString(),
      customerBillingType: customerBillingType,
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
    if (
      mainData.balance === "" ||
      mainData.balance === undefined ||
      mainData === null
    ) {
      delete mainData.balance;
    }
    if (!bpSettings.genCustomerId) {
      mainData.customerId = customerId;
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

    if (!poleBoxIds) {
      delete mainData.poleBox;
    }
    editCustomer(dispatch, mainData, setIsloading);
  };
  const selectedSubArea = (e) => {
    var subArea = e.target.value;
    area.map((a) => {
      a.subAreas.map((sub) => {
        if (sub === subArea) {
          setAreaID(a.id);
          setSubAreaId(subArea);
        }
        return sub;
      });
      return a;
    });

    // subArea poleBox
    const subAreaPoleBox = poleBox.filter((val) => {
      return val.subArea === subArea;
    });
    setSubAreasPoleBox(subAreaPoleBox);
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
                {data?.name} {t("editProfile")}
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
                  customerId: data?.customerId,
                  name: data?.name || "",
                  mobile: data?.mobile || "",
                  address: data?.address || "",
                  email: data?.email || "",
                  nid: data?.nid || "",
                  Pcomment: data?.pppoe?.comment || "",
                  monthlyFee: packageRate?.rate || data?.monthlyFee || 0,
                  Pname: data?.pppoe?.name || "",
                  Pprofile: packageRate?.name || data?.pppoe?.profile || "",
                  Ppassword: data?.pppoe?.password || "",
                  status: status || "",
                  balance: data?.balance || "",
                  customerBillingType: data?.customerBillingType || "",
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
                      {bpSettings?.hasMikrotik ? (
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
                      ) : (
                        ""
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
                          disabled={role === "collector"}
                        >
                          {ppPackage?.map((val, key) => (
                            <option
                              selected={data?.mikrotikPackage === val?.id}
                              key={key}
                              value={val.id}
                            >
                              {val.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <FtextField
                        type="number"
                        min={0}
                        label={t("monthFee")}
                        name="monthlyFee"
                        validation={"true"}
                      />

                      {!bpSettings?.hasMikrotik && (
                        <FtextField
                          type="number"
                          label={t("balance")}
                          name="balance"
                        />
                      )}
                    </div>

                    <div className="pppoeSection2">
                      {!bpSettings.genCustomerId && (
                        <FtextField
                          type="text"
                          label="Customer Id"
                          name="customerId"
                          validation={!bpSettings.genCustomerId}
                        />
                      )}
                      <FtextField
                        type="text"
                        label={`PPPoE ${t("name")}`}
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
                          {area.length === undefined
                            ? ""
                            : area.map((val, key) => (
                                <option
                                  selected={areaID === val.id}
                                  key={key}
                                  value={val.id || ""}
                                >
                                  {val.name}
                                </option>
                              ))}
                        </select>
                      </div>

                      <div>
                        <label className="form-control-label changeLabelFontColor">
                          {t("selectSubArea")}
                          <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select mw-100 mt-0"
                          aria-label="Default select example"
                          name="subArea"
                          id="subAreaIdFromEdit"
                          onChange={selectedSubArea}
                        >
                          <option value="">Select Sub Area</option>
                          {subArea?.map((val, key) => (
                            <option
                              selected={val?.id === subAreaId}
                              key={key}
                              value={val?.id || ""}
                            >
                              {val?.name}
                            </option>
                          ))}
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
                            onChange={(e) => setPoleBoxIds(e.target.value)}
                          >
                            <option value="">...</option>
                            {subAreasPoleBox
                              ? subAreasPoleBox?.map((val, key) => (
                                  <option
                                    key={key}
                                    value={val?.id}
                                    selected={val.id === poleBoxId}
                                  >
                                    {val.name}
                                  </option>
                                ))
                              : ""}
                          </select>
                        </div>
                      )}
                    </div>

                    <div className="displayGrid3 mt-3">
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
                        name="mobile"
                        validation={bpSettings?.addCustomerWithMobile}
                        disabled={
                          !permission?.customerMobileEdit &&
                          role === "collector"
                        }
                      />
                    </div>

                    <div className="displayGrid3">
                      {divisionalAreaFormData.map((item) => (
                        <div className="mb-2">
                          <label className="form-control-label changeLabelFontColor">
                            {item.text}
                            <span className="text-danger">*</span>
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
                      <FtextField
                        type="text"
                        label={t("address")}
                        name="address"
                      />
                      <FtextField type="text" label={t("email")} name="email" />

                      <div className="billCycle">
                        <label className="form-control-label changeLabelFontColor">
                          {t("billingCycle")}
                          <span className="text-danger">*</span>
                        </label>

                        <div className="timeDate">
                          <DatePicker
                            className="form-control mw-100"
                            selected={billDate}
                            onChange={(date) => setBillDate(date)}
                            dateFormat="MMM dd yyyy hh:mm a"
                            showTimeSelect
                          />
                        </div>
                      </div>
                    </div>
                    <div className="newDisplay">
                      {bpSettings.promiseDate &&
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
                              timeIntervals={60}
                              minDate={new Date(data?.billingCycle)}
                              maxDate={lastDayOfMonth}
                              minTime={initialTime}
                              maxTime={lastTime}
                              showTimeSelect
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
                          dateFormat="dd/MM/yyyy"
                          placeholderText={t("selectDate")}
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
                      <div className="pppoeStatus">
                        <p className="p-0 mt-2">{t("status")}</p>
                        <div className="form-check form-check-inline mt-0">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="staus"
                            value={"active"}
                            disabled={
                              !permission?.customerActivate &&
                              role !== "ispOwner"
                            }
                            onChange={(e) => setStatus(e.target.value)}
                            checked={status === "active"}
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
                              !permission?.customerDeactivate &&
                              role !== "ispOwner"
                            }
                            onChange={(e) => setStatus(e.target.value)}
                            checked={status === "inactive"}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="inlineRadio2"
                          >
                            {t("in active")}
                          </label>
                        </div>
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
