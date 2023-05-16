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
  editHotspotCustomer,
  getHotspotPackage,
  syncHotspotPackage,
} from "../../../features/hotspotApi";
import Loader from "../../../components/common/Loader";

const EditCustomer = ({ customerId }) => {
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

  // bill date state
  const [billDate, setBillDate] = useState(new Date());

  // connection date state
  const [promiseDate, setPromiseDate] = useState();

  // mikrotik id state
  const [mikrotikId, setMikrotikId] = useState();

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

  const [slectSubArea, setSelectSubArea] = useState([]);

  // loading state
  const [hotspotPackageLoading, setHotspotPackageLoading] = useState(false);
  const [mikrotikLoading, setMikrotikLoading] = useState(false);
  const [areaLoading, setAreaLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

    // set billing cycle
    if (editCustomer) setBillDate(new Date(editCustomer?.billingCycle));

    // set connection Date
    if (editCustomer) setPromiseDate(new Date(editCustomer?.promiseDate));

    // set package id
    if (editCustomer) setPackageId(editCustomer?.hotspotPackage);

    // set sub area id
    if (editCustomer) setSubAreaId(editCustomer?.subArea);
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

  // package handler
  const selectPackage = (event) => {
    setPackageId(event.target.value);
    const filterPackageRate = hotspotPackage.find(
      (item) => item.id === packageId
    );
    setPackageRate(filterPackageRate);
  };

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

    if (!subArea) {
      setIsLoading(false);
      return alert(t("selectSubarea"));
    }

    const sendingData = {
      address: data?.address,
      paymentStatus: "unpaid",
      area: slectSubArea[0]?.area,
      subArea: subareaId,
      ispOwner: ispOwnerId,
      mikrotik: mikrotikId,
      hotspotPackage: packageId,
      email: data?.email,
      mobile: data?.mobile,
      billPayType: "prepaid",
      autoDisable: false,
      promiseDate: promiseDate?.toISOString(),
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
    editHotspotCustomer(dispatch, sendingData, customerId, setIsLoading);
  };

  return (
    <div
      className="modal fade modal-dialog-scrollable "
      id="EditHotspotCustomer"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {t("updateCustomer")}
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
                  name: editCustomer?.name || "",
                  mobile: editCustomer?.mobile || "",
                  address: editCustomer?.address || "",
                  email: editCustomer?.email || "",
                  nid: editCustomer?.nid || "",
                  monthlyFee:
                    editCustomer?.monthlyFee || packageRate?.rate || 0,
                  hotspotName: editCustomer?.hotspot.name || "",
                  hotspotProfile:
                    editCustomer?.hotspot.profile || packageRate?.name || "",
                  hotspotPassword: editCustomer?.hotspot.password || "",
                  hotspotComment: editCustomer?.hotspot.comment || "",
                  balance: editCustomer?.balance || 0,
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
                          <option value="">...</option>
                          {hotspotPackage &&
                            hotspotPackage?.map((val, key) => (
                              <>
                                {val.mikrotik === mikrotikId && (
                                  <option
                                    key={key}
                                    value={val.id}
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
                        label={t("monthFee")}
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
                    </div>

                    <div className="pppoeSection2">
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
                          {t("selectSubArea")}{" "}
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
                          <option value="">Select Sub Area</option>
                          {slectSubArea?.map((val, key) => (
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
                    </div>

                    <div className="displayGrid3">
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
                    </div>
                    <div className="newDisplay">
                      <FtextField
                        type="text"
                        label={t("email")}
                        name="email"
                        disabled={!packageId}
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
                          disabled={!(packageId && userRole === "ispOwner")}
                        />
                      </div>

                      <div className="billCycle">
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
                      </div>
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
};

export default EditCustomer;
