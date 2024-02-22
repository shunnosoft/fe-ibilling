import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";

// internal import
import { FtextField } from "../../../components/common/FtextField";
import { updateOwner } from "../../../features/apiCallAdmin";
import Loader from "../../../components/common/Loader";

//divisional location
import divisionsJSON from "../../../bdAddress/bd-divisions.json";
import districtsJSON from "../../../bdAddress/bd-districts.json";
import thanaJSON from "../../../bdAddress/bd-upazilas.json";
import getName, { getNameId } from "../../../utils/getLocationName";

const divisions = divisionsJSON.divisions;
const districts = districtsJSON.districts;
const thana = thanaJSON.thana;

const DetailsForm = ({ setShow, ispOwner }) => {
  const { t } = useTranslation();

  // import dispatch from react redux
  const dispatch = useDispatch();

  //  loading local state
  const [isLoading, setIsLoading] = useState(false);

  const [billDate, setBillDate] = useState();

  //ispOwner customer type data state
  const [customerType, setCustomerType] = useState("");
  const [divisionalArea, setDivisionalArea] = useState({
    division: "",
    district: "",
    thana: "",
  });

  const role = useSelector((state) => state.persistedReducer.auth?.role);

  useEffect(() => {
    setBillDate(
      moment(ispOwner?.bpSettings?.monthlyDueDate).format("YYYY-MM-DD")
    );
    setCustomerType(ispOwner?.bpSettings?.customerType);
  }, [ispOwner]);

  //  isp owner form validation
  const ispOwnerValidator = Yup.object({
    name: Yup.string().required("আই এস পি ওনারের নাম দিন"),
    mobile: Yup.string()
      // .matches(/^(01){1}[3456789]{1}(\d){8}$/, "মোবাইল নম্বর সঠিক নয়")
      .min(11, "এগারো  ডিজিট এর মোবাইল নম্বর লিখুন")
      .max(11, "এগারো  ডিজিট এর বেশি হয়ে গেছে"),
    company: Yup.string().required("কোম্পানির নাম দিন"),
    address: Yup.string().required("ঠিকানা দিন"),
    smsBalance: Yup.string().required("এস এম এস এর পরিমান দিন "),
    referenceName: Yup.string(),
    referenceMobile: Yup.string()
      // .matches(/^(01){1}[3456789]{1}(\d){8}$/, "মোবাইল নম্বর সঠিক নয়")
      .min(11, "এগারো  ডিজিট এর মোবাইল নম্বর লিখুন")
      .max(11, "এগারো  ডিজিট এর বেশি হয়ে গেছে"),
    paymentStatus: Yup.string().required("পেমেন্ট স্ট্যাটাস দিন"),
    queueType: Yup.string().required("queueType দিন"),
    packType: Yup.string().required("প্যাকেজ টাইপ দিন"),
    pack: Yup.string().required("প্যাকেজ দিন"),
    customerLimit: Yup.string().required("কাস্টমার লিমিট দিন"),
    packageRate: Yup.string().required("প্যাকেজ রেট দিন"),
    hasMikrotik: Yup.string(),
    inventory: Yup.string(),
    executeBillingCycle: Yup.string(),
    customerType: Yup.array(),
  });

  //  set initial form values
  let initialValues;
  if (ispOwner) {
    initialValues = {
      ispOwnerId: ispOwner?.id,
      name: ispOwner?.name,
      mobile: ispOwner?.mobile,
      company: ispOwner?.company,
      address: ispOwner?.address,
      smsBalance: ispOwner?.smsBalance,
      referenceName: ispOwner?.reference?.name,
      referenceMobile: ispOwner?.reference?.mobile,
      paymentStatus: ispOwner?.bpSettings?.paymentStatus,
      queueType: ispOwner?.bpSettings?.queueType,
      packType: ispOwner?.bpSettings?.packType,
      pack: ispOwner?.bpSettings?.pack,
      packageRate: ispOwner?.bpSettings?.packageRate,
      customerLimit: ispOwner?.bpSettings?.customerLimit,
      hasMikrotik: ispOwner?.bpSettings?.hasMikrotik,
      inventory: ispOwner?.bpSettings?.inventory,
      executeBillingCycle: ispOwner?.bpSettings?.executeBillingCycle,
      pppoe: customerType,
      static: customerType,
      hotspot: customerType,
    };
  }

  //  handle submit
  const ownerHandler = (values) => {
    //  delete id & mobile from value
    delete values.id;
    delete values.mobile;

    // send data to api
    const data = {
      name: values.name,
      company: values.company,
      address: values.address,
      status: values.status,

      bpSettings: {
        ...ispOwner.bpSettings,
        packageRate: Number.parseInt(values.packageRate),
        customerLimit: Number.parseInt(values.customerLimit),
        packType: values.packType,
        pack: values.pack,
        queueType: values.queueType,
        hasMikrotik: values.hasMikrotik,
        inventory: values.inventory,
        monthlyDueDate: billDate,
        executeBillingCycle: values.executeBillingCycle,
        customerType: customerType,
      },
      reference: {
        ...ispOwner.reference,
        mobile: values.referenceMobile,
      },
    };

    if (role === "superadmin") {
      data.smsBalance = values.smsBalance;
      data.bpSettings.paymentStatus = values.paymentStatus;
      data.reference.name = values.referenceName;
    }

    if (role === "admin") {
      if (
        Number.parseInt(values.packageRate) < ispOwner.bpSettings.packageRate
      ) {
        alert("রেট কমানো সম্ভব নয়");
        return;
      }
      if (
        Number.parseInt(values.customerLimit) <
        ispOwner.bpSettings.customerLimit
      ) {
        alert("লিমিট কমানো সম্ভব নয়");
        return;
      }
    }

    data.bpSettings.monthlyDueDate = moment(data.bpSettings.monthlyDueDate).set(
      {
        hour: 23,
        minute: 59,
        second: 0,
        millisecond: 0,
      }
    );

    if (
      divisionalArea.division ||
      divisionalArea.district ||
      divisionalArea.thana
    ) {
      const divisionName = getName(divisions, divisionalArea.division)?.name;
      const districtName = getName(districts, divisionalArea.district)?.name;
      const thanaName = getName(thana, divisionalArea.thana)?.name;

      if (divisionName) data.division = divisionName;
      if (districtName) data.district = districtName;
      if (thanaName) data.upazila = thanaName;
    }

    // api call
    updateOwner(ispOwner.id, data, setIsLoading, dispatch, setShow);
  };

  //ispOwner customer type handler
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

  //divisional area format
  const divisionalAreaFormat = [
    {
      text: "Select Division",
      name: "division",
      id: "division",
      value: divisionalArea.division,
      data: divisions,
    },
    {
      text: "Select District",
      name: "district",
      id: "district",
      value: divisionalArea.district,
      data: districts.filter(
        (item) => item.division_id === divisionalArea.division
      ),
    },
    {
      text: "Select Thana",
      name: "thana",
      id: "thana",
      value: divisionalArea.thana,
      data: thana.filter(
        (item) => item.district_id === divisionalArea.district
      ),
    },
  ];

  // deviational area change handler
  const divisionalAreaChangeHandler = ({ target }) => {
    const { name, value } = target;

    //set the value of division district and thana dynamically
    setDivisionalArea({
      ...divisionalArea,
      [name]: value,
    });
  };

  useEffect(() => {
    const division_id = getNameId(divisions, ispOwner?.division)?.id;
    const district_id = getNameId(districts, ispOwner?.district)?.id;
    const thana_id = getNameId(thana, ispOwner?.upazila)?.id;
    setDivisionalArea({
      division: division_id,
      district: district_id,
      thana: thana_id,
    });
  }, [ispOwner.division]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ispOwnerValidator}
      onSubmit={(values) => {
        ownerHandler(values);
      }}
      enableReinitialize
    >
      {() => (
        <Form>
          <div className="displayGrid3">
            <FtextField type="text" label="Name" name="name" />
            <FtextField type="text" label="Company" name="company" />
            <FtextField type="text" label="Address" name="address" />

            <FtextField
              type="text"
              label="Package Rate"
              name="packageRate"
              disabled={role === "admin"}
            />
            <FtextField
              type="text"
              label="Customer Limit"
              name="customerLimit"
              disabled={role === "admin"}
            />

            {role === "superadmin" && (
              <FtextField type="text" label="SMS Balance" name="smsBalance" />
            )}

            <div>
              <lable>Package Type</lable>
              <Field
                as="select"
                name="packType"
                className="form-select mw-100 mt-0"
              >
                <option
                  value="Basic"
                  selected={ispOwner?.bpSettings?.packType === "Basic"}
                >
                  Basic
                </option>
                <option
                  value="Standard"
                  selected={ispOwner?.bpSettings?.packType === "Standard"}
                >
                  Standard
                </option>
              </Field>
            </div>

            <div>
              <lable>Package</lable>
              <Field
                as="select"
                className="form-select mw-100 mt-0"
                name="pack"
                disabled={role === "admin"}
              >
                <option value="P1">P1</option>
                <option value="P2">P2</option>
                <option value="P3">P3</option>
                <option value="P4">P4</option>
                <option value="P5">P5</option>
                <option value="P6">P6</option>
                <option value="P7">P7</option>
                <option value="P8">P8</option>
                <option value="P9">P9</option>
                <option value="P10">P10</option>
                <option value="P11">P11</option>
                <option value="P12">P12</option>
                <option value="P13">P13</option>
                <option value="P14">P14</option>
                <option value="P15">P15</option>
              </Field>
            </div>

            {role === "superadmin" && (
              <div>
                <lable>Payment Status</lable>
                <Field
                  as="select"
                  className="form-select mw-100 mt-0"
                  name="paymentStatus"
                >
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </Field>
              </div>
            )}

            <div>
              <lable>Queue Type</lable>
              <Field
                as="select"
                className="form-select mw-100 mt-0"
                name="queueType"
              >
                <option value="simple-queue">Simple Queue</option>
                <option value="firewall-queue">Firewall Queue</option>
                <option value="core-queue">Core Queue</option>
              </Field>
            </div>

            <div>
              <lable className="customerFieldsTitle mb-0">Invoice Date</lable>

              <div className="timeDate">
                <DatePicker
                  className="form-control mw-100"
                  value={moment(billDate).format("YYYY MMM DD")}
                  onChange={(date) => setBillDate(date)}
                  type="date"
                  name="monthlyDueDate"
                  disabled={role === "admin"}
                />
              </div>
            </div>

            <div>
              <lable>Status</lable>
              <Field
                as="select"
                name="status"
                className="form-select mw-100 mt-0"
              >
                <option value="new" selected={ispOwner?.status === "new"}>
                  New
                </option>
                <option value="active" selected={ispOwner?.status === "active"}>
                  Active
                </option>
                <option
                  value="inactive"
                  selected={ispOwner?.status === "inactive"}
                >
                  Inactive
                </option>
                <option value="banned" selected={ispOwner?.status === "banned"}>
                  Banned
                </option>
                <option
                  value="deleted"
                  selected={ispOwner?.status === "deleted"}
                >
                  Deleted
                </option>
                <option value="trial" selected={ispOwner?.status === "trial"}>
                  Trial
                </option>
              </Field>
            </div>

            <div>
              <lable>Execute Billing Cycle</lable>
              <Field
                as="select"
                name="executeBillingCycle"
                className="form-select mw-100 mt-0"
              >
                <option
                  value="true"
                  selected={
                    ispOwner?.bpSettings?.executeBillingCycle === "true"
                  }
                >
                  Yes
                </option>
                <option
                  value="false"
                  selected={
                    ispOwner?.bpSettings?.executeBillingCycle === "false"
                  }
                >
                  No
                </option>
              </Field>
            </div>

            {divisionalAreaFormat.map((item) => (
              <div>
                <p className="customerFieldsTitle">{item.text}</p>
                <select
                  className="form-select mw-100 mt-0"
                  name={item.name}
                  id={item.id}
                  onChange={divisionalAreaChangeHandler}
                  value={item.value}
                >
                  <option value="">...</option>
                  {item.data.map((item) => (
                    <option value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
            ))}

            {role === "superadmin" && (
              <FtextField
                type="text"
                label="Reference Name"
                name="referenceName"
              />
            )}

            <FtextField
              type="text"
              label="Reference Mobile"
              name="referenceMobile"
            />

            <div>
              <lable>Customer Type</lable>
              <div className="d-inline-flex mb-4">
                <div className="form-check me-3">
                  <Field
                    className="form-check-input"
                    type="checkbox"
                    id="pppoe-customer"
                    name="pppoe"
                    value={"pppoe"}
                    onClick={customerTypeHandler}
                  />
                  <label className="form-check-label" for="pppoe-customer">
                    PPPoE
                  </label>
                </div>
                <div className="form-check me-3">
                  <Field
                    className="form-check-input"
                    type="checkbox"
                    id="static-customer"
                    name="static"
                    value={"static"}
                    onClick={customerTypeHandler}
                  />
                  <label className="form-check-label" for="static-customer">
                    Static
                  </label>
                </div>
                <div className="form-check">
                  <Field
                    className="form-check-input"
                    type="checkbox"
                    id="hotspot-customer"
                    name="hotspot"
                    value={"hotspot"}
                    onClick={customerTypeHandler}
                  />
                  <label className="form-check-label" for="hotspot-customer">
                    Hotspot
                  </label>
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-between">
              <div className="form-check my-2">
                <Field
                  className="form-check-input"
                  type="checkbox"
                  id="flexCheckChecked"
                  name="hasMikrotik"
                />
                <label className="form-check-label" for="flexCheckChecked">
                  Has Mikrotik
                </label>
              </div>

              <div className="form-check my-2">
                <Field
                  className="form-check-input"
                  type="checkbox"
                  id="inventoryChecked"
                  name="inventory"
                />
                <label className="form-check-label" for="inventoryChecked">
                  Has Inventory
                </label>
              </div>
            </div>
          </div>

          <div className="displayGrid1 float-end mt-4">
            <button
              type="button"
              className="btn btn-secondary"
              disabled={isLoading}
              onClick={() => setShow(false)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-success"
              disabled={isLoading}
            >
              {isLoading ? <Loader /> : "Submit"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default DetailsForm;
