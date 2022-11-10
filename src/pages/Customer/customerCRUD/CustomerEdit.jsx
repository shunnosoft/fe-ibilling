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
  fetchPackagefromDatabase,
} from "../../../features/apiCalls";
import { useEffect } from "react";
import DatePicker from "react-datepicker";
import { useTranslation } from "react-i18next";

export default function CustomerEdit(props) {
  const { t } = useTranslation();
  // get all customer
  const customer = useSelector((state) => state?.customer?.customer);

  // find editable data
  const data = customer.find((item) => item.id === props.single);

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // get all area
  const area = useSelector((state) => state?.area?.area);

  // get mikrotik
  const Getmikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  // get bp setting
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.userData?.bpSettings
  );

  // get all role
  const role = useSelector((state) => state.persistedReducer.auth?.role);

  // get user permission
  const permission = useSelector(
    (state) => state.persistedReducer.auth.userData.permissions
  );

  // get ppoe package
  const ppPackage = useSelector((state) =>
    bpSettings?.hasMikrotik
      ? state?.mikrotik?.packagefromDatabase
      : state?.package?.packages
  );

  const [packageRate, setPackageRate] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [mikrotikPackage, setMikrotikPackage] = useState("");

  const [autoDisable, setAutoDisable] = useState(data?.autoDisable);

  const [subArea, setSubArea] = useState([]);
  const dispatch = useDispatch();

  const [activeStatus, setActiveStatus] = useState(data?.pppoe?.disabled);
  const [mikrotikName, setmikrotikName] = useState("");
  const [areaID, setAreaID] = useState("");
  const [subAreaId, setSubAreaId] = useState({});
  const [connectionDate, setConnectionDate] = useState("");
  const [billDate, setBillDate] = useState();
  const [status, setStatus] = useState("");
  const [promiseDate, setPromiseDate] = useState(null);

  const [packageId, setPackageId] = useState("");

  // fix max promise date
  let mxDate = new Date(data?.billingCycle);
  mxDate.setDate(mxDate.getDate() + parseInt(20));

  useEffect(() => {
    setPackageId(data?.mikrotikPackage);
    setStatus(data?.status);
    const IDs = {
      ispOwner: ispOwnerId,
      mikrotikId: data?.mikrotik,
    };

    if (bpSettings?.hasMikrotik) {
      fetchPackagefromDatabase(dispatch, IDs, setIsloading);
    }
  }, [bpSettings, ispOwnerId, dispatch, data]);

  useEffect(() => {
    setAutoDisable(data?.autoDisable);
    setConnectionDate(
      data?.connectionDate ? new Date(data?.connectionDate) : null
    );
    const temp = Getmikrotik.find((val) => val.id === data?.mikrotik);
    setmikrotikName(temp);
    if (data) setBillDate(new Date(data?.billingCycle));
    if (data) setPromiseDate(new Date(data.promiseDate));
    // findout area id by sub area id
  }, [Getmikrotik, area, data, dispatch, ispOwnerId, ppPackage]);

  useEffect(() => {
    area.map((a) => {
      a.subAreas.map((sub) => {
        if (sub.id === data?.subArea) {
          setAreaID(a);
          setSubAreaId(sub);
          setSubArea(a.subAreas);
        }
        return sub;
      });
      return a;
    });
  }, [area, data]);

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
    monthlyFee: Yup.number()
      .integer()
      .min(0, t("minimumPackageRate"))
      .required(t("enterPackageRate")),
    Pname: Yup.string().required(t("writePPPoEName")),
    Ppassword: Yup.string().required(t("writePPPoEPassword")),
    Pcomment: Yup.string(),
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

    const temp = area.find((val) => {
      return val.id === areaId;
    });
    setAreaID(temp);
    setSubArea(temp.subAreas);
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

    const { Pname, Ppassword, Pprofile, Pcomment, ...rest } = formValue;
    const mainData = {
      singleCustomerID: data?.id,
      subArea: subArea2,
      ispOwner: ispOwnerId,
      mikrotikPackage: packageId,
      autoDisable: autoDisable,
      connectionDate,
      billingCycle: billDate.toISOString(),
      promiseDate: promiseDate.toISOString(),
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
    editCustomer(dispatch, mainData, setIsloading);
  };
  const selectedSubArea = (e) => {
    var subArea = e.target.value;
    area.map((a) => {
      a.subAreas.map((sub) => {
        if (sub.id === subArea) {
          setAreaID(a);
          setSubAreaId(sub);
          setSubArea(a.subAreas);
        }
        return sub;
      });
      return a;
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

                      {bpSettings?.hasMikrotik ? (
                        ""
                      ) : (
                        <FtextField
                          type="number"
                          label={t("balance")}
                          name="balance"
                        />
                      )}
                    </div>

                    <div className="pppoeSection2">
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
                                  selected={areaID?.id === val.id}
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
                          {subArea?.map((val, key) => (
                            <option
                              selected={val?.id === subAreaId?.id}
                              key={key}
                              value={val?.id || ""}
                            >
                              {val?.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <FtextField type="text" label={t("NIDno")} name="nid" />
                    </div>

                    <div className="displayGrid3">
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
                        disabled={
                          !permission?.customerMobileEdit &&
                          role === "collector"
                        }
                      />
                      <FtextField
                        type="text"
                        label={t("address")}
                        name="address"
                      />
                    </div>
                    <div className="newDisplay">
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
                      {(role === "manager" || role === "ispOwner") && (
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
                            minDate={new Date(data?.billingCycle)}
                            maxDate={mxDate}
                            showTimeSelect
                          />
                        </div>
                      )}
                    </div>
                    <div className="newDisplay">
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
