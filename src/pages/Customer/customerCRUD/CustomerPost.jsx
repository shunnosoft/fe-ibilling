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
  fetchPackagefromDatabase,
} from "../../../features/apiCalls";
import moment from "moment";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
export default function CustomerModal() {
  const { t } = useTranslation();

  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData?.bpSettings
  );

  const userRole = useSelector((state) => state.persistedReducer.auth?.role);
  // const packages= useSelector(state=>state.package.packages)
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );
  const area = useSelector((state) => state?.area?.area);
  const Getmikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  const ppPackage = useSelector((state) =>
    bpSettings?.hasMikrotik
      ? state?.mikrotik?.packagefromDatabase
      : state?.package?.packages
  );

  const [packageRate, setPackageRate] = useState({ rate: 0 });
  const [isLoading, setIsloading] = useState(false);
  const [singleMikrotik, setSingleMikrotik] = useState("");
  const [mikrotikPackage, setMikrotikPackage] = useState("");
  const [autoDisable, setAutoDisable] = useState(true);
  const [subArea, setSubArea] = useState("");
  const dispatch = useDispatch();

  const [billDate, setBillDate] = useState(new Date());
  const [connectionDate, setConnectionDate] = useState();

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
    monthlyFee: Yup.number()
      .integer()
      .min(0, t("minimumPackageRate"))
      .required(t("enterPackageRate")),
    Pname: Yup.string().required(t("writePPPoEName")),
    Ppassword: Yup.string().required(t("writePPPoEPassword")),
    Pcomment: Yup.string(),
    // balance: Yup.number().integer().required("পূর্বের ব্যালান্স দিন"),
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
    const areaId = data.target.value;
    if (area) {
      const temp = area.find((val) => {
        return val.id === areaId;
      });
      setSubArea(temp);
    }
  };

  // select Mikrotik Package
  const selectMikrotikPackage = (e) => {
    const mikrotikPackageId = e.target.value;

    if (mikrotikPackageId === "0") {
      setPackageRate({ rate: 0 });
      setMikrotikPackage("");
    } else {
      setMikrotikPackage(mikrotikPackageId);
      const temp = ppPackage.find((val) => val.id === mikrotikPackageId);
      setPackageRate(temp);
    }
  };

  // sending data to backed
  const customerHandler = async (data, resetForm) => {
    const subArea2 = document.getElementById("subAreaId").value;
    if (subArea2 === "") {
      setIsloading(false);
      return alert(t("selectSubArea"));
    }

    if (!billDate) {
      setIsloading(false);
      return alert(t("selectBillDate"));
    }

    const { Pname, Ppassword, Pprofile, Pcomment, balance, ...rest } = data;
    const mainData = {
      // customerId: "randon123",
      paymentStatus: "unpaid",
      subArea: subArea2,
      ispOwner: ispOwnerId,
      mikrotik: singleMikrotik,
      mikrotikPackage: mikrotikPackage,
      billPayType: "prepaid",
      autoDisable: autoDisable,
      connectionDate: connectionDate?.toISOString(),
      billingCycle: billDate?.toISOString(),
      pppoe: {
        name: Pname,
        password: Ppassword,
        service: "pppoe",
        comment: Pcomment,
        profile: Pprofile,
      },
      balance: -balance,
      ...rest,
    };
    if (!bpSettings?.hasMikrotik) {
      delete mainData.mikrotik;
    }
    addCustomer(dispatch, mainData, setIsloading, resetForm);
  };

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
            <div className="modal-body p-3">
              {/* model body here */}
              <Formik
                initialValues={{
                  name: "",
                  mobile: "",
                  address: "",
                  email: "",
                  nid: "",
                  monthlyFee: packageRate?.rate || 0,
                  Pname: "",
                  Pprofile: packageRate?.name || "",
                  Ppassword: "",
                  Pcomment: "",
                  balance: "",
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
                      {bpSettings?.hasMikrotik ? (
                        <div>
                          <label className="form-control-label changeLabelFontColor">
                            {t("selectMikrotik")}{" "}
                            <span className="text-danger">*</span>
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
                      <FtextField
                        type="number"
                        label={t("monthFee")}
                        name="monthlyFee"
                        min={0}
                        disabled={!(mikrotikPackage && userRole === "ispOwner")}
                        validation={"true"}
                        // value={packageRate?.rate}
                        // onChange={(e)=>{
                        //   setPackageRate((preval)=>{
                        //     return {
                        //       ...preval,rate:e.target.value
                        //     }
                        //   })
                        // }}
                      />
                      {bpSettings?.hasMikrotik ? (
                        ""
                      ) : (
                        <FtextField
                          type="number"
                          label={t("prevDue")}
                          name="balance"
                        />
                      )}
                    </div>

                    <div className="pppoeSection2">
                      <FtextField
                        type="text"
                        label={t("PPPoEName")}
                        name="Pname"
                        disabled={!mikrotikPackage}
                        validation={"true"}
                      />
                      <FtextField
                        type="text"
                        label={t("password")}
                        name="Ppassword"
                        disabled={!mikrotikPackage}
                        validation={"true"}
                      />
                      <FtextField
                        type="text"
                        label={t("comment")}
                        name="Pcomment"
                        disabled={!mikrotikPackage}
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
                          disabled={!mikrotikPackage}
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
                          {subArea ? subArea.name + " এর - " : ""}{" "}
                          {t("selectSubArea")}{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select mw-100 mt-0"
                          aria-label="Default select example"
                          name="subArea"
                          id="subAreaId"
                          disabled={!mikrotikPackage}
                        >
                          <option value="">...</option>
                          {subArea?.subAreas
                            ? subArea.subAreas.map((val, key) => (
                                <option key={key} value={val.id}>
                                  {val.name}
                                </option>
                              ))
                            : ""}
                        </select>
                      </div>

                      <FtextField
                        type="text"
                        label={t("NIDno")}
                        name="nid"
                        disabled={!mikrotikPackage}
                      />
                    </div>

                    <div className="displayGrid3">
                      <FtextField
                        type="text"
                        label={t("name")}
                        name="name"
                        disabled={!mikrotikPackage}
                        validation={"true"}
                      />
                      <FtextField
                        type="text"
                        label={t("mobile")}
                        name="mobile"
                        disabled={!mikrotikPackage}
                        validation={"true"}
                      />
                      <FtextField
                        type="text"
                        label={t("address")}
                        name="address"
                        disabled={!mikrotikPackage}
                      />
                    </div>
                    <div className="newDisplay">
                      <FtextField
                        type="text"
                        label={t("email")}
                        name="email"
                        disabled={!mikrotikPackage}
                      />

                      <div className="billCycle">
                        <label className="form-control-label changeLabelFontColor">
                          {t("billingCycle")}{" "}
                          <span className="text-danger">*</span>
                        </label>

                        <DatePicker
                          className="form-control mw-100"
                          selected={billDate}
                          onChange={(date) => setBillDate(date)}
                          dateFormat="MMM dd yyyy hh:mm"
                          showTimeSelect
                          placeholderText={t("selectBillDate")}
                          disabled={
                            !(mikrotikPackage && userRole === "ispOwner")
                          }
                        />
                      </div>
                      <div className="billCycle">
                        <div>
                          <label className="form-control-label changeLabelFontColor">
                            {t("connectionDate")}
                          </label>
                          <DatePicker
                            className="form-control mw-100"
                            selected={connectionDate}
                            onChange={(date) => setConnectionDate(date)}
                            dateFormat="MM/dd/yyyy"
                            placeholderText={t("selectDate")}
                            disabled={!mikrotikPackage}
                          />
                        </div>
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
