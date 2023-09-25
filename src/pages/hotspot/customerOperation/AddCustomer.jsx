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
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";

const AddCustomer = ({ show, setShow }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  //curent month date
  const today = new Date();
  const monthDay = new Date(
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

  // get all subAreas
  const storeSubArea = useSelector((state) => state.area?.subArea);

  // loading state
  const [hotspotPackageLoading, setHotspotPackageLoading] = useState(false);
  const [mikrotikLoading, setMikrotikLoading] = useState(false);
  const [areaLoading, setAreaLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // bill date state
  const [billDate, setBillDate] = useState(new Date());

  // customer select date state
  const [dayToday, setDayToday] = useState(monthDay);

  // connection date state
  const [connectionDate, setConnectionDate] = useState();

  // mikrotik id state
  const [mikrotikId, setMikrotikId] = useState("");

  // package id state
  const [packageId, setPackageId] = useState();

  // customer package state
  const [packageInfo, setPackageInfo] = useState();

  // customer package rate
  const [packageRate, setPackageRate] = useState("");

  // area id state
  const [areaId, setAreaId] = useState();

  // sub area id state
  const [subareaId, setSubAreaId] = useState();

  // subarea state
  const [subArea, setSubArea] = useState();

  useEffect(() => {
    fetchMikrotik(dispatch, ispOwnerId, setMikrotikLoading);

    getHotspotPackage(dispatch, ispOwnerId, setHotspotPackageLoading);

    // get area api
    getArea(dispatch, ispOwnerId, setAreaLoading);

    // get sub area api
    getSubAreasApi(dispatch, ispOwnerId);
  }, []);

  // modal close handler
  const handleClose = () => setShow(false);

  // package handler
  const selectPackage = (data) => {
    setPackageId(data);
    const filterPackageRate = hotspotPackage.find((item) => item.id === data);
    setPackageInfo(filterPackageRate);
  };

  // subarea handler
  const selectArea = (areaId) => {
    if (areaId) {
      const filterSubarea = storeSubArea?.filter((val) => val.area === areaId);
      setSubArea(filterSubarea);
      setSubAreaId(filterSubarea[0].id);
      setAreaId(areaId);
    }
  };

  // customer daily package rate handle
  useEffect(() => {
    const dt = new Date();
    const getTotalMonthDate = new Date(
      dt.getFullYear(),
      dt.getMonth() + 1,
      0
    ).getDate();

    if (dayToday === getTotalMonthDate) {
      setPackageRate(packageInfo?.rate);
    } else {
      const cusotmerPerDayBill = Math.ceil(
        packageInfo?.rate / getTotalMonthDate
      );

      const dayTodayFee = cusotmerPerDayBill * dayToday;
      setPackageRate(dayTodayFee);
    }
  }, [dayToday, packageInfo]);

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

    if (!areaId || !subareaId) {
      setIsLoading(false);
      return alert(t("selectSubarea"));
    }

    const sendingData = {
      address: data?.address,
      paymentStatus: "unpaid",
      area: areaId,
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
      dayLength: Number(dayToday),
      monthlyFee: data?.monthlyFee,
      name: data?.name,
      nid: data?.nid,
      hotspot: {
        name: data.hotspotName,
        password: data.hotspotPassword,
        comment: data.hotspotComment,
        profile: packageInfo?.name,
      },
    };

    addHotspotCustomer(dispatch, sendingData, setIsLoading, setShow);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" size="xl">
        <ModalHeader closeButton>
          <ModalTitle>
            <h5 className="modal-title text-secondary">
              {t("addNewCustomer")}
            </h5>
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Formik
            initialValues={{
              dayLength: dayToday,
              name: "",
              mobile: "",
              address: "",
              email: "",
              nid: "",
              monthlyFee: packageRate,
              hotspotName: "",
              // hotspotProfile: packageInfo?.name || "",
              hotspotPassword: "",
              hotspotComment: "",
              balance: "",
            }}
            validationSchema={customerValidator}
            onSubmit={(values) => handleSubmit(values)}
            enableReinitialize
          >
            {() => (
              <Form id="customerPost">
                <div className="displayGrid3">
                  <FtextField
                    type="number"
                    label={t("dayLength")}
                    name="dayLength"
                    disabled={userRole !== "ispOwner"}
                    validation={"true"}
                    onChange={(e) => setDayToday(e.target.value)}
                  />

                  {bpSettings?.hasMikrotik && (
                    <div>
                      <label className="form-control-label changeLabelFontColor">
                        {t("selectMikrotik")}
                        <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select mw-100 mt-0"
                        onChange={(event) => setMikrotikId(event.target.value)}
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

                  <div>
                    <label className="form-control-label changeLabelFontColor">
                      {t("selectPackage")}
                      <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select mw-100 mt-0"
                      onChange={(event) => selectPackage(event.target.value)}
                      disabled={!mikrotikId}
                    >
                      <option value="">...</option>
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
                    label={t("packageRate")}
                    name="monthlyFee"
                    min={0}
                    disabled={!(packageId && userRole === "ispOwner")}
                    validation={"true"}
                  />

                  {!bpSettings?.hasMikrotik && (
                    <FtextField
                      type="number"
                      label={t("prevDue")}
                      name="balance"
                    />
                  )}

                  <FtextField
                    type="text"
                    label={t("hotspotName")}
                    name="hotspotName"
                    disabled={!packageId}
                    validation={"true"}
                  />

                  <FtextField
                    type="text"
                    label={t("password")}
                    name="hotspotPassword"
                    disabled={!packageId}
                    validation={"true"}
                  />

                  <FtextField
                    type="text"
                    label={t("comment")}
                    name="hotspotComment"
                    disabled={!packageId}
                  />

                  <div>
                    <label className="form-control-label changeLabelFontColor">
                      {t("selectArea")} <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select mw-100 mt-0"
                      onChange={(event) => selectArea(event.target.value)}
                      disabled={!packageId}
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
                      {t("selectSubArea")}
                      <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select mw-100 mt-0"
                      name="subArea"
                      id="subAreaId"
                      onChange={(event) => setSubAreaId(event.target.value)}
                      disabled={!packageId}
                    >
                      <option value="">...</option>
                      {subArea?.map((val, key) => (
                        <option
                          key={key}
                          value={val.id}
                          selected={val.id === subareaId || ""}
                        >
                          {val.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <FtextField
                    type="text"
                    label={t("NIDno")}
                    name="nid"
                    disabled={!packageId}
                  />

                  <FtextField
                    type="text"
                    label={t("name")}
                    name="name"
                    disabled={!packageId}
                    validation={"true"}
                  />

                  <FtextField
                    type="text"
                    label={t("mobile")}
                    name="mobile"
                    disabled={!packageId}
                    validation={"true"}
                  />

                  <FtextField
                    type="text"
                    label={t("address")}
                    name="address"
                    disabled={!packageId}
                  />

                  <FtextField
                    type="text"
                    label={t("email")}
                    name="email"
                    disabled={!packageId}
                  />

                  <div>
                    <label className="form-control-label changeLabelFontColor">
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
                      disabled={!packageId}
                    />
                  </div>
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

export default AddCustomer;
