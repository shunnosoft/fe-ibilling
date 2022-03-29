import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import "../../collector/collector.css";
import "../customer.css";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import { addCustomer, fetchpppoePackage } from "../../../features/apiCalls";
import moment from "moment";
export default function CustomerModal() {
  const ispOwnerId = useSelector((state) => state.auth.ispOwnerId);
  const area = useSelector((state) => state.area.area);
  const Getmikrotik = useSelector((state) => state.mikrotik.mikrotik);
  const ppPackage = useSelector((state) => state.mikrotik.pppoePackage);
  const [packageRate, setPackageRate] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [singleMikrotik, setSingleMikrotik] = useState("");
  const [mikrotikPackage, setMikrotikPackage] = useState("");
  const [autoDisable, setAutoDisable] = useState(true);
  const [subArea, setSubArea] = useState("");
  const dispatch = useDispatch();
  const [billDate, setBillDate] = useState();
  const [billTime, setBilltime] = useState();

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
    monthlyFee: Yup.string().required("মাসিক ফি লিখুন"),
    Pname: Yup.string().required("PPPoE নাম লিখুন"),
    Ppassword: Yup.string().required("PPPoE পাসওয়ার্ড লিখুন"),
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
    if (id && ispOwnerId) {
      const IDs = {
        ispOwner: ispOwnerId,
        mikrotikId: id,
      };
      fetchpppoePackage(dispatch, IDs);
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
    setMikrotikPackage(mikrotikPackageId);
    const temp = ppPackage.find((val) => val.id === mikrotikPackageId);
    setPackageRate(temp);
  };

  // sending data to backed
  const customerHandler = async (data) => {
    setIsloading(true);
    const subArea2 = document.getElementById("subAreaId").value;
    if (subArea2 === "") {
      setIsloading(false);
      return alert("সাব-এরিয়া সিলেক্ট করতে হবে");
    }
    const { Pname, Ppassword, Pprofile, Pcomment, ...rest } = data;
    const mainData = {
      // customerId: "randon123",
      paymentStatus: "unpaid",
      subArea: subArea2,
      ispOwner: ispOwnerId,
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
    addCustomer(dispatch, mainData, setIsloading);
  };

  useEffect(() => {
    setBillDate(moment().endOf("day").format("YYYY-MM-DD"));
    setBilltime(moment().endOf("day").format("HH:mm"));
  }, []);
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
                  monthlyFee: packageRate?.rate || "",
                  Pname: "",
                  Pprofile: packageRate?.name || "",
                  Ppassword: "",
                  Pcomment: "",
                }}
                validationSchema={customerValidator}
                onSubmit={(values) => {
                  customerHandler(values);
                }}
                enableReinitialize
              >
                {(formik) => (
                  <Form>
                    <div className="mikrotikSection">
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

                      {/* pppoe package */}
                      <div>
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
                            : ppPackage.map((val, key) => (
                                <option key={key} value={val.id}>
                                  {val.name}
                                </option>
                              ))}
                        </select>
                      </div>
                      <FtextField
                        type="text"
                        label="মাসিক ফি"
                        name="monthlyFee"
                      />
                    </div>

                    <div className="pppoeSection2">
                      <FtextField type="text" label="PPPoE নাম" name="Pname" />
                      <FtextField
                        type="text"
                        label="পাসওয়ার্ড"
                        name="Ppassword"
                      />
                      <FtextField type="text" label="কমেন্ট" name="Pcomment" />
                    </div>

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
