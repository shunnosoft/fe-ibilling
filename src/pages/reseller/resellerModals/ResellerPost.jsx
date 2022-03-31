import React, { useState } from "react";
import { Form, Formik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import * as Yup from "yup";

// internal imports
import "../reseller.css";
import "../../collector/collector.css";
import { FtextField } from "../../../components/common/FtextField";
import { RADIO, RPD } from "../resellerData";
import Loader from "../../../components/common/Loader";
import { postReseller } from "../../../features/apiCalls";
// import { postReseller, fetchReseller } from "../../../features/resellerSlice";

export default function ResellerPost() {
  // const [Check, setCheck] = useState(RBD);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();
  const area = useSelector((state) => state.area.area);
  const mikrotik = useSelector(state=>state.mikrotik.mikrotik)

  const [areaIds, setAreaIds] = useState([]);
  const [mikrotikIds, setMikrotikIds] = useState([]);

  //validator
  const resellerValidator = Yup.object({
    name: Yup.string().required("নাম দিন"),
    mobile: Yup.string()
      .min(11, "এগারো  ডিজিট এর সঠিক নম্বর দিন ")
      .max(11, "এগারো  ডিজিট এর বেশি হয়ে গেছে ")
      .required("মোবাইল নম্বর দিন "),
    email: Yup.string()
      .email("ইমেইল সঠিক নয় ")
      .required("ম্যানেজার এর ইমেইল দিতে হবে"),
    nid: Yup.string().required("NID দিন"),
    website: Yup.string().required("ওয়েবসাইট না থাকলে 'N/A' দিন "),
    address: Yup.string().required("ফিল্ড ফাঁকা রাখা যাবে বা (N/A) দিন"),
    billCollectionType: Yup.string().required("****"),
    status: Yup.string().required("****"),
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

  const resellerHandler = async (data) => {
    

    if (auth.ispOwner) {
      const sendingData = {
        ...data,
        ispOwner: auth.ispOwner.id,
      };
      postReseller(dispatch,sendingData, setIsLoading)
     

      
    }
  };
  

  const setAreaHandler = () => {
    const temp = document.querySelectorAll(".getValueUsingClass");
    let IDS_temp = [];
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].checked === true) {
        IDS_temp.push(temp[i].value);
      }
    }
    // console.log("IDS: ", IDS_temp);
    setAreaIds(IDS_temp);
  };

const setMikrotikHandler=(e) =>{
  
   const temp = document.querySelectorAll(".getValueUsingClasses");
    let IDS_temp = [];
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].checked === true) {
        IDS_temp.push(temp[i].value);
      }
    }
    console.log("IDS: ", IDS_temp);
    setMikrotikIds(IDS_temp);
}
  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="resellerModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                নতুন রি-সেলার অ্যাড করুন
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
                  name: "", //*
                  mobile: "", //*
                  email: "", //*
                  nid: "", //*
                  website: "",
                  address: "",
                  billCollectionType: "", // ['prepaid', 'postpaid', 'both'], /*
                  status: "", //['new', 'active', 'inactive', 'banned', 'deleted'],
                  // rechargeBalance: "", //number
                  // smsRate: "", //number
                  // commissionRate: "", //number
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
                        <div className="form-check ">
                          <p className="radioTitle">বিল গ্রহণের ধরণ</p>

                          <div className="form-check">
                            <FtextField
                              label="Prepaid"
                              className="form-check-input"
                              type="radio"
                              name="billCollectionType"
                              value="prepaid"
                            />
                          </div>
                          <div className="form-check">
                            <FtextField
                              label="Postpaid"
                              className="form-check-input"
                              type="radio"
                              name="billCollectionType"
                              value="postpaid"
                            />
                          </div>
                          <div className="form-check">
                            <FtextField
                              label="Both"
                              className="form-check-input"
                              type="radio"
                              name="billCollectionType"
                              value="both"
                            />
                          </div>
                        </div>

                        <hr />

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
                      </div>
                    </div>

                    <b className="mt-2">মাইক্রোটিক সিলেক্ট</b>
                    <div className="AllAreaClass">
                      {mikrotik?.map((val, key) => (
                        
                           
                            <div key={key}  className="displayFlex">
                              <input
                                type="checkbox"
                                className="getValueUsingClasses"
                                value={val.id}
                                onChange={(e)=>setMikrotikHandler(e.target.value)}
                              />
                              <label>{val.name}</label>
                           
                        
                        </div>
                      ))}
                    </div>
                    <b className="mt-2">এরিয়া সিলেক্ট</b>
                    <div className="AllAreaClass">
                      {area?.map((val, key) => (
                        <div key={key}>
                          <h6 className="areaParent">{val.name}</h6>
                          {val.subAreas.map((v, k) => (
                            <div key={k} className="displayFlex">
                              <input
                                type="checkbox"
                                className="getValueUsingClass"
                                value={v.id}
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
