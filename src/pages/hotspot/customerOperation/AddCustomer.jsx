import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import ReactDatePicker from "react-datepicker";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import { FtextField } from "../../../components/common/FtextField";
import { getSubAreasApi } from "../../../features/actions/customerApiCall";
import { fetchMikrotik, getArea } from "../../../features/apiCalls";
import {
  addHotspotCustomer,
  getHotspotPackage,
  syncHotspotPackage,
} from "../../../features/hotspotApi";
import Loader from "../../../components/common/Loader";

const AddCustomer = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

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
    hotspotName: Yup.string().required(t("writePPPoEName")),
    hotspotPassword: Yup.string().required(t("writePPPoEPassword")),
    hotspotComment: Yup.string(),
    // balance: Yup.number().integer().required("পূর্বের ব্যালান্স দিন"),
  });

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

  const mikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  // get hotspot package
  const hotspotPackage = useSelector((state) => state.hotspot.package);

  // get area
  const area = useSelector((state) => state?.area?.area);

  // get all subarea
  const subAreas = useSelector((state) => state.area?.subArea);

  // bill date state
  const [billDate, setBillDate] = useState(new Date());

  // connection date state
  const [connectionDate, setConnectionDate] = useState();

  // mikrotik id state
  const [mikrotikId, setMikrotikId] = useState(mikrotik[0]?.id);

  // package id state
  const [packageId, setPackageId] = useState();

  // rate state
  const [packageRate, setPackageRate] = useState();

  // area id state
  const [areaId, setAreaId] = useState();

  // sub area id state
  const [subareaId, setSubAreaId] = useState();

  // subarea state
  const [subArea, setSubArea] = useState();

  // loading state
  const [hotspotPackageLoading, setHotspotPackageLoading] = useState(false);
  const [mikrotikLoading, setMikrotikLoading] = useState(false);
  const [areaLoading, setAreaLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchMikrotik(dispatch, ispOwnerId, setMikrotikLoading);

    getHotspotPackage(dispatch, ispOwnerId, setHotspotPackageLoading);

    // get area api
    getArea(dispatch, ispOwnerId, setAreaLoading);

    // get sub area api
    getSubAreasApi(dispatch, ispOwnerId);
  }, []);

  const selectPackage = (event) => {
    setPackageId(event.target.value);
    const filterPackageRate = hotspotPackage.find(
      (item) => item.id === packageId
    );
    setPackageRate(filterPackageRate);
  };

  const selectArea = (areaId) => {
    if (area) {
      const filterSubarea = area.find((val) => val.id === areaId);
      setSubArea(filterSubarea);
    }
  };

  // handle Submit
  const handleSubmit = (data) => {
    const sendingData = {
      paymentStatus: "unpaid",
      subArea: subareaId,
      ispOwner: ispOwnerId,
      mikrotik: mikrotikId,
      hotspotPackage: packageId,
      email: data?.email,
      mobile: data?.mobile,
      billPayType: "prepaid",
      autoDisable: false,
      connectionDate: connectionDate?.toISOString(),
      billingCycle: billDate?.toISOString(),
      balance: 0,
      monthlyFee: data?.monthlyFee,
      name: data?.name,
      nid: data?.nid,
      hotspot: {
        name: data.hotspotName,
        password: data.hotspotPassword,
        comment: data.hotspotComment,
        profile: data.hotspotProfile,
      },
    };
    addHotspotCustomer(dispatch, sendingData, setIsLoading);
  };

  return (
    <div
      className="modal fade modal-dialog-scrollable "
      id="AddHotspotCustomer"
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
                  hotspotName: "",
                  hotspotProfile: packageRate?.name || "",
                  hotspotPassword: "",
                  hotspotComment: "",
                  balance: "",
                }}
                validationSchema={customerValidator}
                onSubmit={(values) => handleSubmit(values)}
                enableReinitialize
              >
                {(formik) => (
                  <Form>
                    <div className="mikrotikSection">
                      {bpSettings?.hasMikrotik && (
                        <div>
                          <label className="form-control-label changeLabelFontColor">
                            {t("selectMikrotik")}{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-select mw-100 mt-0"
                            aria-label="Default select example"
                            onChange={(event) =>
                              setMikrotikId(event.target.value)
                            }
                          >
                            <option value="">...</option>
                            {mikrotik.length &&
                              mikrotik?.map((val, key) => (
                                <option key={key} value={val.id}>
                                  {val.name}
                                </option>
                              ))}
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
                          onChange={(event) => selectPackage(event)}
                        >
                          <option value={"0"}>...</option>
                          {hotspotPackage &&
                            hotspotPackage?.map((val, key) => (
                              <>
                                {val.mikrotik === mikrotikId && (
                                  <option key={key} value={val.id}>
                                    {val.name}
                                  </option>
                                )}
                              </>
                            ))}
                        </select>
                      </div>
                      <FtextField
                        type="number"
                        label={t("monthFee")}
                        name="monthlyFee"
                        min={0}
                        disabled={!(hotspotPackage && userRole === "ispOwner")}
                        validation={"true"}
                      />
                      {!bpSettings?.hasMikrotik && (
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
                        label={t("hotspotName")}
                        name="hotspotName"
                        disabled={!hotspotPackage}
                        validation={"true"}
                      />
                      <FtextField
                        type="text"
                        label={t("password")}
                        name="hotspotPassword"
                        disabled={!hotspotPackage}
                        validation={"true"}
                      />
                      <FtextField
                        type="text"
                        label={t("comment")}
                        name="hotspotComment"
                        disabled={!hotspotPackage}
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
                          onChange={(event) => selectArea(event.target.value)}
                          disabled={!hotspotPackage}
                        >
                          <option value="">...</option>
                          {area.length &&
                            area?.map((val, key) => (
                              <option key={key} value={val.id}>
                                {val.name}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div>
                        <label className="form-control-label changeLabelFontColor">
                          {t("selectSubArea")}{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select mw-100 mt-0"
                          aria-label="Default select example"
                          name="subArea"
                          id="subAreaId"
                          onChange={(event) => setSubAreaId(event.target.value)}
                          disabled={!hotspotPackage}
                        >
                          <option value="">...</option>
                          {subArea?.subAreas &&
                            subArea.subAreas.map((val, key) => (
                              <option key={key} value={val.id}>
                                {val.name}
                              </option>
                            ))}
                        </select>
                      </div>

                      <FtextField
                        type="text"
                        label={t("NIDno")}
                        name="nid"
                        disabled={!hotspotPackage}
                      />
                    </div>

                    <div className="displayGrid3">
                      <FtextField
                        type="text"
                        label={t("name")}
                        name="name"
                        disabled={!hotspotPackage}
                        validation={"true"}
                      />
                      <FtextField
                        type="text"
                        label={t("mobile")}
                        name="mobile"
                        disabled={!hotspotPackage}
                        validation={"true"}
                      />
                      <FtextField
                        type="text"
                        label={t("address")}
                        name="address"
                        disabled={!hotspotPackage}
                      />
                    </div>
                    <div className="newDisplay">
                      <FtextField
                        type="text"
                        label={t("email")}
                        name="email"
                        disabled={!hotspotPackage}
                      />

                      <div className="billCycle">
                        <label className="form-control-label changeLabelFontColor">
                          {t("billingCycle")}{" "}
                          <span className="text-danger">*</span>
                        </label>

                        <ReactDatePicker
                          className="form-control mw-100"
                          selected={billDate}
                          onChange={(date) => setBillDate(date)}
                          dateFormat="MMM dd yyyy hh:mm"
                          showTimeSelect
                          placeholderText={t("selectBillDate")}
                          disabled={
                            !(hotspotPackage && userRole === "ispOwner")
                          }
                        />
                      </div>
                      <div className="billCycle">
                        <div>
                          <label className="form-control-label changeLabelFontColor">
                            {t("connectionDate")}
                          </label>
                          <ReactDatePicker
                            className="form-control mw-100"
                            selected={connectionDate}
                            onChange={(date) => setConnectionDate(date)}
                            dateFormat="MM/dd/yyyy"
                            placeholderText={t("selectDate")}
                            disabled={!hotspotPackage}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="modal-footer" style={{ border: "none" }}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        // disabled={isLoading}
                      >
                        {t("cancel")}
                      </button>
                      <button
                        type="submit"
                        className="btn btn-success"
                        // disabled={isLoading}
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
};

export default AddCustomer;
