import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";

// internal imports
import "../../collector/collector.css";
import "../customer.css";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import {
  addCustomer,
  fetchPackagefromDatabase,
} from "../../../features/apiCalls";
import getName from "../../../utils/getLocationName";
import useISPowner from "../../../hooks/useISPOwner";

//divisional location
import divisionsJSON from "../../../bdAddress/bd-divisions.json";
import districtsJSON from "../../../bdAddress/bd-districts.json";
import thanaJSON from "../../../bdAddress/bd-upazilas.json";

//formik select
import SelectField from "../../../components/common/SelectField";
import useCurrentUser from "../../../hooks/useCurrentUser";
import { getPoleBoxApi } from "../../../features/actions/customerApiCall";

const divisions = divisionsJSON.divisions;
const districts = districtsJSON.districts;
const thana = thanaJSON.thana;

export default function CustomerModal({ show, setShow }) {
  const { t } = useTranslation();
  const { hasMikrotik, ispOwnerId, bpSettings } = useISPowner();
  const { userRole, userId } = useCurrentUser();

  // all areas form redux
  const area = useSelector((state) => state?.area?.area);

  // areas subArea form redux
  const storeSubArea = useSelector((state) => state.area?.subArea);

  // ispOwner all mikrotiks in redux
  const Getmikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  // ispOwner mikrotik & withOut mikrotik packages in redux
  const ppPackage = useSelector((state) =>
    hasMikrotik
      ? state?.mikrotik?.packagefromDatabase
      : state?.package?.packages
  );

  // areas all poleBox form redux
  const poleBox = useSelector((state) => state.area?.poleBox);

  // Loading state
  const [isLoadingPole, setIsLoadingPole] = useState(false);
  const [isLoading, setIsloading] = useState(false);

  const [packageRate, setPackageRate] = useState({ rate: 0 });
  const [singleMikrotik, setSingleMikrotik] = useState("");
  const [mikrotikPackage, setMikrotikPackage] = useState("");
  const [autoDisable, setAutoDisable] = useState(
    bpSettings.customerAutoConnection
  );
  const [subArea, setSubArea] = useState("");
  const [sendArea, setSendArea] = useState("");
  const dispatch = useDispatch();

  const [billDate, setBillDate] = useState(new Date());
  const [connectionDate, setConnectionDate] = useState(new Date());
  const [connectionFee, setConnectionFee] = useState(false);
  const [medium, setMedium] = useState("cash");

  // pole get subarea state
  const [subAreasPoleBox, setSubAreasPoleBox] = useState([]);

  const [divisionalArea, setDivisionalArea] = useState({
    division: "",
    district: "",
    thana: "",
  });

  // customer validator
  const customerValidator = Yup.object({
    // customerId: Yup.string(),
    name: Yup.string().required(t("writeCustomerName")),
    mobile: Yup.string()
      .matches(/^(01){1}[3456789]{1}(\d){8}$/, t("incorrectMobile"))
      .min(11, t("write11DigitMobileNumber"))
      .max(11, t("over11DigitMobileNumber")),
    referenceMobile: Yup.string()
      .matches(/^(01){1}[3456789]{1}(\d){8}$/, t("incorrectMobile"))
      .min(11, t("write11DigitMobileNumber"))
      .max(11, t("over11DigitMobileNumber")),
    address: Yup.string(),
    email: Yup.string().email(t("incorrectEmail")),
    nid: Yup.string(),
    monthlyFee: Yup.number()
      .integer()
      .min(0, t("minimumPackageRate"))
      .required(t("enterPackageRate")),
    Pname: Yup.string().required(t("writePPPoEName")),
    Ppassword: Yup.string().required(t("writePPPoEPassword")),
    Pcomment: Yup.string(),
    customerBillingType: Yup.string().required(t("select billing type")),
    amount: Yup.number()
      .min(0, t("billNotAcceptable"))
      .integer(t("decimalNumberNotAcceptable")),
  });

  // get subarea poleBox
  useEffect(() => {
    getPoleBoxApi(dispatch, ispOwnerId, setIsLoadingPole);
  }, []);

  //modal show handler
  const handleClose = () => {
    setShow(false);
  };

  // select Getmikrotik
  const selectMikrotik = (e) => {
    const id = e.target.value;
    if (id && ispOwnerId) {
      const IDs = {
        ispOwner: ispOwnerId,
        mikrotikId: id,
      };
      //ToDo
      if (bpSettings?.hasMikrotik) {
        fetchPackagefromDatabase(dispatch, IDs, setIsloading);
      }
    }
    setSingleMikrotik(id);
  };

  // select subArea
  const selectSubArea = (data) => {
    const areaId = data.target.value;

    if (areaId) {
      const temp = storeSubArea.filter((val) => {
        return val.area === areaId;
      });
      setSubArea(temp);
      setSendArea(areaId);
    }
  };

  //
  const subAreaPoleBoxHandler = (e) => {
    const subAreaPoleBox = poleBox.filter((val) => {
      return val.subArea === e.target.value;
    });
    setSubAreasPoleBox(subAreaPoleBox);
  };

  // select Mikrotik Package
  const selectMikrotikPackage = (e) => {
    const mikrotikPackageId = e.target.value;

    if (mikrotikPackageId === "0") {
      setPackageRate({ rate: 0 });
      setMikrotikPackage("");
    } else {
      setMikrotikPackage(mikrotikPackageId);
      const temp = ppPackage.find((val) => val.id === mikrotikPackageId);
      setPackageRate(temp);
    }
  };

  // sending data to backed
  const customerHandler = async (data, resetForm) => {
    const subArea2 = document.getElementById("subAreaId").value;
    let poleBoxId;
    if (bpSettings?.poleBox) {
      poleBoxId = document.getElementById("poleBox").value;
    }

    if (subArea2 === "") {
      setIsloading(false);
      return alert(t("selectSubArea"));
    }

    if (!billDate) {
      setIsloading(false);
      return alert(t("selectBillDate"));
    }

    const {
      customerId,
      Pname,
      Ppassword,
      Pprofile,
      Pcomment,
      balance,
      ...rest
    } = data;

    if (bpSettings.addCustomerWithMobile) {
      if (data.mobile === "") {
        setIsloading(false);
        return alert(t("writeMobileNumber"));
      }
    }

    if (!bpSettings.genCustomerId) {
      if (customerId === "") {
        setIsloading(false);
        return alert(t("writeCustomerId"));
      }
    }

    const mainData = {
      paymentStatus: "unpaid",
      area: sendArea,
      subArea: subArea2,
      poleBox: poleBoxId,
      ispOwner: ispOwnerId,
      mikrotik: singleMikrotik,
      mikrotikPackage: mikrotikPackage,
      billPayType: "prepaid",
      autoDisable: autoDisable,
      connectionDate: connectionDate?.toISOString(),
      billingCycle: billDate?.toISOString(),
      pppoe: {
        name: Pname,
        password: Ppassword,
        service: "pppoe",
        comment: Pcomment,
        profile: Pprofile,
      },
      balance: -balance,
      ...rest,
    };
    if (!bpSettings?.hasMikrotik) {
      delete mainData.mikrotik;
    }
    if (!bpSettings.genCustomerId) {
      mainData.customerId = customerId;
    }

    if (
      divisionalArea.district ||
      divisionalArea.division ||
      divisionalArea.thana
    ) {
      const divisionName = getName(divisions, divisionalArea.division)?.name;
      const districtName = getName(districts, divisionalArea.district)?.name;
      const thanaName = getName(thana, divisionalArea.thana)?.name;
      //if  exist add the data
      if (divisionName) mainData.division = divisionName;
      if (districtName) mainData.district = districtName;
      if (thanaName) mainData.thana = thanaName;
    }

    if (!poleBoxId) {
      delete mainData.poleBox;
    }

    addCustomer(dispatch, mainData, setIsloading, resetForm, setShow);
  };

  //divisional area formula
  const divisionalAreaFormData = [
    {
      text: t("selectDivision"),
      name: "division",
      id: "division",
      value: divisionalArea.division,
      data: divisions,
    },
    {
      text: t("selectDistrict"),
      name: "district",
      id: "district",
      value: divisionalArea.district,
      data: districts.filter(
        (item) => item.division_id === divisionalArea.division
      ),
    },
    {
      text: t("selectThana"),
      name: "thana",
      id: "thana",
      value: divisionalArea.thana,
      data: thana.filter(
        (item) => item.district_id === divisionalArea.district
      ),
    },
  ];

  // this function control the division district and thana change input
  const onDivisionalAreaChange = ({ target }) => {
    const { name, value } = target;
    //set the value of division district and thana dynamically
    setDivisionalArea({
      ...divisionalArea,
      [name]: value,
    });
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="xl"
      >
        <ModalHeader closeButton>
          <ModalTitle>
            <h5 className="modal-title text-secondary" id="exampleModalLabel">
              {t("addNewCustomer")}
            </h5>
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Formik
            initialValues={{
              customerId: "",
              name: "",
              mobile: "",
              address: "",
              email: "",
              nid: "",
              monthlyFee: packageRate?.rate || 0,
              Pname: "",
              Pprofile: packageRate?.name || "",
              Ppassword: "",
              Pcomment: "",
              balance: "",
              connectionFee: "",
              referenceName: "",
              referenceMobile: "",
              customerBillingType: "prepaid",
            }}
            validationSchema={customerValidator}
            onSubmit={(values, { resetForm }) => {
              customerHandler(values, resetForm);
            }}
            enableReinitialize
          >
            {() => (
              <Form id="createCustomer">
                <div className="displayGrid3">
                  {hasMikrotik && (
                    <div>
                      <label className="form-control-label changeLabelFontColor">
                        {t("selectMikrotik")}
                        <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select mw-100 mt-0"
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
                  )}

                  <div>
                    <label className="form-control-label changeLabelFontColor">
                      {t("selectPackage")}
                      <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select mw-100 mt-0"
                      aria-label="Default select example"
                      onChange={selectMikrotikPackage}
                    >
                      <option value={"0"}>...</option>
                      {ppPackage &&
                        ppPackage?.map((val, key) => (
                          <option key={key} value={val.id}>
                            {val.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <FtextField
                    type="number"
                    label={t("monthFee")}
                    name="monthlyFee"
                    min={0}
                    disabled={!(mikrotikPackage && userRole === "ispOwner")}
                    validation={"true"}
                  />

                  {!bpSettings?.hasMikrotik && (
                    <FtextField
                      type="number"
                      label={t("prevDue")}
                      name="balance"
                    />
                  )}

                  <FtextField
                    type="text"
                    label={t("PPPoEName")}
                    name="Pname"
                    disabled={!mikrotikPackage}
                    validation={"true"}
                  />

                  <FtextField
                    type="text"
                    label={t("password")}
                    name="Ppassword"
                    disabled={!mikrotikPackage}
                    validation={"true"}
                  />

                  <FtextField
                    type="text"
                    label={t("comment")}
                    name="Pcomment"
                    disabled={!mikrotikPackage}
                  />

                  <div>
                    <label className="form-control-label changeLabelFontColor">
                      {t("selectArea")} <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select mw-100 mt-0"
                      aria-label="Default select example"
                      onChange={selectSubArea}
                      disabled={!mikrotikPackage}
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
                    <label className="form-control-label changeLabelFontColor">
                      {t("selectSubArea")}
                      <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select mw-100 mt-0"
                      aria-label="Default select example"
                      name="subArea"
                      id="subAreaId"
                      onChange={subAreaPoleBoxHandler}
                      disabled={!mikrotikPackage}
                    >
                      <option value="">...</option>
                      {subArea
                        ? subArea.map((val, key) => (
                            <option key={key} value={val.id}>
                              {val.name}
                            </option>
                          ))
                        : ""}
                    </select>
                  </div>

                  {bpSettings?.poleBox && (
                    <div>
                      <label className="form-control-label changeLabelFontColor">
                        {t("selectPoleBox/splitter")}
                      </label>
                      <select
                        className="form-select mw-100 mt-0"
                        aria-label="Default select example"
                        name="poleBox"
                        id="poleBox"
                        disabled={!mikrotikPackage}
                      >
                        <option value="">...</option>
                        {subAreasPoleBox
                          ? subAreasPoleBox?.map((val, key) => (
                              <option key={key} value={val.id}>
                                {val.name}
                              </option>
                            ))
                          : ""}
                      </select>
                    </div>
                  )}

                  <FtextField
                    type="text"
                    label={t("name")}
                    name="name"
                    disabled={!mikrotikPackage}
                    validation={"true"}
                  />

                  <FtextField
                    type="text"
                    label={t("mobile")}
                    name="mobile"
                    validation={bpSettings.addCustomerWithMobile}
                    disabled={!mikrotikPackage}
                  />

                  <FtextField
                    type="text"
                    label={t("email")}
                    name="email"
                    disabled={!mikrotikPackage}
                  />

                  {divisionalAreaFormData.map((item) => (
                    <div>
                      <label className="form-control-label changeLabelFontColor">
                        {item.text}
                      </label>
                      <select
                        className="form-select mw-100 mt-0"
                        aria-label="Default select example"
                        name={item.name}
                        id={item.id}
                        disabled={!mikrotikPackage}
                        onChange={onDivisionalAreaChange}
                      >
                        <option value="">...</option>
                        {item.data.map((item) => (
                          <option value={item.id}>{item.name}</option>
                        ))}
                      </select>
                    </div>
                  ))}

                  <FtextField
                    type="text"
                    label={t("NIDno")}
                    name="nid"
                    disabled={!mikrotikPackage}
                  />

                  <FtextField
                    type="text"
                    label={t("address")}
                    name="address"
                    disabled={!mikrotikPackage}
                  />

                  <SelectField
                    label={t("customerBillType")}
                    id="exampleSelect"
                    name="customerBillingType"
                    className="form-select mw-100 mt-0"
                  >
                    <option value="">{t("customerBillType")}</option>

                    <option value="prepaid">{t("prepaid")}</option>
                    <option value="postpaid">{t("postPaid")}</option>
                  </SelectField>

                  <div className="billCycle">
                    <label className="form-control-label changeLabelFontColor">
                      {t("billingCycle")} <span className="text-danger">*</span>
                    </label>

                    <DatePicker
                      className="form-control mw-100"
                      selected={billDate}
                      onChange={(date) => setBillDate(date)}
                      dateFormat="MMM dd yyyy hh:mm"
                      showTimeSelect
                      timeIntervals={60}
                      placeholderText={t("selectBillDate")}
                      disabled={!(mikrotikPackage && userRole === "ispOwner")}
                    />
                  </div>

                  <div>
                    <label className="form-control-label changeLabelFontColor">
                      {t("connectionDate")}
                    </label>
                    <DatePicker
                      className="form-control mw-100"
                      selected={connectionDate}
                      onChange={(date) => setConnectionDate(date)}
                      dateFormat="MMM dd yyyy"
                      maxDate={new Date()}
                      placeholderText={t("selectDate")}
                      disabled={!mikrotikPackage}
                    />
                  </div>

                  <FtextField
                    type="number"
                    name="connectionFee"
                    label={t("connectionFee")}
                    disabled={!mikrotikPackage}
                  />

                  <FtextField
                    type="text"
                    label={t("referenceName")}
                    name="referenceName"
                    disabled={!mikrotikPackage}
                  />

                  <FtextField
                    type="text"
                    label={t("referenceMobile")}
                    name="referenceMobile"
                    disabled={!mikrotikPackage}
                  />

                  {!bpSettings.genCustomerId && (
                    <FtextField
                      type="text"
                      label={t("customerId")}
                      name="customerId"
                      disabled={!mikrotikPackage}
                      validation={!bpSettings.genCustomerId}
                    />
                  )}

                  {bpSettings?.hasMikrotik && (
                    <div className="autoDisable">
                      <label> {t("automaticConnectionOff")} </label>
                      <input
                        type="checkBox"
                        checked={autoDisable}
                        onChange={(e) => setAutoDisable(e.target.checked)}
                      />
                    </div>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            className="btn btn-secondary border-0"
            disabled={isLoading}
            onClick={() => setShow(false)}
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            form="createCustomer"
            className="btn btn-success border-0"
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : t("save")}
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
}
