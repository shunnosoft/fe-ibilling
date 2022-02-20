import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import "../../collector/collector.css";
import "../customer.css";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import { addCustomer, fetchpppoePackage } from "../../../features/apiCalls";

export default function CustomerModal() {
  const ispOwnerId = useSelector((state) => state.auth.ispOwnerId);
  const area = useSelector((state) => state.area.area);
  const Getmikrotik = useSelector((state) => state.mikrotik.mikrotik);
  const ppPackage = useSelector((state) => state.mikrotik.pppoePackage);
  const [packageRate, setPackageRate] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [subArea, setSubArea] = useState("");
  const [singleMikrotik, setSingleMikrotik] = useState("");
  const [mikrotikPackage, setMikrotikPackage] = useState("");
  const dispatch = useDispatch();

  // customer validator
  const customerValidator = Yup.object({
    name: Yup.string().required("নাম দিন"),
    mobile: Yup.string()
      .min(11, "এগারো  ডিজিট এর সঠিক নম্বর দিন ")
      .max(11, "এগারো  ডিজিট এর বেশি হয়ে গেছে ")
      .required("মোবাইল নম্বর দিন "),
    address: Yup.string().required("নাম দিন"),
    email: Yup.string()
      .email("ইমেইল সঠিক নয় ")
      .required("ম্যানেজার এর ইমেইল দিতে হবে"),
    nid: Yup.string().required("NID দিন"),
    monthlyFee: Yup.string().required("Montly Fee দিন"),
    Pname: Yup.string().required("PPPoE নাম"),
    Ppassword: Yup.string().required("PPPoE Password"),
    Pcomment: Yup.string().required("Comment"),
  });

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

  // select Mikrotik Package
  const selectMikrotikPackage = (e) => {
    const mikrotikPackageId = e.target.value;
    setMikrotikPackage(mikrotikPackageId);
    const temp = ppPackage.find((val) => val.id === mikrotikPackageId);
    setPackageRate(temp.rate);
  };

  // sending data to backed
  const customerHandler = async (data) => {
    setIsloading(true);
    const subArea = document.getElementById("subAreaId").value;
    if (subArea === "") {
      setIsloading(false);
      return alert("সাব-এরিয়া সিলেক্ট করতে হবে");
    }
    const { Pname, Ppassword, Pprofile, Pcomment, ...rest } = data;
    const mainData = {
      customerId: "randon123",
      paymentStatus: "unpaid",
      subArea: subArea,
      ispOwner: ispOwnerId,
      mikrotik: singleMikrotik,
      mikrotikPackage: mikrotikPackage,
      billPayType: "prepaid",
      pppoe: {
        name: Pname,
        password: Ppassword,
        service: "pppoe",
        comment: Pcomment,
      },
      ...rest,
    };
    // console.log("Main Data: ", mainData);
    addCustomer(dispatch, mainData, setIsloading);
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
                  monthlyFee: packageRate || "",
                  Pname: "",
                  Ppassword: "",
                  Pprofile: "",
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
                    <div className="customerGrid">
                      {/* section two */}
                      <div className="Section2">
                        <p className="comstomerFieldsTitle">
                          এরিয়া সিলেক্ট করুন
                        </p>
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

                        <p className="comstomerFieldsTitle mt-3">
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

                        <p className="comstomerFieldsTitle mt-3">
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

                        {/* pppoe package */}
                        <p className="comstomerFieldsTitle mt-3">
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
                        <FtextField
                          type="text"
                          label="মাসিক ফি"
                          name="monthlyFee"
                        />
                      </div>
                      {/* section 2 */}
                      <div className="sectionOne">
                        <FtextField type="text" label="নাম" name="name" />
                        <FtextField type="text" label="মোবাইল" name="mobile" />
                        <FtextField type="text" label="এড্রেস" name="address" />
                        <FtextField type="text" label="ইমেইল" name="email" />
                        <FtextField
                          type="text"
                          label="জাতীয় পরিচয়পত্র নং"
                          name="nid"
                        />
                      </div>
                      {/* section 3 */}
                      <div className="section3">
                        <FtextField
                          type="text"
                          label="PPPoE নাম"
                          name="Pname"
                        />
                        <FtextField
                          type="text"
                          label="পাসওয়ার্ড"
                          name="Ppassword"
                        />
                        <FtextField
                          type="text"
                          label="কমেন্ট"
                          name="Pcomment"
                        />
                      </div>
                    </div>
                    <div className="modal-footer">
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
