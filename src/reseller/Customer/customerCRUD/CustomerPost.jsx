import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import "../../collector/collector.css";
import "../customer.css";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import {
  addCustomer,
  fetchpppoePackage,
} from "../../../features/apiCallReseller";
import moment from "moment";
import { useTranslation } from "react-i18next";
export default function CustomerModal() {
  const { t } = useTranslation();

  const userData = useSelector(
    (state) => state?.persistedReducer?.auth?.userData
  );
  const area = useSelector((state) => state?.persistedReducer?.area?.area);

  const Getmikrotik = useSelector(
    (state) => state?.persistedReducer?.mikrotik?.mikrotik
  );
  const ppPackage = useSelector(
    (state) => state?.persistedReducer?.mikrotik?.pppoePackage
  );
  const [packageRate, setPackageRate] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [singleMikrotik, setSingleMikrotik] = useState("");
  const [mikrotikPackage, setMikrotikPackage] = useState("");
  const [autoDisable, setAutoDisable] = useState(true);
  // const [subArea, setSubArea] = useState("");
  const dispatch = useDispatch();
  const [billDate, setBillDate] = useState();
  const [billTime, setBilltime] = useState();
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
    monthlyFee: Yup.string().required(t("writeMonthFee")),
    Pname: Yup.string().required(t("writePPPoEName")),
    Ppassword: Yup.string().required(t("writePPPoEPassword")),
    Pcomment: Yup.string(),
  });

  // select subArea
  // const selectSubArea = (data) => {
  //   const areaId = data.target.value;
  //   if (area) {
  //     const temp = area.find((val) => {
  //       return val.id === areaId;
  //     });
  //     setSubArea(temp);
  //   }
  // };

  // const [loadingPac, setLoadingPac] = useState(false);
  // select Getmikrotik
  const selectMikrotik = (e) => {
    const id = e.target.value;
    if (id && userData.id) {
      const IDs = {
        reseller: userData.id,
        mikrotikId: id,
      };
      fetchpppoePackage(dispatch, IDs);
    }
    setSingleMikrotik(id);
  };

  // select subArea
  // const selectSubArea = (data) => {
  //   const areaId = data.target.value;
  //   if (area) {
  //     const temp = area.find((val) => {
  //       return val.id === areaId;
  //     });
  //     setSubArea(temp);
  //   }
  // };

  // select Mikrotik Package
  const selectMikrotikPackage = (e) => {
    const mikrotikPackageId = e.target.value;
    setMikrotikPackage(mikrotikPackageId);
    const temp = ppPackage.find((val) => val.id === mikrotikPackageId);
    setPackageRate(temp);
  };
  const [subAreaId, setsubAreaId] = useState("");
  // sending data to backed
  const customerHandler = async (data, resetForm) => {
    const { Pname, Ppassword, Pprofile, Pcomment, ...rest } = data;
    const mainData = {
      // customerId: "randon123",
      paymentStatus: "unpaid",
      ispOwner: userData.ispOwner,
      subArea: subAreaId,
      reseller: userData.id,
      mikrotik: singleMikrotik,
      mikrotikPackage: mikrotikPackage,
      billPayType: "prepaid",
      autoDisable: autoDisable,
      billingCycle: moment(billDate + " " + billTime).format(
        "YYYY-MM-DDTHH:mm:ss.ms[Z]"
      ),
      pppoe: {
        name: Pname,
        password: Ppassword,
        service: "pppoe",
        comment: Pcomment,
        profile: Pprofile,
      },
      ...rest,
    };
    // console.log(mainData);
    addCustomer(dispatch, mainData, setIsloading, resetForm);
  };

  useEffect(() => {
    setBillDate(moment().endOf("day").format("YYYY-MM-DD"));
    setBilltime(moment().endOf("day").format("HH:mm"));
  }, []);
  const selectArea = (e) => {
    setsubAreaId(e);
  };

  const reseller = useSelector(
    (state) => state?.persistedReducer?.auth?.userData
  );

  const userRole = useSelector((state) => state?.persistedReducer?.auth?.role);

  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="customerModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {t("addNewCustomer")}
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
                }}
                validationSchema={customerValidator}
                onSubmit={(values, { resetForm }) => {
                  customerHandler(values, resetForm);
                }}
                enableReinitialize
              >
                {(formik) => (
                  <Form>
                    <div className="mikrotikSection">
                      {/* pppoe package */}
                      {(userRole === "ispOwner" ||
                        userRole === "collector" ||
                        userRole === "manager") && (
                        <>
                          <p className="comstomerFieldsTitle">
                            মাইক্রোটিক সিলেক্ট করুন
                          </p>
                          <select
                            className="form-select"
                            aria-label="Default select example"
                            onChange={selectMikrotik}
                          >
                            <option value="">...</option>
                            {Getmikrotik?.length === undefined
                              ? ""
                              : Getmikrotik?.map((val, key) => (
                                  <option key={key} value={val.id}>
                                    {val.name}
                                  </option>
                                ))}
                          </select>

                          <p className="comstomerFieldsTitle">
                            PPPoE প্যাকেজ সিলেক্ট করুন
                          </p>
                          <select
                            className="form-select mb-3"
                            aria-label="Default select example"
                            onChange={selectMikrotikPackage}
                          >
                            <option value="">...</option>
                            {ppPackage.length === undefined
                              ? ""
                              : ppPackage?.map((val, key) => (
                                  <option key={key} value={val.id}>
                                    {val.name}
                                  </option>
                                ))}
                          </select>
                        </>
                      )}

                      {userRole === "reseller" && (
                        <>
                          <div>
                            <p className="comstomerFieldsTitle">
                              {t("selectMikrotik")}
                            </p>
                            <select
                              className="form-select"
                              aria-label="Default select example"
                              onChange={selectMikrotik}
                            >
                              <option value="">...</option>
                              {Getmikrotik?.length === undefined
                                ? ""
                                : Getmikrotik?.map((val, key) =>
                                    reseller.mikrotiks.map(
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
                          <div>
                            <p className="comstomerFieldsTitle">
                              {t("selectPPPoEPackage")}
                            </p>
                            <select
                              className="form-select mb-3"
                              aria-label="Default select example"
                              onChange={selectMikrotikPackage}
                            >
                              <option value="">...</option>
                              {ppPackage.length === undefined
                                ? ""
                                : ppPackage?.map((val, key) =>
                                    reseller.mikrotikPackages.map(
                                      (p) =>
                                        p === val.id && (
                                          <option key={key} value={val.id}>
                                            {val.name}
                                          </option>
                                        )
                                    )
                                  )}
                            </select>
                          </div>
                        </>
                      )}

                      <FtextField
                        type="text"
                        label={t("monthFee")}
                        name="monthlyFee"
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
                          onChange={(e) => selectArea(e.target.value)}
                        >
                          <option value="">...</option>
                          {area?.length === undefined
                            ? ""
                            : area?.map((val, key) => (
                                <option key={key} value={val.id}>
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
                          />
                          <input
                            className="billTime"
                            value={billTime}
                            onChange={(e) => setBilltime(e.target.value)}
                            type="time"
                          />
                        </div>
                      </div>
                      <div className="displayGrid3">
                        <div className="autoDisable">
                          <label> {t("automaticConnectionOff")} </label>
                          <input
                            type="checkBox"
                            checked={autoDisable}
                            onChange={(e) => setAutoDisable(e.target.checked)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="modal-footer" style={{ border: "none" }}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        disabled={isLoading}
                      >
                        {t("cancle")}
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
