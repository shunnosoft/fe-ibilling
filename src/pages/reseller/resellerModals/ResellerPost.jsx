import React, { useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Tab,
  Tabs,
} from "react-bootstrap";

// internal imports
import "../reseller.css";
import "../../collector/collector.css";
import { FtextField } from "../../../components/common/FtextField";
import { RADIO, RPD } from "../resellerData";
import Loader from "../../../components/common/Loader";
import {
  getPackagewithoutmikrotik,
  postReseller,
} from "../../../features/apiCalls";
import { resellerPermissions } from "./resellerPermission";
import useISPowner from "../../../hooks/useISPOwner";
// import { postReseller, fetchReseller } from "../../../features/resellerSlice";

const ResellerPost = ({ show, setShow }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  //reseller post validation
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
    isp: Yup.number()
      .integer()
      .min(0, t("minimumShare"))
      .max(100, t("maximumShare"))
      .required(t("enterResellerShare")),
    customerType: Yup.array(),
  });

  // get user & current user data form useISPOwner
  const { ispOwnerId, bpSettings } = useISPowner();

  const packages = useSelector((state) => state.package.packages);

  // const [Check, setCheck] = useState(RBD);
  const auth = useSelector((state) => state.persistedReducer.auth.currentUser);
  const area = useSelector((state) => state.area.area);

  // get all subAreas
  const storeSubArea = useSelector((state) => state.area?.subArea);

  // const mikrotik = useSelector((state) => state.mikrotik.mikrotik);
  const mikrotikpakages = useSelector(
    (state) => state.reseller.allMikrotikPakages
  );

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  const [areaIds, setAreaIds] = useState([]);
  const [mikrotikIds, setMikrotikIds] = useState([]);
  const [mikroTikPackagesId, setmikroTikPackagesId] = useState([]);
  const [commissionType, setCommissionType] = useState("");
  const [packageRateType, setPackageRateType] = useState("");

  // reseller permission state
  const [permissions, setPermissions] = useState([]);

  const [packageCommisson, setPackageCommission] = useState([]);

  // commission share in isp & reseller state
  const [ispCommission, setIspCommission] = useState("");

  //ispOwner customer type data state
  const [customerType, setCustomerType] = useState([]);

  useEffect(() => {
    if (!bpSettings.hasMikrotik) {
      getPackagewithoutmikrotik(ispOwnerId, dispatch, setIsLoading);
    }

    // reseller permission
    const perms = resellerPermissions("", bpSettings);
    const filterdPermission = perms.filter((p) => !p.disabled);
    setPermissions(filterdPermission);
  }, []);

  // modal close handler
  const closeHandler = () => setShow(false);

  // reseller permission handler
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
    if (!commissionType) {
      alert("Commision type must be selected !");
      return;
    }
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
        customerType,
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

      if (!customerType.length) {
        alert(t("pleaseSelectCustomerType"));
        return;
      }

      postReseller(dispatch, sendingData, setIsLoading, resetForm, setShow);
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
              {t("addNewReseller")}
            </h5>
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
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
              isp: 0,
            }}
            validationSchema={resellerValidator}
            onSubmit={(values, { resetForm }) => {
              resellerHandler(values, resetForm);
            }}
            enableReinitialize
          >
            {() => (
              <Form id="resellerPost" onChange={handleOnchange}>
                <Tabs
                  defaultActiveKey={"basic"}
                  id="uncontrolled-tab-example"
                  className="mb-3"
                >
                  <Tab eventKey="basic" title={t("basic")}>
                    <div className="d-flex justify-content-center">
                      <div className="displayGrid col-6">
                        {RPD.map((val, key) => (
                          <FtextField
                            key={key}
                            type={val.type}
                            label={val.label}
                            name={val.name}
                            validation={val.validation}
                          />
                        ))}

                        <div>
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
                        </div>

                        <div>
                          <p className="radioTitle">{t("status")}</p>
                          <div className="d-flex">
                            {RADIO.map((val, key) => (
                              <div key={key} className="form-check">
                                <FtextField
                                  label={val.label}
                                  // id={val.value}
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
                  </Tab>
                  <Tab eventKey="area" title={t("area")}>
                    <b className="mt-2"> {t("selectArea")} </b>
                    <div className="AllAreaClass">
                      {area?.map((val, key) => (
                        <div key={key}>
                          <h6 className="areaParent">{val.name}</h6>
                          {storeSubArea?.map(
                            (v, k) =>
                              v.area === val.id && (
                                <div key={k} className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={v.id + v.name}
                                    value={v.id}
                                    onChange={setAreaHandler}
                                  />
                                  <label htmlFor={v.id + v.name}>
                                    {v.name}
                                  </label>
                                </div>
                              )
                          )}
                        </div>
                      ))}
                    </div>
                  </Tab>
                  <Tab eventKey="package" title={t("package")}>
                    <div className="d-flex mt-5 justify-content-evenly">
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
                          <label className="text-secondary">
                            {t("ispOwnerShare")}
                          </label>

                          <select
                            type="text"
                            className="form-select mw-100 mt-0"
                            onChange={(e) => setPackageRateType(e.target.value)}
                          >
                            <option value="">{t("selectType")}</option>

                            <option value="percentage">
                              {t("Percentage")}
                            </option>
                            <option value="fixedRate">{t("fixedRate")}</option>
                          </select>
                        </div>
                      )}
                    </div>
                    {bpSettings.hasMikrotik ? (
                      <>
                        <b className="mt-2"> {t("selectMikrotik")} </b>
                        <div className="AllAreaClass">
                          <div className="row">
                            {mikrotikpakages?.mikrotiks?.map((item) => (
                              <div className="col-md-3" key={item.id}>
                                <h6 className="areaParent mt-3">
                                  <input
                                    id={item.id}
                                    type="checkbox"
                                    className="getValueUsingClasses form-check-input me-1"
                                    value={item.id}
                                    onChange={(e) =>
                                      setMikrotikHandler(e.target.value)
                                    }
                                  />
                                  <label htmlFor={item.id}>
                                    <b className="h5">{item.name}</b>
                                  </label>
                                </h6>
                                <div>
                                  {mikrotikpakages.packages.map(
                                    (p) =>
                                      p.mikrotik === item.id && (
                                        <div key={p.id} className="w-100 my-1">
                                          <input
                                            id={p.id}
                                            className="me-2"
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

                                          <span className="text-secondary">
                                            &#2547;{p.rate}
                                          </span>
                                          {commissionType ===
                                            "packageBased" && (
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
                                                  className={`form-control w-100 shadow-none m-1 ${
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
                                                    "percentage"
                                                      ? 100
                                                      : undefined
                                                  }
                                                  placeholder="Package Rate"
                                                />

                                                {packageRateType ===
                                                "percentage" ? (
                                                  <p className="mx-1">%</p>
                                                ) : packageRateType ===
                                                  "fixedRate" ? (
                                                  <p className="mx-1">
                                                    &#2547;
                                                  </p>
                                                ) : (
                                                  ""
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
                        </div>
                      </>
                    ) : (
                      <>
                        <b className="mt-2"> {t("package")} </b>
                        <div className="AllAreaClass">
                          <div className="">
                            {/* {packages.map((p) => (
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
                            ))} */}
                            {packages.map((p) => (
                              <>
                                <div className="form-check">
                                  <input
                                    id={p.id}
                                    className="form-check-input me-2"
                                    type="checkbox"
                                    value={p.id}
                                    onChange={handelMikrotikPakages}
                                    disabled={
                                      commissionType === "packageBased" &&
                                      !packageRateType
                                    }
                                  />
                                  <label
                                    htmlFor={p.id}
                                    className="form-check-label"
                                  >
                                    {p.name}
                                  </label>
                                </div>
                                {commissionType === "packageBased" && (
                                  <>
                                    <div
                                      className={`d-flex align-items-center ${
                                        mikroTikPackagesId.includes(p.id)
                                          ? "d-block"
                                          : "d-none"
                                      }`}
                                    >
                                      <input
                                        className={`form-control w-50 shadow-none m-1 ${
                                          mikroTikPackagesId.includes(p.id)
                                            ? "d-block"
                                            : "d-none"
                                        }`}
                                        type="number"
                                        id={p.id}
                                        name={p.id}
                                        onChange={handlePackageDividerInput}
                                        min={0}
                                        max={
                                          packageRateType === "percentage"
                                            ? 100
                                            : undefined
                                        }
                                        placeholder="Package Rate"
                                      />

                                      {packageRateType === "percentage" ? (
                                        <p className="mx-1">%</p>
                                      ) : (
                                        <p className="mx-1">&#2547;</p>
                                      )}
                                    </div>
                                  </>
                                )}
                              </>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </Tab>
                  <Tab eventKey="permission" title={t("changePermission")}>
                    <div className="displayGrid3 secondSection text-start">
                      <div>
                        <input
                          className="form-check-input"
                          id="souceCheck"
                          type="checkbox"
                          onChange={permissionHandler}
                          name="allChecked"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="souceCheck"
                        >
                          <p className="radioTitle">{t("allPermission")}</p>
                        </label>
                      </div>

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
                  </Tab>
                </Tabs>
              </Form>
            )}
          </Formik>
        </ModalBody>
        <ModalFooter>
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
            form="resellerPost"
            className="btn btn-success"
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : t("submit")}
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ResellerPost;
