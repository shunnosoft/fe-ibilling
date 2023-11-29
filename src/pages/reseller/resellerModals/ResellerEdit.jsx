import React, { useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";
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
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Tab,
  Tabs,
} from "react-bootstrap";
import GlobalPackage, {
  PackageBasedEdit,
} from "./ResellerEdit/ResellerPackageEdit";
import GlobalPackageEditWithOutMkt, {
  PackageBasedEditWithOutMkt,
} from "./ResellerEdit/ResellerEditWihoutMkt";
import { resellerPermissions } from "./resellerPermission";

const ResellerEdit = ({ show, setShow, resellerId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.persistedReducer.auth.currentUser);
  const area = useSelector((state) => state.area.area);
  const storeSubArea = useSelector((state) => state.area?.subArea);
  const allReseller = useSelector((state) => state?.reseller?.reseller);

  // single reseller find form redux store data
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

  // commission share in isp & reseller state
  const [ispCommission, setIspCommission] = useState("");

  const [permissions, setPermissions] = useState([]);

  //ispOwner customer type data state
  const [customerType, setCustomerType] = useState([]);

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
      setIspCommission(reseller?.commissionRate?.isp);
      setCustomerType(reseller?.customerType);

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

  // modal close handler
  const closeHandler = () => setShow(false);

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
        customerType,
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

      if (!customerType.length) {
        alert(t("pleaseSelectCustomerType"));
        return;
      }

      editReseller(dispatch, sendingData, setIsLoading, setShow);
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

    let selectArea = storeSubArea.filter((item) => item.area === id);
    let areaSubArea = selectArea?.map((sub) => sub.id);

    if (checked) {
      let selectData = [...allowedAreas];
      for (let i = 0; i < areaSubArea.length; i++) {
        if (!selectData.includes(areaSubArea[i])) {
          selectData.push(areaSubArea[i]);
        }
      }
      setAllowedAreas(selectData);
      setAreaIds_Edit(selectData);
    } else {
      let data = [...allowedAreas];
      for (let i = 0; i < areaSubArea.length; i++) {
        if (data.includes(areaSubArea[i])) {
          data = data.filter((sub) => sub !== areaSubArea[i]);
        }
      }
      setAllowedAreas(data);
      setAreaIds_Edit(data);
    }
  };

  // handle form onChange
  const handleOnchange = (e) => {
    if (e.target.name === "commissionRate") {
      setIspCommission(100 - e.target.value);
    }
  };

  //reseller customer type handler
  const customerTypeHandler = (e) => {
    let customerTypeData = [...customerType];

    if (customerTypeData.includes(e.target.value)) {
      customerTypeData = customerTypeData.filter(
        (value) => value !== e.target.value
      );
    } else if (!customerTypeData.includes(e.target.value)) {
      customerTypeData.push(e.target.value);
    }
    setCustomerType(customerTypeData);
  };

  return (
    <>
      <Modal
        show={show}
        onHide={closeHandler}
        backdrop="static"
        keyboard={false}
        size="xl"
      >
        <ModalHeader closeButton>
          <ModalTitle>
            <h5 className="modal-title" id="exampleModalLabel">
              {reseller?.name}
            </h5>
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
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
            {() => (
              <Form id="resellerEdit" onChange={handleOnchange}>
                <Tabs
                  defaultActiveKey={"basic"}
                  id="uncontrolled-tab-example"
                  className="mb-3"
                >
                  <Tab eventKey="basic" title={t("basic")}>
                    <div className="d-flex justify-content-center">
                      {/* Basic part */}
                      <div className="displayGrid col-6">
                        {RPD.map((val, key) => (
                          <FtextField
                            key={key}
                            type={val.type}
                            label={val.label}
                            name={val.name}
                          />
                        ))}

                        {/* <div>
                          <p className="radioTitle">{t("customerType")}</p>
                          <div className="d-inline-flex">
                            <div className="form-check me-3">
                              <Field
                                className="form-check-input"
                                type="checkbox"
                                id="pppoe-customer"
                                value="pppoe"
                                checked={customerType.includes("pppoe")}
                                onChange={customerTypeHandler}
                              />
                              <label
                                className="form-check-label"
                                for="pppoe-customer"
                              >
                                {t("pppoe")}
                              </label>
                            </div>
                            <div className="form-check me-3">
                              <Field
                                className="form-check-input"
                                type="checkbox"
                                id="static-customer"
                                value="static"
                                checked={customerType.includes("static")}
                                onChange={customerTypeHandler}
                              />
                              <label
                                className="form-check-label"
                                for="static-customer"
                              >
                                {t("static")}
                              </label>
                            </div>
                            <div className="form-check">
                              <Field
                                className="form-check-input"
                                type="checkbox"
                                id="hotspot-customer"
                                value="hotspot"
                                checked={customerType.includes("hotspot")}
                                onChange={customerTypeHandler}
                              />
                              <label
                                className="form-check-label"
                                for="hotspot-customer"
                              >
                                {t("hotspot")}
                              </label>
                            </div>
                          </div>
                        </div> */}

                        <div>
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
                            className="form-check"
                          >
                            <input
                              type="checkbox"
                              className="form-check-input"
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
                                <div key={k} className="form-check my-1">
                                  <input
                                    type="checkbox"
                                    id={v.id + v.name}
                                    className="form-check-input getValueUsingClass_Edit me-2"
                                    name="subArea"
                                    value={v.id}
                                    checked={allowedAreas?.includes(v.id)}
                                    onChange={setAreaHandler}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor={v.id + v.name}
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

                  {/* package part */}
                  <Tab eventKey="package" title={t("package")}>
                    <div className="d-flex mt-3 justify-content-evenly">
                      <div className="form-check ">
                        <p className="radioTitle">{t("commissionType")}</p>
                        <div className="d-flex">
                          <div className="form-check">
                            <FtextField
                              label={t("globalCommission")}
                              id="global"
                              className="form-check-input"
                              type="radio"
                              name="global"
                              value="global"
                              checked={commissionType === "global"}
                              onChange={(e) =>
                                setCommissionType(e.target.value)
                              }
                            />
                          </div>
                          <div className="form-check">
                            <FtextField
                              label={t("packageBased")}
                              id="packageBased"
                              className="form-check-input"
                              type="radio"
                              name="packageBased"
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
                    <div className="d-flex justify-content-center">
                      {commissionType === "global" && (
                        <div className="d-flex w-50">
                          <div className="form-check">
                            <p className="radioTitle"> {t("share")} </p>

                            <FtextField
                              style={{ marginTop: "-25px" }}
                              key="commissionRate"
                              type="number"
                              name="commissionRate"
                              min={0}
                            />
                          </div>

                          <div className="form-check">
                            <p className="radioTitle">{t("ispOwner")} (%)</p>

                            <FtextField
                              style={{ marginTop: "-25px" }}
                              key="isp"
                              type="number"
                              name="isp"
                              value={ispCommission}
                              min={0}
                              disabled={true}
                            />
                          </div>
                        </div>
                      )}
                      {commissionType === "packageBased" && (
                        <div className="form-check w-50">
                          <p className="radioTitle">{t("ispOwnerShare")}</p>
                          <select
                            type="number"
                            className="form-select mw-100 mt-0"
                            onChange={(e) => setPackageRateType(e.target.value)}
                          >
                            <option selected value="">
                              {t("selectType")}
                            </option>
                            <option
                              selected={packageRateType === "percentage"}
                              value="percentage"
                            >
                              {t("percentage")}
                            </option>
                            <option
                              selected={packageRateType === "fixedRate"}
                              value="fixedRate"
                            >
                              {t("fixedRate")}
                            </option>
                          </select>
                        </div>
                      )}
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
                                handelMikrotikPakages={handelMikrotikPakages}
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

                  <Tab eventKey="permission" title={t("changePermission")}>
                    <div className="displayGrid3 secondSection text-start">
                      <div className="permission-section">
                        <input
                          id="permissionEdit"
                          type="checkbox"
                          className="form-check-input"
                          onChange={handleChange}
                          name="allChecked"
                          checked={permissions.every((item) => item.isChecked)}
                        />
                        <label
                          htmlFor="permissionEdit"
                          className="form-check-label"
                        >
                          <p className="radioTitle ms-1">
                            {t("allPermission")}
                          </p>
                        </label>
                      </div>
                      {permissions.map((val, key) => {
                        return (
                          <div key={val + "" + key} className="displayFlex">
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
                  </Tab>
                </Tabs>
              </Form>
            )}
          </Formik>
        </ModalBody>
        <ModalFooter>
          <button type="reset" className="d-none" id="resetBtn">
            {isLoading ? <Loader /> : t("save")}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={isLoading}
            onClick={closeHandler}
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            className="btn btn-success"
            form="resellerEdit"
            disabled={ispOwnerId === "624f41a4291af1f48c7d75c7"}
          >
            {isLoading ? <Loader /> : t("save")}
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ResellerEdit;
