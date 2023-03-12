import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { FtextField } from "../../../components/common/FtextField";
import { updateOwner } from "../../../features/apiCallAdmin";
import Loader from "../../../components/common/Loader";
import moment from "moment";
import { useTranslation } from "react-i18next";

// import { divisions } from "../../../bdAddress/bd-divisions.json";
// import { districts } from "../../../bdAddress/bd-districts.json";
// import { thana } from "../../../bdAddress/bd-upazilas.json";

const DetailsForm = ({ ispOwner }) => {
  const { t } = useTranslation();

  // import dispatch from react redux
  const dispatch = useDispatch();

  // console.log(ispOwner?.division);

  //  loading local state
  const [isLoading, setIsLoading] = useState(false);

  const [billDate, setBillDate] = useState();

  // owner division
  // const [ownerDivisionId, setOwnerDivisionId] = useState();

  // //get districts & thana state
  // const [division, setDivision] = useState("");
  // const [getDistricts, setGetDistricts] = useState([]);
  // const [district, setDistrict] = useState("");
  // const [getUpazilas, setGetUpazilas] = useState([]);
  // const [thana, setThana] = useState("");

  const role = useSelector((state) => state.persistedReducer.auth?.role);

  useEffect(() => {
    setBillDate(
      moment(ispOwner?.bpSettings?.monthlyDueDate).format("YYYY-MM-DD")
    );
  }, [ispOwner]);

  // useEffect(() => {
  //   const findDivision = divisions.find(
  //     (item) => item.name === ispOwner?.division
  //   );
  //   setOwnerDivisionId(findDivision);
  // }, []);

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
    executeBillingCycle: Yup.string(),
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
      executeBillingCycle: ispOwner?.bpSettings?.executeBillingCycle,
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
      // division,
      // district,
      // upazila,
      status: values.status,

      bpSettings: {
        ...ispOwner.bpSettings,
        packageRate: Number.parseInt(values.packageRate),
        customerLimit: Number.parseInt(values.customerLimit),
        packType: values.packType,
        pack: values.pack,
        queueType: values.queueType,
        hasMikrotik: values.hasMikrotik,
        monthlyDueDate: billDate,
        executeBillingCycle: values.executeBillingCycle,
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

    // api call
    updateOwner(ispOwner.id, data, setIsLoading, dispatch);
  };

  //division & districts handle
  // const divisionHandle = (e) => {
  //   setDivision(e.target.selectedOptions[0].text);
  //   const divisionId = e.target.value;
  //   const districtsData = districts.filter(
  //     (dist) => dist.division_id === divisionId
  //   );
  //   setGetDistricts(districtsData);
  // };

  // const distrHandle = (e) => {
  //   setDistrict(e.target.selectedOptions[0].text);
  //   const districtId = e.target.value;
  //   const upazilasData = upazilas.filter(
  //     (dist) => dist.district_id === districtId
  //   );
  //   setGetUpazilas(upazilasData);
  // };

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
            <FtextField type="text" label={t("name")} name="name" />
            <FtextField type="text" label={t("company")} name="company" />
            <FtextField type="text" label={t("adress")} name="address" />
          </div>

          <div className="displayGrid3">
            <FtextField
              type="text"
              label={t("packageRate")}
              name="packageRate"
            />
            <FtextField
              type="text"
              label={t("customarLimit")}
              name="customerLimit"
            />

            {role === "superadmin" && (
              <FtextField
                type="text"
                label={t("SMSBalance")}
                name="smsBalance"
              />
            )}
          </div>
          <div className="displayGrid3">
            <div>
              <h6 className="mb-0">{t("packageType")}</h6>
              <Field
                as="select"
                name="packType"
                className="form-select mt-1 mb-4"
                aria-label="Default select example"
              >
                <option
                  value="Basic"
                  selected={ispOwner?.bpSettings?.packType === "Basic"}
                >
                  {t("basic")}
                </option>
                <option
                  value="Standard"
                  selected={ispOwner?.bpSettings?.packType === "Standard"}
                >
                  {t("standard")}
                </option>
              </Field>
            </div>

            <div>
              <h6 className="mb-0">{t("package")}</h6>
              <Field
                as="select"
                className="form-select"
                aria-label="Default select example"
                name="pack"
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
                <h6 className="mb-0">{t("paidStatus")}</h6>
                <Field
                  as="select"
                  className="form-select mt-1 mb-4"
                  aria-label="Default select example"
                  name="paymentStatus"
                >
                  <option value="paid"> {t("paid")}</option>
                  <option value="unpaid"> {t("unpaid")}</option>
                </Field>
              </div>
            )}

            <div>
              <h6 className="mb-0">{t("queueType")}</h6>
              <Field
                as="select"
                className="form-select mt-1 mb-4"
                aria-label="Default select example"
                name="queueType"
              >
                <option value="simple-queue">{t("simpleQueue")}</option>
                <option value="firewall-queue">{t("firewallQueue")}</option>
              </Field>
            </div>

            <div className="monthlyDueDate">
              <p className="customerFieldsTitle">{t("InvoiceDate")}</p>

              <div className="timeDate">
                <Field
                  value={billDate}
                  onChange={(e) => setBillDate(e.target.value)}
                  type="date"
                  name="monthlyDueDate"
                />
              </div>
            </div>

            <div>
              <h6 className="mb-0">{t("status")}</h6>
              <Field
                as="select"
                name="status"
                className="form-select mt-1 mb-4"
                aria-label="Default select example"
              >
                <option value="new" selected={ispOwner?.status === "new"}>
                  {t("new")}
                </option>
                <option value="active" selected={ispOwner?.status === "active"}>
                  {t("active")}
                </option>
                <option
                  value="inactive"
                  selected={ispOwner?.status === "inactive"}
                >
                  {t("inactive")}
                </option>
                <option value="banned" selected={ispOwner?.status === "banned"}>
                  {t("banned")}
                </option>
                <option
                  value="deleted"
                  selected={ispOwner?.status === "deleted"}
                >
                  {t("deleted")}
                </option>
              </Field>
            </div>
            <div>
              <h6 className="mb-0">Execute Billing Cycle</h6>
              <Field
                as="select"
                name="executeBillingCycle"
                className="form-select mt-1 mb-4"
                aria-label="Default select example"
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
          </div>
          {/* <div className="displayGrid3">
                      <div>
                        <h6 className="mb-0">Division</h6>
                        <Field
                          as="select"
                          className="form-select mt-1 mb-4"
                          aria-label="Default select example"
                          name="divisions"
                          onChange={(e) => {
                            divisionHandle(e);
                          }}
                        >
                          <option>Select</option>
                          {divisions?.map((divis) => (
                            <option
                              key={divis.long}
                              value={divis.id}
                              selected={divis.name === ispOwner?.division}
                            >
                              {divis.name}
                            </option>
                          ))}
                        </Field>
                      </div>
                      <div>
                        <h6 className="mb-0">District</h6>
                        <Field
                          as="select"
                          className="form-select mt-1 mb-4"
                          aria-label="Default select example"
                          name="districts"
                          onChange={(e) => {
                            distrHandle(e);
                          }}
                        >
                          <option>Select</option>
                          {getDistricts?.map((dist) => {
                            return (
                              <option
                                key={dist.long}
                                value={dist.id}
                                selected={dist.name === ispOwner?.district}
                              >
                                {dist.name}
                              </option>
                            );
                          })}
                        </Field>
                      </div>
                      <div>
                        <h6 className="mb-0">Upazila & Thana</h6>
                        <Field
                          as="select"
                          className="form-select mt-1 mb-4"
                          aria-label="Default select example"
                          name="upazilas"
                          onChange={(e) => setUpazila(e.target.value)}
                        >
                          <option>Select</option>
                          {getUpazilas?.map((upaz) => {
                            return (
                              <option
                                key={upaz.id}
                                value={upaz.name}
                                selected={upaz.name === ispOwner?.upazila}
                              >
                                {upaz.name}
                              </option>
                            );
                          })}
                        </Field>
                      </div>
                    </div> */}

          <div className="displayGrid3">
            {role === "superadmin" && (
              <FtextField
                type="text"
                label={t("referenceName")}
                name="referenceName"
              />
            )}

            <FtextField
              type="text"
              label={t("referenceMobile")}
              name="referenceMobile"
            />
            <div className="form-check mt-4">
              <Field
                className="form-check-input"
                type="checkbox"
                id="flexCheckChecked"
                name="hasMikrotik"
              />
              <label className="form-check-label" for="flexCheckChecked">
                {t("hasMikrotik")}
              </label>
            </div>
            {/* <div className="form-check mt-4">
                        <Field
                          className="form-check-input"
                          type="checkbox"
                          id="inventory"
                          name="inventory"
                        />
                        <label className="form-check-label" for="inventory">
                          Has Inventory
                        </label>
                      </div> */}
          </div>

          <div className="modal-footer" style={{ border: "none" }}>
            <button
              type="submit"
              className="btn btn-success"
              disabled={isLoading}
            >
              {isLoading ? <Loader /> : t("submit")}
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
  );
};

export default DetailsForm;
