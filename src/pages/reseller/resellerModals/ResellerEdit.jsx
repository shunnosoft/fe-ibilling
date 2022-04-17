import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import * as Yup from "yup";

// internal imports
import "../reseller.css";
import "../../collector/collector.css";
import { FtextField } from "../../../components/common/FtextField";
import { RADIO, RPD } from "../resellerData";
import Loader from "../../../components/common/Loader";
import { editReseller } from "../../../features/apiCalls";
// import { editReseller, fetchReseller } from "../../../features/resellerSlice";

export default function ResellerEdit({ reseller }) {
  const [isLoading, setIsLoading] = useState(false);
  const auth = useSelector((state) => state.persistedReducer.auth.currentUser);
  const area = useSelector((state) => state.persistedReducer.area.area);
  const mikrotik = useSelector(
    (state) => state.persistedReducer.mikrotik.mikrotik
  );
  const dispatch = useDispatch();
  const [allowedAreas, setAllowedAreas] = useState([]);
  const [areaIds_Edit, setAreaIds_Edit] = useState([]);

  const [allowedMikrotik, setAllowedMikrotik] = useState([]);
  const [mikrotikIds_Edit, setMikrotikIds_Edit] = useState([]);

  // const [permissions, setPermissions] = useState([]);
  useEffect(() => {
    setMikrotikIds_Edit(reseller.mikrotiks);

    setAreaIds_Edit(reseller.subAreas);

    setAllowedAreas(reseller?.subAreas);

    setAllowedMikrotik(reseller?.mikrotiks);
  }, [reseller]);

  //validator
  const resellerValidator = Yup.object({
    name: Yup.string().required("নাম দিন"),
    mobile: Yup.string()
      .min(11, "এগারো  ডিজিট এর সঠিক নম্বর দিন ")
      .max(11, "এগারো  ডিজিট এর বেশি হয়ে গেছে ")
      .required("মোবাইল নম্বর দিন "),
    email: Yup.string().email("ইমেইল সঠিক নয় "),
    nid: Yup.string(),
    website: Yup.string(),
    address: Yup.string(),
    status: Yup.string().required("স্ট্যাটাস সিলেক্ট করুন"),
    commissionRate: Yup.number()
      .integer()
      .min(1, "সর্বনিম্ন শেয়ার ১% ")
      .max(99, "সর্বোচ্চ শেয়ার ৯৯%")
      .required("রিসেলার শেয়ার দিন"),
  });

  // const handleChange = (e) => {
  //   const { name, checked } = e.target;
  //   if (name === "allChecked") {
  //     let temp = Check.map((event) => ({ ...event, isChecked: checked }));
  //     setCheck(temp);
  //   } else {
  //     let temp = Check.map((event) =>
  //       event.value === name ? { ...event, isChecked: checked } : event
  //     );
  //     console.log(temp);
  //     setCheck(temp);
  //   }
  // };

  // edit Reseller
  const resellerHandler = async (data) => {
    let commision = data.commissionRate;
    if (auth.ispOwner) {
      const sendingData = {
        ...data,
        ispOwner: reseller.ispOwner,
        ispId: reseller.ispOwner,
        resellerId: reseller.id,
        subAreas: areaIds_Edit,

        mikrotiks: mikrotikIds_Edit,
      };

      sendingData.commissionRate = {
        reseller: commision,
        isp: 100 - commision,
      };

      editReseller(dispatch, sendingData, setIsLoading);
    }
  };
  const setAreaHandler = () => {
    const temp = document.querySelectorAll(".getValueUsingClass_Edit");
    let IDS_temp = [];
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].checked === true) {
        IDS_temp.push(temp[i].value);
      }
    }
    setAllowedAreas(IDS_temp);
    setAreaIds_Edit(IDS_temp);
  };

  const setMikrotikHandler = (e) => {
    const temp = document.querySelectorAll(".getValueUsingClassesforMikrotik");
    let IDS_temp = [];
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].checked === true) {
        IDS_temp.push(temp[i].value);
      }
    }
    setAllowedMikrotik(IDS_temp);
    setMikrotikIds_Edit(IDS_temp);
  };
  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="resellerModalEdit"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                রি-সেলার এডিট করুন
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
                  // ispOwner:
                  name: reseller.name || "", //*
                  mobile: reseller.mobile || "", //*
                  email: reseller.email || "", //*
                  nid: reseller.nid || "", //*
                  website: reseller.website || "",
                  address: reseller.address || "",
                  commissionRate: reseller?.commissionRate?.reseller || 1, //number
                  status: reseller.status || "", //['new', 'active', 'inactive', 'banned', 'deleted'],
                  // ['prepaid', 'postpaid', 'both'], /*
                  // rechargeBalance: "", //number
                  // smsRate: "", //number
                  // commissionType: "", //['global', 'individual'],
                  // refName: "",
                  // refMobile: "",
                  // customerAdd: "",
                  // customerEdit: "",
                  // customerDelete: "",
                  // monthlyFeeEdit: "",
                  // billEdit: "",
                  // billPosting: "",
                  // accounts: "",
                  // inventory: "",
                  // webLogin: "",
                  // viewCustomerList: "",
                  // sendSMS: "",
                  // customerActivate: "",
                  // customerDeactivate: "",
                  // print: "",
                  // collectorAdd: "",
                  // collectorEdit: "",
                  // viewTotalReport: "",
                  // viewCollectorReport: "",
                  // fileExport: "",
                }}
                validationSchema={resellerValidator}
                onSubmit={(values) => {
                  resellerHandler(values);
                }}
                enableReinitialize
              >
                {(formik) => (
                  <Form>
                    <div className="TakesInputFields">
                      {/* first part */}
                      <div>
                        {RPD.map((val, key) => (
                          <FtextField
                            key={key}
                            type={val.type}
                            label={val.label}
                            name={val.name}
                            disabled={val.disabled}
                          />
                        ))}
                      </div>

                      {/* second part */}
                      {/* <div className="secondSection">
                        <p className="radioTitle">
                          পারমিশন দিন
                          <input
                            id="souceCheck"
                            type="checkbox"
                            onChange={handleChange}
                            name="allChecked"
                          />
                        </p>
                        {RBD.map((val, key) => (
                          <FtextField
                            key={key}
                            type="checkbox"
                            className="checkInput"
                            checked={val.isChecked}
                            onChange={handleChange}
                            label={val.label}
                            name={val.value}
                          />
                        ))}
                      </div> */}

                      {/* start radion button */}
                      <div className="thirdSection">
                        {/* বিল গ্রহণের ধরণ */}

                        {/* commistion type */}
                        {/* <div className="form-check ">
                          <p className="radioTitle">কমিশন এর ধরণ</p>

                          <div className="form-check">
                            <FtextField
                              label="Global"
                              className="form-check-input"
                              type="radio"
                              name="commissionType"
                              value="global"
                            />
                          </div>
                          <div className="form-check">
                            <FtextField
                              label="Individual"
                              className="form-check-input"
                              type="radio"
                              name="commissionType"
                              value="individual"
                            />
                          </div>
                        </div> 

                        <hr />
                        */}

                        {/* Status */}
                        <div className="form-check ">
                          <p className="radioTitle">স্টেটাস</p>
                          {RADIO.map((val, key) => (
                            <div key={key} className="form-check">
                              <FtextField
                                label={val.label}
                                className="form-check-input"
                                type="radio"
                                name="status"
                                value={val.value}
                              />
                            </div>
                          ))}
                        </div>

                        <div className="form-check ">
                          <p className="radioTitle">শেয়ার (%)</p>

                          <FtextField
                            key={"reseller"}
                            type="number"
                            label="রিসেলার"
                            name="commissionRate"
                            // value={reseller.commissionRate}
                            min={0}
                          />
                        </div>
                      </div>
                    </div>

                    <b className="mt-2">মাইক্রোটিক সিলেক্ট</b>
                    <div className="AllAreaClass">
                      {mikrotik?.map((val, key) => (
                        <div key={key} className="displayFlex">
                          <input
                            type="checkbox"
                            className="getValueUsingClassesforMikrotik"
                            value={val.id}
                            checked={
                              allowedMikrotik?.includes(val.id) ? true : false
                            }
                            onChange={(e) => setMikrotikHandler(e.target.value)}
                          />
                          <label>{val.name}</label>
                        </div>
                      ))}
                    </div>

                    {/* area */}
                    <b className="mt-2">এরিয়া সিলেক্ট</b>
                    <div className="AllAreaClass">
                      {area?.map((val, key) => (
                        <div key={key}>
                          <h6 className="areaParent">{val.name}</h6>
                          {val.subAreas.map((v, k) => (
                            <div key={k} className="displayFlex">
                              <input
                                type="checkbox"
                                className="getValueUsingClass_Edit"
                                value={v.id}
                                checked={
                                  allowedAreas?.includes(v.id) ? true : false
                                }
                                onChange={setAreaHandler}
                              />
                              <label>{v.name}</label>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>

                    <div className="modal-footer modalFooterEdit">
                      <button
                        type="submit"
                        className="btn btn-success"
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader /> : "সেভ করুন"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        disabled={isLoading}
                      >
                        বাতিল করুন
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
