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
  editHotspotCustomer,
  getHotspotPackage,
} from "../../../features/hotspotApi";
import Loader from "../../../components/common/Loader";
import SelectField from "../../../components/common/SelectField";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";

const EditCustomer = ({ show, setShow, customerId }) => {
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
    // balance: Yup.number().integer().required("পূর্বের ব্যালান্স দিন"),
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

  // area id state
  const [areaId, setAreaId] = useState();

  // sub area id state
  const [subareaId, setSubAreaId] = useState();

  // subarea state
  const [subArea, setSubArea] = useState();

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
    // area.map((item) => {
    //   item.subAreas.map((subarea) => {
    //     if (subarea === editCustomer?.subArea) {
    //       setAreaId(item.id);
    //       selectArea(item.id);
    //     }
    //   });
    // });

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

  // modal close handler
  const handleClose = () => setShow(false);

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
      // paymentStatus: "unpaid",
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
    editHotspotCustomer(
      dispatch,
      sendingData,
      customerId,
      setIsLoading,
      setShow
    );
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" size="xl">
        <ModalHeader closeButton>
          <ModalTitle>
            <h5 className="modal-title text-secondary">
              {t("updateCustomer")}
            </h5>
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
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
              <Form id="customerEdit">
                <div className="displayGrid3">
                  <FtextField
                    type="number"
                    label={t("dayLength")}
                    name="dayLength"
                    disabled={userRole !== "ispOwner"}
                    validation={"true"}
                    onChange={customerDayLengthHandle}
                  />

                  {bpSettings?.hasMikrotik && (
                    <div>
                      <label className="form-control-label changeLabelFontColor">
                        {t("selectMikrotik")}
                        <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select mw-100 mt-0"
                        aria-label="Default select example"
                        onChange={(event) => setMikrotikId(event.target.value)}
                      >
                        <option value="">...</option>
                        {mikrotik.length &&
                          mikrotik?.map((val, key) => (
                            <option
                              key={key}
                              value={val.id}
                              selected={editCustomer?.mikrotik === val.id}
                            >
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
                                selected={
                                  editCustomer?.hotspotPackage === val.id
                                }
                              >
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

                  <div>
                    <label className="form-control-label changeLabelFontColor">
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

                  <SelectField
                    label={t("customerBillType")}
                    id="exampleSelect"
                    name="billPayType"
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
                        value={"active"}
                        id="inlineRadio1"
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

                    {editCustomer?.status === "expired" && (
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          id="inlineRadio3"
                          disabled
                          checked={status === "expired"}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="inlineRadio3"
                        >
                          {t("expired")}
                        </label>
                      </div>
                    )}
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
            form="customerEdit"
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

export default EditCustomer;
