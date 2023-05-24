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
import {
  editReseller,
  getPackagewithoutmikrotik,
} from "../../../features/apiCalls";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Tab, Tabs } from "react-bootstrap";
import GlobalPackage, {
  PackageBasedEdit,
} from "./ResellerEdit/ResellerPackageEdit";
import GlobalPackageEditWithOutMkt, {
  PackageBasedEditWithOutMkt,
} from "./ResellerEdit/ResellerEditWihoutMkt";
import { resellerPermissions } from "./resellerPermission";
// import { editReseller, fetchReseller } from "../../../features/resellerSlice";

export default function ResellerEdit({ resellerId }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.persistedReducer.auth.currentUser);
  const area = useSelector((state) => state.area.area);
  const storeSubArea = useSelector((state) => state.area?.subArea);
  const allReseller = useSelector((state) => state?.reseller?.reseller);
  const reseller = allReseller.find((val) => {
    return val.id === resellerId;
  });

  //get ispOwner Info
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // get bp settings
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData?.bpSettings
  );

  //get packages
  const packages = useSelector((state) => state.package.packages);

  const [isLoading, setIsLoading] = useState(false);
  const [allowedAreas, setAllowedAreas] = useState([]);
  const [areaIds_Edit, setAreaIds_Edit] = useState([]);
  const [allowedMikrotik, setAllowedMikrotik] = useState([]);
  const [mikrotikIds_Edit, setMikrotikIds_Edit] = useState([]);
  const [mikroTikPackagesId, setmikroTikPackagesId] = useState([]);
  const [commissionType, setCommissionType] = useState("");
  const [packageRateType, setPackageRateType] = useState("");
  const [packageCommisson, setPackageCommission] = useState([]);
  const [clonePackageCommission, setClonePackageCommission] = useState([]);

  const [permissions, setPermissions] = useState([]);

  //get all valid permissions from resellerPermissions
  useEffect(() => {
    // let resellerPermissionLang = [];

    // if (localStorage.getItem("netFee:lang") === "en") {
    //   resellerPermissionLang = resellerPermissionEng;
    // } else {
    //   resellerPermissionLang = resellerPermissionBan;
    // }

    if (reseller) {
      setMikrotikIds_Edit(reseller.mikrotiks);
      setAreaIds_Edit(reseller.subAreas);
      setAllowedAreas(reseller.subAreas);
      setAllowedMikrotik(reseller.mikrotiks);
      setmikroTikPackagesId(reseller.mikrotikPackages);
      setCommissionType(reseller.commissionType);
      setPackageRateType(reseller.commissionStyle);
      setPackageCommission(reseller.resellerPackageRates);
      setClonePackageCommission(reseller.resellerPackageRates);

      const perms = resellerPermissions(reseller.permission, bpSettings);
      const filterdPermission = perms.filter((p) => p.disabled === false);
      setPermissions(filterdPermission);

      // const temp = resellerPermissionLang.map((item) => {
      //   return { ...item, isChecked: reseller.permission[item.value] };
      // });
      // setPermissions(temp);
    }
  }, [reseller]);

  useEffect(() => {
    if (!bpSettings.hasMikrotik) {
      getPackagewithoutmikrotik(ispOwnerId, dispatch, setIsLoading);
    }
  }, []);

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
      .min(1, t("minimumShare"))
      .max(99, t("maximumShare"))
      .required(t("enterResellerShare")),
  });

  const handleChange = (e) => {
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

  //submit handler
  const resellerHandler = (data) => {
    let commision = data.commissionRate;
    if (auth.ispOwner) {
      const permissionData = {};
      permissions.forEach((item) => {
        permissionData[item.value] = item.isChecked;
      });
      const sendingData = {
        ...data,
        ispOwner: reseller.ispOwner,
        ispId: reseller.ispOwner,
        resellerId: reseller.id,
        subAreas: areaIds_Edit,
        mikrotikPackages: mikroTikPackagesId,
        permission: permissionData,
        commissionType,
      };

      if (data.status === "inactive") {
        const customerInActiveConfirm = window.confirm(
          t("areYouWantToInactiveResellerCustomer")
        );
        if (customerInActiveConfirm) {
          sendingData.customerInactive = true;
        }
      }

      if (bpSettings.hasMikrotik) {
        sendingData.mikrotiks = mikrotikIds_Edit;
      }

      sendingData.commissionRate = {
        reseller: commision,
        isp: 100 - commision,
      };
      if (commissionType === "packageBased") {
        const matchedPackageIds = mikrotikpakages.packages
          .map((mtkPackage) => {
            if (mikroTikPackagesId.includes(mtkPackage.id))
              return mtkPackage.id;
          })
          .filter((item) => item);

        let errorFlag = false,
          msg;
        matchedPackageIds.map((id) => {
          let commission = packageCommisson.find(
            (rateItem) => rateItem.mikrotikPackage == id
          );

          if (!commission) {
            errorFlag = true;
            msg = "প্যাকেজ রেট পূরণ করুন।";
          } else {
            if (commission.ispOwnerRate == "") {
              errorFlag = true;
              msg = "প্যাকেজ রেট ফাঁকা রাখা যাবে না।";
            } else {
              let foundPackage = mikrotikpakages.packages.find(
                (pack) => pack.id == commission.mikrotikPackage
              );

              if (
                foundPackage &&
                foundPackage.rate < Number(commission.ispOwnerRate)
              ) {
                errorFlag = true;
                msg = "প্যাকেজ রেট সঠিক নয়।";
              }
            }
          }
        });

        if (errorFlag) {
          toast.error(msg);

          return;
        }

        const commision = packageCommisson.filter((item) => item.ispOwnerRate);
        sendingData.commissionStyle = packageRateType;
        sendingData.resellerPackageRates = commision;

        sendingData.mikrotikPackages = matchedPackageIds;
      }

      if (mikroTikPackagesId.length === 0) {
        toast.error("Please select a package");
        return;
      }
      editReseller(dispatch, sendingData, setIsLoading);
    }
  };

  //area handler
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

  //miktrotik handler
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

  //get mikrotik packages

  const mikrotikpakages = useSelector(
    (state) => state.reseller.allMikrotikPakages
  );

  //handle mikrotik packages
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
    const temp = { ...existingRate };
    if (existingRate) {
      temp.ispOwnerRate = target.value;
      packageCommissionState[
        packageCommissionState.findIndex(
          (item) => item.mikrotikPackage === target.name
        )
      ] = temp;
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

  // select area all subArea handler
  const resellerAreaSubAreaHandle = (e) => {
    const { id, checked } = e.target;
    if (checked) {
      let selectArea = storeSubArea.filter((item) => item.area === id);
      let areaSubArea = selectArea?.map((sub) => sub.id);

      let selectData = [...allowedAreas];
      for (let i = 0; i < areaSubArea.length; i++) {
        if (!selectData.includes(areaSubArea[i])) {
          selectData.push(areaSubArea[i]);
        }
      }
      setAllowedAreas(selectData);
      setAreaIds_Edit(selectData);
    } else {
      const areaSelect = storeSubArea.filter((item) => item.area === id);
      const areaSubAreaSelect = areaSelect?.map((sub) => sub.id);

      let data = [...allowedAreas];
      for (let i = 0; i < areaSubAreaSelect.length; i++) {
        if (data.includes(areaSubAreaSelect[i])) {
          data = data.filter((sub) => sub !== areaSubAreaSelect[i]);
        }
      }
      setAllowedAreas(data);
      setAreaIds_Edit(data);
    }
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
                {t("editReseller")}
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
                  name: reseller?.name || "",
                  mobile: reseller?.mobile || "",
                  email: reseller?.email || "",
                  nid: reseller?.nid || "",
                  website: reseller?.website || "",
                  address: reseller?.address || "",
                  commissionRate: reseller?.commissionRate?.reseller || 1,
                  status: reseller?.status || "",
                }}
                validationSchema={resellerValidator}
                onSubmit={(values) => {
                  resellerHandler(values);
                }}
                enableReinitialize
              >
                {(formik) => (
                  <Form>
                    <Tabs
                      defaultActiveKey={"basic"}
                      id="uncontrolled-tab-example"
                      className="mb-3"
                    >
                      <Tab eventKey="basic" title={t("basic")}>
                        <div className="TakesInputFields">
                          {/* Basic part */}
                          <div>
                            {RPD.map((val, key) => (
                              <FtextField
                                key={key}
                                type={val.type}
                                label={val.label}
                                name={val.name}
                                // disabled={val.disabled}
                              />
                            ))}
                          </div>

                          <div className="secondSection text-start">
                            <div className="permission-section">
                              <input
                                id="permissionEdit"
                                type="checkbox"
                                className="form-check-input"
                                onChange={handleChange}
                                name="allChecked"
                                checked={permissions.every(
                                  (item) => item.isChecked
                                )}
                              />
                              <label
                                htmlFor="permissionEdit"
                                className="form-check-label"
                              >
                                <p className="radioTitle ms-1">পারমিশন দিন</p>
                              </label>
                              {permissions.map((val, key) => {
                                return (
                                  <div
                                    key={val + "" + key}
                                    className="displayFlex"
                                  >
                                    <input
                                      id={key + "reseller" + val}
                                      key={val + "" + key}
                                      type="checkbox"
                                      className="form-check-input"
                                      checked={val.isChecked}
                                      onChange={handleChange}
                                      name={val.value}
                                    />
                                    <label htmlFor={key + "reseller" + val}>
                                      {val.label}
                                    </label>
                                  </div>
                                );
                              })}
                            </div>

                            <div className="status_section mt-3">
                              <p className="radioTitle">{t("status")}</p>
                              <div className="form-check ps-0">
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
                            </div>
                          </div>
                        </div>
                      </Tab>
                      {/* end basic part */}

                      {/* package part */}
                      <Tab eventKey="package" title={t("package")}>
                        <div className="d-flex mt-3 justify-content-evenly">
                          <div className="form-check ">
                            <p className="radioTitle">কমিশন এর ধরণ</p>
                            <div className="d-flex">
                              <div className="form-check">
                                <FtextField
                                  label="Global Commission"
                                  className="form-check-input"
                                  type="radio"
                                  name="commissionType"
                                  submit
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
                          <div className="w-50 mb-3 mx-auto">
                            {commissionType === "global" && (
                              <div className="form-check ">
                                <p className="radioTitle"> {t("share")} </p>

                                <FtextField
                                  style={{ marginTop: "-25px" }}
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
                                  onChange={(e) =>
                                    setPackageRateType(e.target.value)
                                  }
                                >
                                  <option selected value="">
                                    Select
                                  </option>

                                  <option
                                    selected={packageRateType === "percentage"}
                                    value="percentage"
                                  >
                                    Percentage
                                  </option>
                                  <option
                                    selected={packageRateType === "fixedRate"}
                                    value="fixedRate"
                                  >
                                    Fixed Rate
                                  </option>
                                </select>
                              </div>
                            )}
                          </div>
                        </div>

                        {bpSettings.hasMikrotik ? (
                          <>
                            <b className="mt-2"> {t("selectMikrotik")} </b>
                            <div className="AllAreaClass">
                              {commissionType === "packageBased" ? (
                                <PackageBasedEdit
                                  packageCommisson={packageCommisson}
                                  packageRateType={packageRateType}
                                  mikrotikpakages={mikrotikpakages}
                                  allowedMikrotik={allowedMikrotik}
                                  reseller={reseller}
                                  mikroHandler={setMikrotikHandler}
                                  handelMikrotikPakages={handelMikrotikPakages}
                                  mikroTikPackagesId={mikroTikPackagesId}
                                  commissionType={commissionType}
                                  handlePackageDividerInput={
                                    handlePackageDividerInput
                                  }
                                />
                              ) : (
                                <>
                                  <GlobalPackage
                                    allowedMikrotik={allowedMikrotik}
                                    resellerMikrotik={reseller?.mikrotiks}
                                    mikroHandler={setMikrotikHandler}
                                    mikrotikpakages={mikrotikpakages}
                                    handelMikrotikPakages={
                                      handelMikrotikPakages
                                    }
                                    mikroTikPackagesId={mikroTikPackagesId}
                                  />
                                </>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            <b className="mt-2"> {t("package")} </b>
                            <div className="AllAreaClass">
                              {commissionType === "packageBased" && (
                                <PackageBasedEditWithOutMkt
                                  packages={packages}
                                  packageCommisson={packageCommisson}
                                  packageRateType={packageRateType}
                                  mikroHandler={setMikrotikHandler}
                                  handelMikrotikPakages={handelMikrotikPakages}
                                  mikroTikPackagesId={mikroTikPackagesId}
                                  commissionType={commissionType}
                                  handlePackageDividerInput={
                                    handlePackageDividerInput
                                  }
                                />
                              )}

                              {commissionType === "global" && (
                                <GlobalPackageEditWithOutMkt
                                  packages={packages}
                                  handelMikrotikPakages={handelMikrotikPakages}
                                  mikroTikPackagesId={mikroTikPackagesId}
                                />
                              )}
                            </div>
                          </>
                        )}
                      </Tab>
                      {/* end package part */}

                      {/* area part */}
                      <Tab eventKey="area" title={t("area")}>
                        <b className="mt-2"> {t("selectArea")} </b>
                        <div className="AllAreaClass">
                          {area?.map((val, key) => (
                            <div key={key}>
                              <div
                                style={{
                                  cursor: "pointer",
                                }}
                                className="areaParent"
                              >
                                <input
                                  type="checkbox"
                                  className="getValueUsingClasses form-check-input"
                                  name="area"
                                  id={val.id}
                                  onChange={resellerAreaSubAreaHandle}
                                  isChecked
                                />
                                <label
                                  htmlFor={val.id}
                                  className="ms-2"
                                  style={{
                                    fontSize: "20px",
                                  }}
                                >
                                  {val.name}
                                </label>
                              </div>

                              {storeSubArea?.map(
                                (v, k) =>
                                  v.area === val.id && (
                                    <div key={k} className=" my-1">
                                      <input
                                        type="checkbox"
                                        id={v.area}
                                        className="getValueUsingClass_Edit me-2"
                                        name="subArea"
                                        value={v.id}
                                        checked={allowedAreas?.includes(v.id)}
                                        onChange={setAreaHandler}
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor={v.id}
                                      >
                                        {v.name}
                                      </label>
                                    </div>
                                  )
                              )}
                            </div>
                          ))}
                        </div>
                      </Tab>
                      {/* end area part */}
                    </Tabs>

                    <div className="modal-footer modalFooterEdit">
                      <button
                        type="submit"
                        className="btn btn-success"
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader /> : t("save")}
                      </button>
                      <button type="reset" className="d-none" id="resetBtn">
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
