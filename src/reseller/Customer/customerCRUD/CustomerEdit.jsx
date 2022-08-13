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
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
export default function CustomerEdit({ single }) {
  const { t } = useTranslation();

  const customer = useSelector((state) => state?.customer?.customer);

  const data = customer.find((item) => item.id === single);

  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.userData?.ispOwner
  );
  const resellerId = useSelector(
    (state) => state.persistedReducer.auth?.userData?.id
  );
  const area = useSelector((state) => state?.area?.area);
  const Getmikrotik = useSelector((state) => state?.mikrotik?.mikrotik);
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

  // initial fix package rate
  const [fixPackageRate, setFixPackageRate] = useState();

  useEffect(() => {
    setAreaID(data?.subArea);
    setStatus(data?.status);
    setAutoDisable(data?.autoDisable);
    setDataPackageRate(data?.mikrotikPackage);

    setSubArea(data?.subArea);
    setBillDate(moment(data?.billingCycle).format("YYYY-MM-DD"));
    setBilltime(moment(data?.billingCycle).format("HH:mm"));
    const temp = Getmikrotik?.find((val) => val.id === data?.mikrotik);
    setmikrotikName(temp);
  }, [Getmikrotik, area, data, dispatch, ispOwnerId, ppPackage]);

  useEffect(() => {
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
  }, [ispOwnerId, data]);

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
    if (Number(monthlyFee) < Number(packageRate.rate)) {
      return alert(t("billCannotBeReduced"));
    }
    const mainData = {
      singleCustomerID: data?.id,
      subArea: subArea,
      ispOwner: ispOwnerId,
      mikrotik: data?.mikrotik,
      mikrotikPackage: packageRate?.id,
      // billPayType: "prepaid",
      autoDisable: autoDisable,
      reseller: resellerId,
      billingCycle: moment(billDate + " " + billTime).format(
        "YYYY-MM-DDTHH:mm:ss.ms[Z]"
      ),
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
    editCustomer(dispatch, mainData, setIsloading);
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
                  monthlyFee: packageRate?.rate || data?.monthlyFee || "",
                  Pname: data?.pppoe?.name || "",
                  Pprofile: packageRate?.name || data?.pppoe?.profile || "",
                  Ppassword: data?.pppoe?.password || "",
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
                      <div>
                        <p className="comstomerFieldsTitle">
                          {t("selectMikrotik")}
                        </p>
                        <select
                          className="form-select"
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

                      {/* pppoe package */}
                      <div>
                        <p className="comstomerFieldsTitle">
                          {t("selectPackage")}
                        </p>
                        <select
                          className="form-select mb-3"
                          aria-label="Default select example"
                          onChange={selectMikrotikPackage}
                          value={mikrotikPackage}
                        >
                          {ppPackage &&
                            ppPackage?.map(
                              (val, key) => (
                                // getPackageByte(val.name) && (
                                <option
                                  selected={val.id === packageRate?.id}
                                  disabled={val.rate <= findPackage?.rate}
                                  key={key}
                                  value={val.id || ""}
                                >
                                  {val.name}
                                </option>
                              )
                              // )
                            )}
                        </select>
                      </div>
                      <FtextField
                        type="text"
                        label={t("monthFee")}
                        name="monthlyFee"
                        min={packageRate?.rate || data?.monthlyFee}
                      />
                    </div>

                    <div className="pppoeSection2">
                      <FtextField
                        type="text"
                        label={t("PPPoEName")}
                        name="Pname"
                      />
                      <FtextField
                        type="text"
                        label={t("password")}
                        name="Ppassword"
                      />
                      <FtextField
                        type="text"
                        label={t("comment")}
                        name="Pcomment"
                      />
                    </div>

                    <div className="displayGrid3">
                      <div>
                        <p> {t("selectArea")} </p>
                        <select
                          className="form-select"
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
                    </div>

                    <div className="displayGrid3">
                      <FtextField type="text" label={t("name")} name="name" />
                      <FtextField
                        type="text"
                        label={t("mobile")}
                        name="mobile"
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
                        <p className="customerFieldsTitle">
                          {t("billingCycle")}
                        </p>

                        <div className="timeDate">
                          <input
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
                          />
                        </div>
                      </div>
                      <div className="autoDisable">
                        <label> {t("automaticConnectionOff")} </label>
                        <input
                          type="checkBox"
                          checked={autoDisable}
                          onChange={(e) => setAutoDisable(e.target.checked)}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="pppoeStatus">
                      <p> {t("status")} </p>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="staus"
                          value={"active"}
                          onChange={(e) => setStatus(e.target.value)}
                          checked={status === "active"}
                          disabled
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
