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
import { addStaticCustomerSuccess } from "../../../features/customerSlice";
import { addStaticCustomerApi } from "../../../features/staticCustomerApi";
export default function AddStaticCustomer() {
  // get user bp setting
  const bpSettings = useSelector(
    (state) => state?.persistedReducer?.auth?.userData?.bpSettings
  );

  // get role from redux
  const role = useSelector((state) => state?.persistedReducer?.auth?.role);

  // get Isp owner id
  const ispOwnerId = useSelector(
    (state) => state?.persistedReducer?.auth?.ispOwnerId
  );

  // get all area
  const area = useSelector((state) => state?.persistedReducer?.area?.area);

  // get all mikrotik
  const Getmikrotik = useSelector(
    (state) => state?.persistedReducer?.mikrotik?.mikrotik
  );

  const ppPackage = useSelector((state) =>
    bpSettings?.hasMikrotik
      ? state?.persistedReducer?.mikrotik?.packagefromDatabase
      : state?.package?.packages
  );

  const [packageRate, setPackageRate] = useState({ rate: 0 });
  const [isLoading, setIsloading] = useState(false);
  const [singleMikrotik, setSingleMikrotik] = useState("");
  const [mikrotikPackage, setMikrotikPackage] = useState("");
  const [autoDisable, setAutoDisable] = useState(true);
  const [subArea, setSubArea] = useState("");
  const dispatch = useDispatch();
  const [billDate, setBillDate] = useState();
  const [billTime, setBilltime] = useState();
  const [userType, setUserType] = useState("");

  // customer validator
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
    monthlyFee: Yup.number()
      .integer()
      .min(0, "সর্বনিম্ন প্যাকেজ রেট 0")
      .required("প্যাকেজ রেট দিন"),
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
        fetchPackagefromDatabase(dispatch, IDs);
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

    console.log(e.target.value);

    if (mikrotikPackageId === "0") {
      setPackageRate({ rate: 0 });
    } else {
      // console.log(e.target.value)
      setMikrotikPackage(mikrotikPackageId);
      const temp = ppPackage.find((val) => val.id === mikrotikPackageId);
      setPackageRate(temp);
    }
  };

  // sending data to backed
  const customerHandler = async (data, resetForm) => {
    // console.log(data);
    const subArea2 = document.getElementById("subAreaId").value;
    if (subArea2 === "") {
      setIsloading(false);
      return alert("সাব-এরিয়া সিলেক্ট করতে হবে");
    }
    const {
      Pname,
      Ppassword,
      Pprofile,
      Pcomment,
      balance,
      ipAddress,
      queueName,
      target,
      ...rest
    } = data;
    const mainData = {
      paymentStatus: "unpaid",
      subArea: subArea2,
      ispOwner: ispOwnerId,
      mikrotik: singleMikrotik,
      mikrotikPackage: mikrotikPackage,
      billPayType: "prepaid",
      autoDisable: autoDisable,
      billingCycle: moment(billDate + " " + billTime)
        .subtract({ hours: 6 })
        .format("YYYY-MM-DDTHH:mm:ss.ms[Z]"),
      balance: -balance,
      ...rest,
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
      };
    }
    if (userType === "simple-queue") {
      sendingData.userType = "simple-queue";
      sendingData.queue = { type: userType, target, maxLimit: "" };
    }

    console.log(sendingData);
    addStaticCustomerApi(dispatch, sendingData, setIsloading, resetForm);
  };

  useEffect(() => {
    setBillDate(moment().endOf("day").format("YYYY-MM-DD"));
    setBilltime(moment().endOf("day").format("HH:mm"));
  }, [bpSettings, role]);

  //traget ad ip queue-{name ,target-ip,max-limit,}
  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="addStaticCustomerModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                নতুন গ্রাহক অ্যাড করুন
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
                  monthlyFee: packageRate?.rate || 0,
                  Pname: "",
                  Pprofile: packageRate?.name || "",
                  Pcomment: "",
                  balance: "",
                  ipAddress: "",
                  queueName: "",
                  target: "",
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
                        <>
                          <div>
                            <p className="comstomerFieldsTitle">
                              মাইক্রোটিক সিলেক্ট করুন
                            </p>
                            <select
                              className="form-select"
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
                          <div>
                            <p>কাস্টমার টাইপ</p>
                            <select
                              className="form-select"
                              aria-label="Default select example"
                              onChange={(e) => setUserType(e.target.value)}
                            >
                              <option value="">...</option>
                              <option value="firewall-queue">Firewall</option>
                              {/* <option value="simple-queue">Simple queue</option> */}
                            </select>
                          </div>
                          {userType === "firewall-queue" && (
                            <FtextField
                              type="text"
                              label="আইপি এড্রেস"
                              name="ipAddress"
                            />
                          )}

                          {/* {userType === "simple-queue" && (
                            <>
                              <FtextField
                                type="text"
                                label="কিউ নাম"
                                name="queueName"
                              />
                              <FtextField
                                type="text"
                                label="আইপি এড্রেস"
                                name="target"
                              />
                            </>
                          )} */}
                        </>
                      ) : (
                        ""
                      )}

                      {/* pppoe package */}
                      {userType === "firewall-queue" && (
                        <div>
                          <p className="comstomerFieldsTitle">
                            প্যাকেজ সিলেক্ট করুন
                          </p>
                          <select
                            className="form-select mb-3"
                            aria-label="Default select example"
                            onChange={selectMikrotikPackage}
                          >
                            <option value={"0"}>...</option>
                            {ppPackage &&
                              ppPackage?.map(
                                (val, key) =>
                                  val.packageType === "queue" && (
                                    <option key={key} value={val.id}>
                                      {val.name}
                                    </option>
                                  )
                              )}
                          </select>
                        </div>
                      )}

                      {userType === "simple-queue" && (
                        <>
                          <div>
                            <p className="comstomerFieldsTitle">
                              আপলোড প্যাকেজ
                            </p>
                            <select
                              className="form-select mb-3"
                              aria-label="Default select example"
                              onChange={selectMikrotikPackage}
                            >
                              <option value={"0"}>...</option>
                              {ppPackage &&
                                ppPackage?.map(
                                  (val, key) =>
                                    val.packageType === "queue" && (
                                      <option key={key} value={val.id}>
                                        {val.name}
                                      </option>
                                    )
                                )}
                            </select>
                          </div>
                          <div>
                            <p className="comstomerFieldsTitle">
                              ডাউনলোড প্যাকেজ
                            </p>
                            <select
                              className="form-select mb-3"
                              aria-label="Default select example"
                              onChange={selectMikrotikPackage}
                            >
                              <option value={"0"}>...</option>
                              {ppPackage &&
                                ppPackage?.map(
                                  (val, key) =>
                                    val.packageType === "queue" && (
                                      <option key={key} value={val.id}>
                                        {val.name}
                                      </option>
                                    )
                                )}
                            </select>
                          </div>
                        </>
                      )}

                      <FtextField
                        type="number"
                        label="মাসিক ফি"
                        name="monthlyFee"
                        min={0}
                      />
                      {bpSettings?.hasMikrotik ? (
                        ""
                      ) : (
                        <FtextField
                          type="number"
                          label="পূর্বের বকেয়া"
                          name="balance"
                        />
                      )}
                    </div>

                    <div className="pppoeSection2"></div>

                    <div className="displayGrid3">
                      <div>
                        <p>এরিয়া সিলেক্ট করুন</p>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          onChange={selectSubArea}
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
                        <p>
                          {subArea ? subArea.name + " এর - " : ""} সাব-এরিয়া
                          সিলেক্ট করুন
                        </p>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          name="subArea"
                          id="subAreaId"
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
                        label="জাতীয় পরিচয়পত্র নং"
                        name="nid"
                      />
                    </div>

                    <div className="displayGrid3">
                      <FtextField type="text" label="নাম" name="name" />
                      <FtextField type="text" label="মোবাইল" name="mobile" />
                      <FtextField type="text" label="ঠিকানা" name="address" />
                    </div>
                    <div className="newDisplay">
                      <FtextField type="text" label="ইমেইল" name="email" />

                      <div className="billCycle">
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
                      {bpSettings?.hasMikrotik && (
                        <div className="displayGrid3">
                          <div className="autoDisable">
                            <label>অটোমেটিক সংযোগ বন্ধ</label>
                            <input
                              type="checkBox"
                              checked={autoDisable}
                              onChange={(e) => setAutoDisable(e.target.checked)}
                            />
                          </div>
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
