import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import { fetchPackagefromDatabase } from "../../../features/apiCalls";
import moment from "moment";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";

//divisional location
import divisionsJSON from "../../../bdAddress/bd-divisions.json";
import districtsJSON from "../../../bdAddress/bd-districts.json";
import thanaJSON from "../../../bdAddress/bd-upazilas.json";
import getName from "../../../utils/getLocationName";

//custom hooks
import SelectField from "../../../components/common/SelectField";
import { addResellerStaticCustomer } from "../../../features/apiCallReseller";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";

const divisions = divisionsJSON.divisions;
const districts = districtsJSON.districts;
const thana = thanaJSON.thana;

export default function AddStaticCustomer({ show, setShow }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get user bp setting
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData?.bpSettings
  );

  const permission = useSelector(
    (state) => state.persistedReducer.auth?.userData?.permission
  );

  // get role from redux
  const role = useSelector((state) => state.persistedReducer.auth?.role);

  // get Isp owner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  const resellerId = useSelector((state) =>
    role === "reseller"
      ? state.persistedReducer.auth?.userData?.id
      : state.persistedReducer.auth?.userData?.reseller
  );

  const userType = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData?.bpSettings.queueType
  );

  // get all area
  const area = useSelector((state) => state?.area?.area);

  // get all mikrotik
  const Getmikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  const ppPackage = useSelector((state) =>
    bpSettings?.hasMikrotik
      ? state?.mikrotik?.packagefromDatabase
      : state?.package?.packages
  );

  const [packageRate, setPackageRate] = useState({ rate: 0 });
  const [isLoading, setIsloading] = useState(false);
  const [singleMikrotik, setSingleMikrotik] = useState("");
  const [mikrotikPackage, setMikrotikPackage] = useState("");
  const [autoDisable, setAutoDisable] = useState(true);
  const [subArea, setSubArea] = useState("");
  const [billDate, setBillDate] = useState(new Date());
  const [billTime, setBilltime] = useState();
  const [maxUpLimit, setUpMaxLimit] = useState("");
  const [maxDownLimit, setDownMaxLimit] = useState("");
  const [monthlyFee, setMonthlyFee] = useState(packageRate?.rate || 0);

  const [divisionalArea, setDivisionalArea] = useState({
    division: "",
    district: "",
    thana: "",
  });

  // customer validator
  const customerValidator = Yup.object({
    name: Yup.string().required(t("writeCustomerName")),
    mobile: Yup.string()
      .matches(/^(01){1}[3456789]{1}(\d){8}$/, t("incorrectMobile"))
      .min(11, t("write11DigitMobileNumber"))
      .max(11, t("over11DigitMobileNumber"))
      .required(t("writeMobileNumber")),
    address: Yup.string(),
    email: Yup.string().email(t("incorrectEmail")),
    nid: Yup.string(),
    customerBillingType: Yup.string().required(t("select billing type")),
  });

  //modal show handler
  const handleClose = () => {
    setShow(false);
  };

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

  //function for set 0
  const setPackageLimit = (value, isDown) => {
    setMikrotikPackage(value);
    const temp = ppPackage.find((val) => val.id === value);
    if (isDown) {
      setPackageRate(temp);
      setMonthlyFee(temp.rate);
    }
    if (value === "unlimited") return "0";
    const getLetter = temp.name.toLowerCase();
    if (getLetter.indexOf("m") !== -1) {
      const setZero = getLetter.replace("m", "000000");
      return setZero;
    }
    if (getLetter.indexOf("k") !== -1) {
      const setZero = getLetter.replace("k", "000");
      return setZero;
    }
  };

  // select Mikrotik Package
  const selectMikrotikPackage = ({ target }) => {
    if (target.value === "0") {
      setPackageRate({ rate: 0 });
    } else {
      if (target.name === "firewallPackage") {
        setMikrotikPackage(target.value);
        const temp = ppPackage.find((val) => val.id === target.value);
        setPackageRate(temp);
        setMonthlyFee(temp.rate);
      }

      if (target.name === "upPackage") {
        const getLimit = setPackageLimit(target.value, false);
        getLimit && setUpMaxLimit(getLimit);
      }
      if (target.name === "downPackage") {
        const getLimit = setPackageLimit(target.value, true);
        getLimit && setDownMaxLimit(getLimit);
      }
    }
  };

  // sending data to backed
  const customerHandler = async (data, resetForm) => {
    const { balance, ipAddress, queueName, target, ...rest } = data;
    const mainData = {
      paymentStatus: "unpaid",
      subArea: subArea,
      ispOwner: ispOwnerId,
      reseller: resellerId,
      mikrotik: singleMikrotik,
      mikrotikPackage: mikrotikPackage,
      billPayType: "prepaid",
      autoDisable: autoDisable,
      billingCycle: moment(billDate)
        .subtract({ hours: 6 })
        .format("YYYY-MM-DDTHH:mm:ss.ms[Z]"),
      balance: -balance,
      ...rest,
      monthlyFee,
    };
    if (!bpSettings.hasMikrotik) {
      delete mainData.mikrotik;
    }
    let sendingData = { ...mainData };
    if (userType === "firewall-queue") {
      sendingData.userType = "firewall-queue";
      sendingData.queue = {
        type: userType,
        address: ipAddress,
        list: "allow_ip",
      };
    }
    if (userType === "simple-queue") {
      sendingData.userType = "simple-queue";
      sendingData.queue = {
        name: queueName,
        type: userType,
        target,
        maxLimit: `${maxUpLimit}/${maxDownLimit}`,
      };
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
      if (divisionName) sendingData.division = divisionName;
      if (districtName) sendingData.district = districtName;
      if (thanaName) sendingData.thana = thanaName;
    }
    addResellerStaticCustomer(
      dispatch,
      sendingData,
      setIsloading,
      resetForm,
      setShow
    );
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
              name: "",
              mobile: "",
              address: "",
              email: "",
              nid: "",
              balance: "",
              ipAddress: "",
              queueName: "",
              target: "",
              customerBillingType: "prepaid",
            }}
            validationSchema={customerValidator}
            onSubmit={(values, { resetForm }) => {
              customerHandler(values, resetForm);
            }}
          >
            {() => (
              <Form id="customerPost">
                <div className="displayGrid3">
                  <div>
                    <label className="form-control-label changeLabelFontColor">
                      {t("selectMikrotik")}
                    </label>
                    <select
                      className="form-select mw-100 mt-0"
                      aria-label="Default select example"
                      onChange={selectMikrotik}
                    >
                      <option value="">...</option>
                      {Getmikrotik.length &&
                        Getmikrotik.map((val, key) => (
                          <option key={key} value={val.id}>
                            {val.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-control-label changeLabelFontColor">
                      {t("selectArea")}
                    </label>
                    <select
                      className="form-select mw-100 mt-0"
                      aria-label="Default select example"
                      onChange={(event) => setSubArea(event.target.value)}
                    >
                      <option value="">...</option>
                      {area.length &&
                        area.map((val, key) => (
                          <option key={key} value={val.id}>
                            {val.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {userType === "simple-queue" && (
                    <FtextField
                      type="text"
                      label={t("queueName")}
                      name="queueName"
                    />
                  )}

                  {userType === "simple-queue" && (
                    <FtextField
                      type="text"
                      label={t("ipAddress")}
                      name="target"
                    />
                  )}

                  {userType === "firewall-queue" && (
                    <FtextField
                      type="text"
                      label={t("ipAddress")}
                      name="ipAddress"
                    />
                  )}

                  {userType === "firewall-queue" && (
                    <div>
                      <label className="form-control-label changeLabelFontColor">
                        {t("selectPackage")}
                      </label>
                      <select
                        name="firewallPackage"
                        className="form-select mw-100 mt-0"
                        aria-label="Default select example"
                        onChange={selectMikrotikPackage}
                      >
                        <option value={"0"}>...</option>
                        {ppPackage &&
                          ppPackage?.map(
                            (val, key) =>
                              val.packageType === "queue" && (
                                <option key={key} value={val.id}>
                                  {val.name}
                                </option>
                              )
                          )}
                      </select>
                    </div>
                  )}

                  {userType === "simple-queue" && (
                    <div>
                      <label className="form-control-label changeLabelFontColor">
                        {t("uploadPackge")}{" "}
                      </label>
                      <select
                        name="upPackage"
                        className="form-select mw-100 mt-0"
                        aria-label="Default select example"
                        onChange={selectMikrotikPackage}
                      >
                        <option value={"0"}>...</option>
                        {ppPackage &&
                          ppPackage?.map(
                            (val, key) =>
                              val.packageType === "queue" && (
                                <option key={key} value={val.id}>
                                  {val.name}
                                </option>
                              )
                          )}
                      </select>
                    </div>
                  )}

                  {userType === "simple-queue" && (
                    <div>
                      <label className="form-control-label changeLabelFontColor">
                        {t("downloadPackge")}
                      </label>
                      <select
                        name="downPackage"
                        className="form-select mw-100 mt-0"
                        aria-label="Default select example"
                        onChange={selectMikrotikPackage}
                      >
                        <option value={"0"}>...</option>
                        {ppPackage &&
                          ppPackage?.map(
                            (val, key) =>
                              val.packageType === "queue" && (
                                <option key={key} value={val.id}>
                                  {val.name}
                                </option>
                              )
                          )}
                      </select>
                    </div>
                  )}

                  <FtextField
                    type="number"
                    label={t("monthFee")}
                    name="monthlyFee"
                    min={0}
                    value={monthlyFee}
                    onChange={(e) => setMonthlyFee(e.target.value)}
                  />

                  {!bpSettings?.hasMikrotik && (
                    <FtextField
                      type="number"
                      label={t("prevDue")}
                      name="balance"
                    />
                  )}

                  <FtextField type="text" label={t("NIDno")} name="nid" />

                  <FtextField type="text" label={t("name")} name="name" />

                  <FtextField type="text" label={t("mobile")} name="mobile" />

                  <FtextField type="text" label={t("address")} name="address" />

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
                        onChange={onDivisionalAreaChange}
                        value={item.value}
                      >
                        <option value="">...</option>
                        {item.data.map((item) => (
                          <option value={item.id}>{item.name}</option>
                        ))}
                      </select>
                    </div>
                  ))}

                  <FtextField type="text" label={t("email")} name="email" />

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

                  <FtextField type="text" label={t("email")} name="email" />

                  <div>
                    <label className="form-control-label changeLabelFontColor">
                      {t("billingCycle")}
                    </label>
                    <DatePicker
                      className="form-control mw-100"
                      selected={billDate}
                      onChange={(data) => setBillDate(data)}
                      showTimeSelect
                      timeIntervals={60}
                      dateFormat="dd/MM/yyyy:hh:mm"
                      minDate={billDate}
                      disabled={permission?.billingCycleEdit === false}
                    />
                  </div>

                  {bpSettings?.hasMikrotik && (
                    <div className="autoDisable mt-0">
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
          <div className="modal-footer border-none">
            <button
              type="button"
              className="btn btn-secondary"
              disabled={isLoading}
              onClick={() => setShow(false)}
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              form="customerPost"
              className="btn btn-success"
              disabled={isLoading}
            >
              {isLoading ? <Loader /> : t("submit")}
            </button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
}
