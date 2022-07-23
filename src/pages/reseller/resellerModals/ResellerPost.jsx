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
import { postReseller } from "../../../features/apiCalls";
import { useTranslation } from "react-i18next";
// import { postReseller, fetchReseller } from "../../../features/resellerSlice";

export default function ResellerPost() {
  const { t } = useTranslation();
  // const [Check, setCheck] = useState(RBD);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useSelector((state) => state.persistedReducer.auth.currentUser);
  const dispatch = useDispatch();
  const area = useSelector((state) => state.persistedReducer.area.area);
  const mikrotik = useSelector(
    (state) => state.persistedReducer.mikrotik.mikrotik
  );
  const mikrotikpakages = useSelector(
    (state) => state.persistedReducer.reseller.allMikrotikPakages
  );
  const [areaIds, setAreaIds] = useState([]);
  const [mikrotikIds, setMikrotikIds] = useState([]);
  const [mikroTikPackagesId, setmikroTikPackagesId] = useState([]);

  //validator
  const resellerValidator = Yup.object({
    name: Yup.string().required(t("enterName")),
    mobile: Yup.string()
      .min(11, t("write11DigitMobileNumber"))
      .max(11, t("over11DigitMobileNumber"))
      .required(t("writeMobileNumber")),
    email: Yup.string().email(t("incorrectEmail")),
    nid: Yup.string(),
    website: Yup.string(),
    address: Yup.string(),

    status: Yup.string().required(t("selectStatus")),
    commissionRate: Yup.number()
      .integer()
      .min(0, t("minimumShare"))
      .max(100, t("maximumShare"))
      .required(t("enterResellerShare")),
  });

  const resellerHandler = async (data, resetForm) => {
    let commision = data.commissionRate;
    if (auth.ispOwner) {
      const sendingData = {
        ...data,
        ispOwner: auth.ispOwner.id,
        subAreas: areaIds,
        //todo backend
        mikrotiks: mikrotikIds,
        billCollectionType: "prepaid",
        mikrotikPackages: mikroTikPackagesId,
      };

      sendingData.commissionRate = {
        reseller: commision,
        isp: 100 - commision,
      };

      postReseller(dispatch, sendingData, setIsLoading, resetForm);
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

  const setMikrotikHandler = (e) => {
    const temp = document.querySelectorAll(".getValueUsingClasses");
    let IDS_temp = [];
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].checked === true) {
        IDS_temp.push(temp[i].value);
      }
    }

    setMikrotikIds(IDS_temp);
  };

  const handelMikrotikPakages = (e) => {
    let newArray = [...mikroTikPackagesId, e.target.value];
    if (mikroTikPackagesId.includes(e.target.value)) {
      newArray = newArray.filter((item) => item !== e.target.value);
    }
    setmikroTikPackagesId(newArray);
  };

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
                {t("addNewReseller")}
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
                  email: "",
                  nid: "",
                  website: "",
                  address: "",
                  status: "active",
                  commissionRate: 0,
                }}
                validationSchema={resellerValidator}
                onSubmit={(values, { resetForm }) => {
                  resellerHandler(values, resetForm);
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
                          <p className="radioTitle">{t("status")}</p>
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
                          <p className="radioTitle"> {t("share")} </p>

                          <FtextField
                            key="commissionRate"
                            type="number"
                            label={t("reseller")}
                            name="commissionRate"
                            min={0}
                          />
                        </div>
                      </div>
                    </div>

                    <b className="mt-2"> {t("selectMikrotik")} </b>
                    <div className="AllAreaClass">
                      {mikrotikpakages?.mikrotiks?.map((item) => (
                        <div key={item.id}>
                          <h6 className="areaParent ">
                            <input
                              type="checkbox"
                              className="getValueUsingClasses"
                              value={item.id}
                              onChange={(e) =>
                                setMikrotikHandler(e.target.value)
                              }
                            />{" "}
                            <label>
                              <b className="h5">{item.name}</b>
                            </label>
                          </h6>
                          {mikrotikpakages.packages.map(
                            (p) =>
                              p.mikrotik === item.id && (
                                <div key={p.id} className="displayFlex">
                                  <input
                                    disabled={!mikrotikIds.includes(p.mikrotik)}
                                    type="checkbox"
                                    value={p.id}
                                    onChange={handelMikrotikPakages}
                                  />
                                  <label>{p.name}</label>
                                </div>
                              )
                          )}
                        </div>
                      ))}
                    </div>
                    <b className="mt-2"> {t("selectArea")} </b>
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
                        {isLoading ? <Loader /> : t("save")}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        disabled={isLoading}
                      >
                        {t("cancel")}
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
