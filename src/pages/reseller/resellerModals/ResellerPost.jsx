import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import * as Yup from "yup";

// internal imports
import "../reseller.css";
import "../../collector/collector.css";
import { FtextField } from "../../../components/common/FtextField";
import {
  RADIO,
  resellerPermissionBan,
  resellerPermissionEng,
  RPD,
} from "../resellerData";
import Loader from "../../../components/common/Loader";
import {
  getPackagewithoutmikrotik,
  postReseller,
} from "../../../features/apiCalls";
import { useTranslation } from "react-i18next";
// import { postReseller, fetchReseller } from "../../../features/resellerSlice";

export default function ResellerPost() {
  const { t } = useTranslation();
  // const [Check, setCheck] = useState(RBD);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useSelector((state) => state.persistedReducer.auth.currentUser);
  const dispatch = useDispatch();
  const area = useSelector((state) => state.area.area);
  // const mikrotik = useSelector((state) => state.mikrotik.mikrotik);
  const mikrotikpakages = useSelector(
    (state) => state.reseller.allMikrotikPakages
  );
  const [areaIds, setAreaIds] = useState([]);
  const [mikrotikIds, setMikrotikIds] = useState([]);
  const [mikroTikPackagesId, setmikroTikPackagesId] = useState([]);
  const [commissionType, setCommissionType] = useState("");
  const [packageRateType, setPackageRateType] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [packageCommisson, setPackageCommission] = useState([]);

  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.userData?.bpSettings
  );

  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  const packages = useSelector((state) => state.package.packages);

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

  useEffect(() => {
    if (!bpSettings.hasMikrotik) {
      getPackagewithoutmikrotik(ispOwnerId, dispatch, setIsLoading);
    }
    if (localStorage.getItem("netFee:lang") === "en") {
      setPermissions(resellerPermissionEng);
    } else {
      setPermissions(resellerPermissionBan);
    }
  }, []);

  const permissionHandler = (e) => {
    const { name, checked } = e.target;
    if (name === "allChecked") {
      let temp = permissions.map((event) => ({ ...event, isChecked: checked }));
      setPermissions(temp);
    } else {
      let temp = permissions.map((event) =>
        event.value === name ? { ...event, isChecked: checked } : event
      );
      setPermissions(temp);
    }
  };

  const resellerHandler = async (data, resetForm) => {
    let commision = data.commissionRate;

    const permissionData = {};
    permissions.forEach((item) => {
      permissionData[item.value] = item.isChecked;
    });

    if (auth.ispOwner) {
      const sendingData = {
        ...data,
        ispOwner: auth.ispOwner.id,
        subAreas: areaIds,
        //todo backend
        billCollectionType: "prepaid",
        mikrotikPackages: mikroTikPackagesId,
        permission: permissionData,
        commissionType,
      };

      if (bpSettings.hasMikrotik) {
        sendingData.mikrotiks = mikrotikIds;
      }

      if (commissionType === "global") {
        sendingData.commissionRate = {
          reseller: commision,
          isp: 100 - commision,
        };
      }
      if (commissionType === "packageBased") {
        const commision = packageCommisson.filter((item) => item.ispOwnerRate);

        sendingData.commissionStyle = packageRateType;
        sendingData.resellerPackageRates = commision;
      }
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

  const handlePackageDividerInput = ({ target }) => {
    const packageCommissionState = [...packageCommisson];

    const existingRate = packageCommissionState.find(
      (item) => item.mikrotikPackage === target.name
    );

    if (existingRate) {
      existingRate.ispOwnerRate = target.value;
      packageCommissionState[
        packageCommissionState.findIndex(
          (item) => item.mikrotikPackage === target.name
        )
      ] = existingRate;
    } else {
      const data = {
        ispOwner: ispOwnerId,
        ispOwnerRate: target.value,
        mikrotikPackage: target.name,
      };
      packageCommissionState.push(data);
    }

    setPackageCommission(packageCommissionState);
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
                      <div className="secondSection text-start">
                        <p className="radioTitle">
                          পারমিশন দিন
                          <input
                            id="souceCheck"
                            type="checkbox"
                            onChange={permissionHandler}
                            name="allChecked"
                          />
                        </p>

                        {permissions.map((item, i) => (
                          <div key={i} className="displayFlex">
                            <input
                              id={i + "" + item}
                              key={i}
                              type="checkbox"
                              className="form-check-input"
                              checked={item.isChecked}
                              onChange={permissionHandler}
                              name={item.value}
                            />
                            <label htmlFor={i + "" + item}>{item.label}</label>
                          </div>
                        ))}
                      </div>
                    </div>{" "}
                    {/* Status */}
                    <div className="d-flex mt-5 justify-content-evenly">
                      <div className="form-check ">
                        <p className="radioTitle">{t("status")}</p>
                        <div className="d-flex">
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
                      <div className="form-check ">
                        <p className="radioTitle">কমিশন এর ধরণ</p>
                        <div className="d-flex">
                          <div className="form-check">
                            <FtextField
                              label="Global Commission"
                              className="form-check-input"
                              type="radio"
                              name="commissionType"
                              value="global"
                              checked={commissionType === "global"}
                              onChange={(e) =>
                                setCommissionType(e.target.value)
                              }
                            />
                          </div>
                          <div className="form-check">
                            <FtextField
                              label="Package Based"
                              className="form-check-input"
                              type="radio"
                              name="commissionType"
                              value="packageBased"
                              checked={commissionType === "packageBased"}
                              onChange={(e) =>
                                setCommissionType(e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-50 mb-4 mx-auto">
                      {commissionType === "global" && (
                        <div className="form-check ">
                          <p className="radioTitle"> {t("share")} </p>

                          <FtextField
                            key="commissionRate"
                            type="number"
                            name="commissionRate"
                            min={0}
                          />
                        </div>
                      )}
                      {commissionType === "packageBased" && (
                        <div className="form-check">
                          <p className="radioTitle"> {t("share")} </p>

                          <select
                            type="number"
                            className="form-select mw-100 mt-0"
                            onChange={(e) => setPackageRateType(e.target.value)}
                          >
                            <option value="">Select</option>

                            <option value="percentage">Percentage</option>
                            <option value="fixedRate">Fixed Rate</option>
                          </select>
                        </div>
                      )}
                    </div>
                    {bpSettings.hasMikrotik ? (
                      <>
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
                                <label htmlFor={item.id}>
                                  <b className="h5">{item.name}</b>
                                </label>
                              </h6>
                              <div className="d-flex flex-wrap">
                                {mikrotikpakages.packages.map(
                                  (p) =>
                                    p.mikrotik === item.id && (
                                      <div key={p.id} className="w-50 my-1">
                                        <input
                                          id={p.id}
                                          className="form-check-input me-2"
                                          disabled={
                                            !mikrotikIds.includes(p.mikrotik)
                                          }
                                          type="checkbox"
                                          value={p.id}
                                          onChange={handelMikrotikPakages}
                                        />
                                        <label
                                          htmlFor={p.id}
                                          className="form-check-label"
                                        >
                                          {p.name}
                                        </label>
                                        {commissionType === "packageBased" && (
                                          <>
                                            <div
                                              className={`d-flex align-items-center ${
                                                mikroTikPackagesId.includes(
                                                  p.id
                                                )
                                                  ? "d-block"
                                                  : "d-none"
                                              }`}
                                            >
                                              <input
                                                className={`form-control w-50 shadow-none m-1 ${
                                                  mikroTikPackagesId.includes(
                                                    p.id
                                                  )
                                                    ? "d-block"
                                                    : "d-none"
                                                }`}
                                                disabled={
                                                  !mikrotikIds.includes(
                                                    p.mikrotik
                                                  )
                                                }
                                                type="number"
                                                id={p.id}
                                                name={p.id}
                                                onChange={
                                                  handlePackageDividerInput
                                                }
                                                min={0}
                                                max={
                                                  packageRateType ===
                                                    "percentage" && 100
                                                }
                                                placeholder="Package Rate"
                                              />

                                              {packageRateType ===
                                              "percentage" ? (
                                                <p className="mx-1">%</p>
                                              ) : (
                                                <p className="mx-1">&#2547;</p>
                                              )}
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    )
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <b className="mt-2"> {t("package")} </b>
                        <div className="AllAreaClass">
                          <div className="d-flex flex-wrap">
                            {packages.map((p) => (
                              <div key={p.id} className="w-50 my-1">
                                <input
                                  id={p.id}
                                  className="form-check-input me-2"
                                  // disabled={!mikrotikIds.includes(p.mikrotik)}
                                  type="checkbox"
                                  value={p.id}
                                  onChange={handelMikrotikPakages}
                                />
                                <label
                                  htmlFor={p.id}
                                  className="form-check-label"
                                >
                                  {p.id}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
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
