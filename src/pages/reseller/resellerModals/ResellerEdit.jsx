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
import InformationTooltip from "../../../components/common/tooltipInformation/InformationTooltip";
import { areasSubareasChecked } from "../../staff/staffCustomFucn";

const ResellerEdit = ({ show, setShow, resellerId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

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

  // ispOwner all areas state
  const [areaSubareas, setAreaSubareas] = useState();

  //get all valid permissions from resellerPermissions
  useEffect(() => {
    if (reseller) {
      setMikrotikIds_Edit(reseller.mikrotiks);
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
    }
  }, [reseller]);

  useEffect(() => {
    if (!bpSettings.hasMikrotik) {
      getPackagewithoutmikrotik(ispOwnerId, dispatch, setIsLoading);
    }
  }, []);

  // ispOwner all areas subarea handle
  useEffect(() => {
    let temp = [];

    storeSubArea?.map((sub) => {
      if (reseller.subAreas?.includes(sub?.id)) {
        let subarea = {
          ...sub,
          isChecked: true,
        };
        temp.push(subarea);
      } else {
        let subarea = {
          ...sub,
          isChecked: false,
        };
        temp.push(subarea);
      }
    });

    // set ispOwner subAreas checked key include
    setAreaSubareas(temp);
  }, [reseller, storeSubArea]);

  // modal close handler
  const closeHandler = () => setShow(false);

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

  // select area handle for the collector
  const areaSubareaSelectHandler = ({ target }) => {
    const { name, checked, id } = target;

    let subAreas = [...areaSubareas];

    if (name === "area") {
      subAreas = subAreas.map((val) =>
        val.area === id ? { ...val, isChecked: checked } : val
      );
    } else {
      subAreas = subAreas.map((val) =>
        val.id === id ? { ...val, isChecked: checked } : val
      );
    }

    // set collector areas
    setAreaSubareas(subAreas);
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

  // handle form onChange
  const handleOnchange = (e) => {
    if (e.target.name === "commissionRate") {
      setIspCommission(100 - e.target.value);
    }
  };

  // select permission handle for the manager
  const resellerPermissionHandler = (e) => {
    const { name, checked } = e.target;

    //  temporary state set collector single & multiple permission
    let temp = [...permissions];

    if (name === "allPermissions") {
      temp = temp.map((val) => ({ ...val, isChecked: checked }));
    } else {
      temp = temp.map((val) =>
        val.value === name ? { ...val, isChecked: checked } : val
      );
    }

    // set manager permissions state
    setPermissions(temp);
  };

  //submit handler
  const resellerHandler = (data) => {
    // if (areaSubareas.filter((val) => val.isChecked).length === 0) {
    //   setIsLoading(false);
    //   toast.warn(t("selectArea"));
    //   return;
    // }

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
        subAreas: areaSubareas
          .filter((val) => val.isChecked)
          .map((val) => val.id),
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

      // if (!customerType.length) {
      //   alert(t("pleaseSelectCustomerType"));
      //   return;
      // }

      editReseller(dispatch, sendingData, setIsLoading, setShow);
    }
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
                  {/* reseller profile information tab start */}
                  <Tab eventKey="basic" title={t("profile")}>
                    <div className="d-flex justify-content-center">
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
                  {/* reseller profile information tab end */}

                  {/* reseller user areas tab start */}
                  <Tab eventKey="area" title={t("area")}>
                    <b className="mt-2"> {t("selectArea")} </b>
                    <div className="AllAreaClass">
                      {area?.map((val, key) => (
                        <div key={key}>
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              name="area"
                              id={val.id}
                              onChange={areaSubareaSelectHandler}
                              checked={
                                areaSubareas &&
                                areasSubareasChecked(val.id, areaSubareas)
                              }
                            />

                            <label htmlFor={val.id} className="areaParent ms-1">
                              {val.name}
                            </label>
                          </div>

                          {areaSubareas?.map(
                            (subarea, k) =>
                              subarea.area === val.id && (
                                <div key={k} className="displayFlex">
                                  <input
                                    type="checkbox"
                                    id={subarea.id}
                                    onChange={areaSubareaSelectHandler}
                                    checked={subarea.isChecked}
                                  />

                                  <label
                                    htmlFor={subarea.id}
                                    className="text-secondary"
                                  >
                                    {subarea.name}
                                  </label>
                                </div>
                              )
                          )}
                        </div>
                      ))}
                    </div>
                  </Tab>
                  {/* reseller user areas tab end */}

                  {/* reseller user packages tab start */}
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
                  {/* reseller user packages tab end */}

                  {/* reseller permissions tab start */}
                  <Tab eventKey="permission" title={t("changePermission")}>
                    <div className="displayGrid3">
                      <div className="CheckboxContainer">
                        <input
                          type="checkbox"
                          className="CheckBox"
                          name="allPermissions"
                          onChange={resellerPermissionHandler}
                          id="selectAllPermissions"
                          checked={permissions.every((item) => item.isChecked)}
                        />
                        <label
                          htmlFor="selectAllPermissions"
                          className="checkboxLabel text-info fw-bold"
                        >
                          {t("allPermission")}
                        </label>
                      </div>

                      {permissions.map((val, key) => (
                        <div
                          className="CheckboxContainer d-flex justify-content-between"
                          key={key}
                        >
                          <div>
                            <input
                              type="checkbox"
                              className="CheckBox"
                              name={val.value}
                              checked={val.isChecked}
                              onChange={resellerPermissionHandler}
                              id={val.value + key}
                            />
                            <label
                              htmlFor={val.value + key}
                              className="checkboxLabel"
                            >
                              {val.label}
                            </label>
                          </div>

                          {/* there is information to grant permission tooltip */}
                          {val?.info && <InformationTooltip data={val} />}
                        </div>
                      ))}
                    </div>
                  </Tab>
                  {/* reseller permissions tab end */}
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
