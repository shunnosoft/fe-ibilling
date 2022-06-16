import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import "../../collector/collector.css";
import "../customer.css";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import { fetchPackagefromDatabase } from "../../../features/apiCalls";
import moment from "moment";
import { updateStaticCustomerApi } from "../../../features/staticCustomerApi";

export default function StaticCustomerEdit({ single }) {
  const customer = useSelector((state) =>
    state?.persistedReducer?.customer?.staticCustomer.find(
      (item) => item.id === single
    )
  );
  const bpSettings = useSelector(
    (state) => state?.persistedReducer?.auth?.userData?.bpSettings
  );

  // get role from redux
  const role = useSelector((state) => state?.persistedReducer?.auth?.role);

  // get Isp owner id
  const ispOwnerId = useSelector(
    (state) => state?.persistedReducer?.auth?.ispOwnerId
  );

  const userType = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData?.bpSettings.queueType
  );

  // get all area
  const areas = useSelector((state) => state?.persistedReducer?.area?.area);

  // get all mikrotik
  const Getmikrotik = useSelector(
    (state) => state?.persistedReducer?.mikrotik?.mikrotik
  );

  const ppPackage = useSelector((state) =>
    bpSettings?.hasMikrotik
      ? state?.persistedReducer?.mikrotik?.packagefromDatabase
      : state?.package?.packages
  );

  const dispatch = useDispatch();

  const [packageRate, setPackageRate] = useState({ rate: 0 });
  const [isLoading, setIsloading] = useState(false);
  const [singleMikrotik, setSingleMikrotik] = useState("");
  const [mikrotikPackage, setMikrotikPackage] = useState("");
  const [autoDisable, setAutoDisable] = useState();
  const [area, setArea] = useState("");
  const [billDate, setBillDate] = useState();
  const [billTime, setBilltime] = useState();
  const [maxUpLimit, setUpMaxLimit] = useState("");
  const [maxDownLimit, setDownMaxLimit] = useState("");
  const [monthlyFee, setMonthlyFee] = useState();
  const [qDisable, setQdisable] = useState();
  // customer validator
  useEffect(() => {
    setAutoDisable(customer?.autoDisable);
    setMonthlyFee(customer?.monthlyFee);
    setSingleMikrotik(customer?.mikrotik);
    setMikrotikPackage(customer?.mikrotikPackage);
    if (
      userType === "simple-queue" &&
      customer?.queue.type === "simple-queue"
    ) {
      setUpMaxLimit(customer?.queue.maxLimit.split("/")[0]);
      setDownMaxLimit(customer?.queue.maxLimit.split("/")[1]);
    }
    setQdisable(customer?.queue.disabled);
    areas?.forEach((item) => {
      item.subAreas?.forEach((sub) => {
        if (sub.id === customer?.subArea) {
          return setArea(item);
        }
      });
    });
  }, [customer]);

  useEffect(() => {
    const IDs = {
      ispOwner: ispOwnerId,
      mikrotikId: customer?.mikrotik,
    };
    if (bpSettings?.hasMikrotik) {
      fetchPackagefromDatabase(dispatch, IDs);
    }
  }, [customer?.mikrotik]);

  useEffect(() => {
    setBillDate(
      moment(customer?.billingCycle).endOf("day").format("YYYY-MM-DD")
    );
    setBilltime(moment(customer?.billingCycle).endOf("day").format("HH:mm"));
  }, [customer]);

  const customerValidator = Yup.object({
    name: Yup.string().required("গ্রাহকের নাম লিখুন"),
    mobile: Yup.string()
      .matches(/^(01){1}[3456789]{1}(\d){8}$/, "মোবাইল নম্বর সঠিক নয়")
      .min(11, "এগারো  ডিজিট এর মোবাইল নম্বর লিখুন")
      .max(11, "এগারো  ডিজিট এর বেশি হয়ে গেছে")
      .required("মোবাইল নম্বর লিখুন"),
    address: Yup.string(),
    email: Yup.string().email("ইমেইল সঠিক নয়"),
    nid: Yup.string(),
    // monthlyFee: Yup.number()
    //   .integer()
    //   .min(0, "সর্বনিম্ন প্যাকেজ রেট 0")
    //   .required("প্যাকেজ রেট দিন"),
  });

  const selectMikrotik = (e) => {
    const id = e.target.value;
    if (id && ispOwnerId) {
      const IDs = {
        ispOwner: ispOwnerId,
        mikrotikId: id,
      };
      //ToDo
      if (bpSettings?.hasMikrotik) {
        fetchPackagefromDatabase(dispatch, IDs);
      }
    }
    setSingleMikrotik(id);
  };

  // select subArea
  const selectSubArea = (data) => {
    const areaId = data.target.value;
    if (areas) {
      const temp = areas.find((val) => {
        return val.id === areaId;
      });
      setArea(temp);
    }
  };

  //function for set 0
  const setPackageLimit = (value, isDown) => {
    setMikrotikPackage(value);
    const temp = ppPackage.find((val) => val.id === value);
    if (isDown) {
      setPackageRate(temp);
      setMonthlyFee(temp.rate);
    }
    if (value === "unlimited") return "0";
    const getLetter = temp.name.toLowerCase();
    if (getLetter.indexOf("m") !== -1) {
      const setZero = getLetter.replace("m", "000000");
      return setZero;
    }
    if (getLetter.indexOf("k") !== -1) {
      const setZero = getLetter.replace("k", "000");
      return setZero;
    }
  };

  // select Mikrotik Package
  const selectMikrotikPackage = ({ target }) => {
    if (target.value === "0") {
      setPackageRate({ rate: 0 });
    } else {
      if (target.name === "firewallPackage") {
        setMikrotikPackage(target.value);
        const temp = ppPackage.find((val) => val.id === target.value);
        setPackageRate(temp);
        setMonthlyFee(temp.rate);
      }

      if (target.name === "upPackage") {
        const getLimit = setPackageLimit(target.value, false);
        getLimit && setUpMaxLimit(getLimit);
      }
      if (target.name === "downPackage") {
        const getLimit = setPackageLimit(target.value, true);
        getLimit && setDownMaxLimit(getLimit);
      }
    }
  };

  // sending data to backed
  const customerHandler = async (data, resetForm) => {
    const { balance, ipAddress, queueName, target, ...rest } = data;
    const mainData = {
      ispOwner: ispOwnerId,
      mikrotik: singleMikrotik,
      mikrotikPackage: mikrotikPackage,
      autoDisable: autoDisable,
      billingCycle: moment(billDate + " " + billTime)
        .subtract({ hours: 6 })
        .format("YYYY-MM-DDTHH:mm:ss.ms[Z]"),
      balance: -balance,
      ...rest,
      monthlyFee: monthlyFee,
    };

    if (!bpSettings.hasMikrotik) {
      delete mainData.mikrotik;
    }
    let sendingData = { ...mainData };
    if (userType === "firewall-queue") {
      sendingData.userType = "firewall-queue";
      sendingData.queue = {
        type: userType,
        address: ipAddress,
        list: "allow_ip",
        disabled: qDisable,
      };
    }
    if (userType === "simple-queue") {
      sendingData.userType = "simple-queue";
      sendingData.queue = {
        name: queueName,
        type: userType,
        target,
        maxLimit: `${maxUpLimit}/${maxDownLimit}`,
        disabled: qDisable,
      };
    }
    if (!qDisable) {
      sendingData.status = "active";
    } else {
      sendingData.status = "inactive";
    }

    updateStaticCustomerApi(customer.id, dispatch, sendingData, setIsloading);
  };

  // console.log(customer);

  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="editStaticCustomerModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                গ্রাহক আপডেট করুন
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
                  name: customer?.name || "",
                  mobile: customer?.mobile || "",
                  address: customer?.address || "",
                  email: customer?.email || "",
                  balance: customer?.balance || "",
                  ipAddress: customer?.queue.address || "",
                  queueName: customer?.queue.name || "",
                  target: customer?.queue.target || "",
                }}
                validationSchema={customerValidator}
                onSubmit={(values, { resetForm }) => {
                  customerHandler(values, resetForm);
                }}
                enableReinitialize
              >
                {(formik) => (
                  <Form>
                    <div className="static_customer_edit_modal">
                      <div className="static_edit_item">
                        <p className="comstomerFieldsTitle">
                          মাইক্রোটিক সিলেক্ট করুন
                        </p>
                        <select
                          className="form-select mw-100"
                          aria-label="Default select example"
                          onChange={selectMikrotik}
                          disabled
                        >
                          <option value="">...</option>
                          {Getmikrotik.length === undefined
                            ? ""
                            : Getmikrotik.map((val, key) => (
                                <option
                                  selected={val.id === customer?.mikrotik}
                                  key={key}
                                  value={val.id}
                                >
                                  {val.name}
                                </option>
                              ))}
                        </select>
                      </div>
                      <div className="static_edit_item">
                        <p>এরিয়া সিলেক্ট করুন</p>
                        <select
                          className="form-select mw-100"
                          aria-label="Default select example"
                          onChange={selectSubArea}
                        >
                          <option value="">...</option>
                          {areas.length === undefined
                            ? ""
                            : areas.map((val, key) => (
                                <option
                                  selected={val.id === area?.id}
                                  key={key}
                                  value={val.id}
                                >
                                  {val.name}
                                </option>
                              ))}
                        </select>
                      </div>
                      <div className="static_edit_item">
                        <p>
                          {area ? area.name + " এর - " : ""} সাব-এরিয়া সিলেক্ট
                          করুন
                        </p>
                        <select
                          className="form-select mw-100"
                          aria-label="Default select example"
                          name="subArea"
                          id="subAreaId"
                        >
                          <option value="">...</option>
                          {area?.subAreas
                            ? area.subAreas.map((val, key) => {
                                // console.log({
                                //   value: val.id,
                                //   customer: customer?.subArea,
                                // });
                                return (
                                  <option
                                    selected={val.id === customer?.subArea}
                                    key={key}
                                    value={val.id}
                                  >
                                    {val.name}
                                  </option>
                                );
                              })
                            : ""}
                        </select>
                      </div>

                      {userType === "simple-queue" && (
                        <div className="static_edit_item">
                          <FtextField
                            type="text"
                            label="কিউ নাম"
                            name="queueName"
                          />
                        </div>
                      )}

                      {userType === "simple-queue" && (
                        <div className="static_edit_item">
                          <FtextField
                            type="text"
                            label="আইপি এড্রেস"
                            name="target"
                          />
                        </div>
                      )}
                      {userType === "firewall-queue" && (
                        <div className="static_edit_item">
                          <>
                            <FtextField
                              type="text"
                              label="আইপি এড্রেস"
                              name="ipAddress"
                            />
                          </>
                        </div>
                      )}
                      {userType === "firewall-queue" && (
                        <div className="static_edit_item">
                          <>
                            <p className="comstomerFieldsTitle">
                              প্যাকেজ সিলেক্ট করুন
                            </p>
                            <select
                              name="firewallPackage"
                              className="form-select mw-100"
                              aria-label="Default select example"
                              onChange={selectMikrotikPackage}
                            >
                              <option value={"0"}>...</option>
                              {ppPackage &&
                                ppPackage?.map(
                                  (val, key) =>
                                    val.packageType === "queue" && (
                                      <option
                                        selected={
                                          val.id === customer?.mikrotikPackage
                                        }
                                        key={key}
                                        value={val.id}
                                      >
                                        {val.name}
                                      </option>
                                    )
                                )}
                            </select>
                          </>
                        </div>
                      )}

                      {userType === "simple-queue" && (
                        <div className="static_edit_item">
                          <>
                            <p className="comstomerFieldsTitle">
                              আপলোড প্যাকেজ
                            </p>
                            <select
                              name="upPackage"
                              className="form-select mw-100 "
                              aria-label="Default select example"
                              onChange={selectMikrotikPackage}
                            >
                              <option value={"0"}>...</option>
                              {ppPackage &&
                                ppPackage?.map(
                                  (val, key) =>
                                    val.packageType === "queue" && (
                                      <option
                                        selected={
                                          val.id === customer?.mikrotikPackage
                                        }
                                        key={key}
                                        value={val.id}
                                      >
                                        {val.name}
                                      </option>
                                    )
                                )}
                            </select>
                          </>
                        </div>
                      )}

                      {userType === "simple-queue" && (
                        <div className="static_edit_item">
                          <p>ডাউনলোড প্যাকেজ</p>
                          <select
                            name="downPackage"
                            className="form-select mw-100 mt-0 mb-3"
                            aria-label="Default select example"
                            onChange={selectMikrotikPackage}
                          >
                            <option value={"0"}>...</option>
                            {ppPackage &&
                              ppPackage?.map(
                                (val, key) =>
                                  val.packageType === "queue" && (
                                    <option
                                      selected={
                                        val.id === customer?.mikrotikPackage
                                      }
                                      key={key}
                                      value={val.id}
                                    >
                                      {val.name}
                                    </option>
                                  )
                              )}
                          </select>
                        </div>
                      )}
                      <div className="static_edit_item">
                        <FtextField
                          type="number"
                          label="মাসিক ফি"
                          name="monthlyFee"
                          min={0}
                          value={monthlyFee}
                          onChange={(e) => setMonthlyFee(e.target.value)}
                        />
                      </div>
                      {!bpSettings?.hasMikrotik && (
                        <div className="static_edit_item">
                          <FtextField
                            type="number"
                            label="পূর্বের বকেয়া"
                            name="balance"
                          />
                        </div>
                      )}

                      <div className="static_edit_item">
                        <FtextField type="text" label="নাম" name="name" />
                      </div>
                      <div className="static_edit_item">
                        <FtextField type="text" label="মোবাইল" name="mobile" />
                      </div>
                      <div className="static_edit_item">
                        <FtextField type="text" label="ঠিকানা" name="address" />
                      </div>
                      <div className="static_edit_item">
                        <FtextField type="text" label="ইমেইল" name="email" />
                      </div>
                      <div className="static_edit_item">
                        <p className="customerFieldsTitle">বিলিং সাইকেল</p>

                        <div className="timeDate">
                          <input
                            value={billDate}
                            onChange={(e) => setBillDate(e.target.value)}
                            type="date"
                          />
                          <input
                            className="billTime"
                            value={billTime}
                            onChange={(e) => setBilltime(e.target.value)}
                            type="time"
                          />
                        </div>
                      </div>
                      <div className="static_edit_item">
                        {bpSettings?.hasMikrotik && (
                          <div className="autoDisable">
                            <label>অটোমেটিক সংযোগ বন্ধ</label>
                            <input
                              type="checkBox"
                              checked={autoDisable}
                              onChange={(e) => setAutoDisable(e.target.checked)}
                            />
                          </div>
                        )}
                      </div>

                      <div className="pppoeStatus">
                        <p>স্ট্যাটাস</p>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="staus"
                            value={"active"}
                            checked={
                              !qDisable && customer?.status !== "expired"
                            }
                            onChange={(e) => setQdisable(false)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="inlineRadio1"
                          >
                            এক্টিভ
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="inlineRadio2"
                            value={"inactive"}
                            checked={qDisable && customer?.status !== "expired"}
                            onChange={(e) => setQdisable(true)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="inlineRadio2"
                          >
                            ইন-এক্টিভ
                          </label>
                        </div>

                        {customer?.status === "expired" && (
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              id="inlineRadio2"
                              checked={customer?.status === "expired"}
                              disabled
                            />
                            <label
                              className="form-check-label"
                              htmlFor="inlineRadio2"
                            >
                              এক্সপায়ার্ড
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="modal-footer" style={{ border: "none" }}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        disabled={isLoading}
                      >
                        বাতিল করুন
                      </button>
                      <button
                        type="submit"
                        className="btn btn-success"
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader /> : "সেভ করুন"}
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
