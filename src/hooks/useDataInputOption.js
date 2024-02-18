import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { useEffect, useState } from "react";

// custom hook import
import useISPowner from "./useISPOwner";

//divisional location
import divisionsJSON from "../bdAddress/bd-divisions.json";
import districtsJSON from "../bdAddress/bd-districts.json";
import thanaJSON from "../bdAddress/bd-upazilas.json";
import { getNameId } from "../utils/getLocationName";

// internal import
import { informationEnBn } from "../components/common/tooltipInformation/informationEnBn";

const useDataInputOption = (inputPermission, page, status, data) => {
  const { t } = useTranslation();

  // current date
  const today = new Date();

  // get user & current user data form useISPOwner hook
  const { role, bpSettings, hasMikrotik, permission } = useISPowner();

  // get all mikrotik from redux store
  const mikrotiks = useSelector((state) => state?.mikrotik?.mikrotik);

  // get mikrotik and without mikrotik packages in redux store
  const ppPackage = useSelector((state) =>
    page === "pppoe"
      ? hasMikrotik
        ? state?.package?.pppoePackages
        : state?.package?.packages
      : ""
  );

  // get all area form redux store
  const areas = useSelector((state) => state?.area?.area);

  // get areas subarea form redux store
  const subAreas = useSelector((state) => state.area?.subArea);

  // get subareas poleBox form redux store
  const poleBox = useSelector((state) => state.area?.poleBox);

  // set change form data in state
  const [formData, setFormData] = useState({
    areaId: "",
    address: "",
    autoDisable: "",
    addStaff: false,
    balance: "",
    billingCycleDate: "",
    customerId: "",
    connectionDate: "",
    customerBillingType: "",
    connectionFee: "",
    comment: "",
    dateOFbirth: "",
    division: "",
    district: "",
    email: "",
    mikrotikId: "",
    mobile: "",
    name: "",
    nid: "",
    nextMonthAutoDisable: "",
    pppoeName: "",
    password: "",
    packageId: "",
    packageRate: "",
    packageName: "",
    promiseDate: "",
    poleBoxId: "",
    referenceName: "",
    referenceMobile: "",
    subAreaId: "",
    status: "",
    thana: "",
  });

  const packageChangeHandler = async (id) => {
    // find mikrotik package in pppoe packages
    const singlePackage = ppPackage.find((val) => val.id === id);

    // set single package data
    setFormData({
      ...formData,
      packageId: singlePackage.id,
      packageRate: singlePackage.rate,
      packageName: singlePackage.name,
    });
  };

  useEffect(() => {
    // set division district and thana in state
    const divisionId = getNameId(divisionsJSON.divisions, data?.division)?.id;
    const districtId = getNameId(districtsJSON.districts, data?.district)?.id;
    const thanaId = getNameId(thanaJSON.thana, data?.thana)?.id;

    // set customer initial data
    setFormData({
      ...formData,
      areaId: data?.area,
      address: data?.address,
      autoDisable: data?.autoDisable,
      balance: data?.balance,
      billingCycleDate: Date.parse(data?.billingCycle),
      customerId: data?.customerId,
      connectionDate: Date.parse(data?.connectionDate),
      customerBillingType: data?.customerBillingType,
      connectionFee: data?.connectionFee,
      comment: data?.pppoe?.comment,
      dateOFbirth: Date.parse(data?.birthDate),
      division: divisionId,
      district: districtId,
      email: data?.email,
      mikrotikId: data?.mikrotik,
      mobile: data?.mobile,
      name: data?.name,
      nid: data?.nid,
      nextMonthAutoDisable: data?.nextMonthAutoDisable,
      pppoeName: data?.pppoe?.name,
      password: data?.pppoe?.password,
      packageId: data?.mikrotikPackage,
      packageRate: data?.monthlyFee,
      packageName: data?.pppoe?.profile,
      promiseDate: Date.parse(data?.promiseDate),
      poleBoxId: data?.poleBox,
      referenceName: data?.referenceName,
      referenceMobile: data?.referenceMobile,
      subAreaId: data?.subArea,
      status: data?.status,
      thana: thanaId,
    });
  }, [data]);

  // option validation schema
  const validationSchema = Yup.object({
    address: Yup.string(),
    customerId:
      !bpSettings?.genCustomerId && Yup.string().required(t("selectCustomer")),
    connectionFee: Yup.number(),
    customerBillingType: Yup.string().required(t("select billing type")),
    comment: Yup.string(),
    email: Yup.string().email(t("incorrectEmail")),
    monthlyFee: Yup.number().integer().min(0, t("minimumPackageRate")),
    mobile: bpSettings?.addCustomerWithMobile
      ? Yup.string()
          .matches(/^(01){1}[3456789]{1}(\d){8}$/, t("incorrectMobile"))
          .min(11, t("write11DigitMobileNumber"))
          .max(11, t("over11DigitMobileNumber"))
          .required(t("writeMobileNumber"))
      : Yup.string()
          .matches(/^(01){1}[3456789]{1}(\d){8}$/, t("incorrectMobile"))
          .min(11, t("write11DigitMobileNumber"))
          .max(11, t("over11DigitMobileNumber")),
    name: Yup.string().required(t("writeCustomerName")),
    nid: Yup.string().matches(/^(?:\d{10}|\d{13}|\d{17})$/, t("invalidNID")),
    pppoeName: Yup.string().required(t("writePPPoEName")),
    password: Yup.string().required(t("writePPPoEPassword")),
    referenceMobile: Yup.string()
      .matches(/^(01){1}[3456789]{1}(\d){8}$/, t("incorrectMobile"))
      .min(11, t("write11DigitMobileNumber"))
      .max(11, t("over11DigitMobileNumber")),
  });

  // input initial values
  const inputInitialValues = {
    area: formData.areaId || "",
    address: formData.address || "",
    billingCycle: formData.billingCycleDate || today,
    balance: Number(formData.balance) || 0,
    birthDate: formData.dateOFbirth || "",
    customerId: formData.customerId || "",
    connectionFee: Number(formData.connectionFee) || 0,
    customerBillingType: formData.customerBillingType || "prepaid",
    connectionDate: formData.connectionDate || today,
    comment: formData.comment || "",
    division: formData.division || "",
    district: formData.district || "",
    email: formData.email || "",
    monthlyFee: Number(formData.packageRate) || 0,
    mikrotik: formData.mikrotikId || "",
    mikrotikPackage: formData.packageId || "",
    mobile: formData.mobile || "",
    name: formData.name || "",
    nid: formData.nid || "",
    pppoeName: formData.pppoeName || "",
    promiseDate: formData.promiseDate || today,
    password: formData.password || "",
    poleBox: formData.poleBoxId || "",
    referenceName: formData.referenceName || "",
    referenceMobile: formData.referenceMobile || "",
    subArea: formData.subAreaId || "",
    status: formData.status || "active",
    thana: formData.thana || "",
    profile: formData.packageName,
  };

  // data input options
  const inputOption = [
    {
      name: "customerId",
      type: "text",
      id: "customerId",
      isVisible: !bpSettings.genCustomerId && inputPermission.customerId,
      disabled: false,
      validation: !bpSettings.genCustomerId,
      label: t("customerId"),
      placeholder: "e.g. ID: ABC-123-XYZ",
      onChange: (e) => {
        setFormData({
          ...formData,
          customerId: e.target.value,
        });
      },
    },
    {
      name: "mikrotik",
      as: "select",
      type: "select",
      id: "mikrotik",
      isVisible: bpSettings.hasMikrotik && inputPermission.mikrotik,
      disabled: status === "edit" ? true : false,
      validation: true,
      label: t("selectMikrotik"),
      firstOptions: t("selectMikrotik"),
      textAccessor: "name",
      valueAccessor: "id",
      options: mikrotiks,
      onChange: (e) => {
        setFormData({
          ...formData,
          mikrotikId: e.target.value,
        });
      },
      info: status === "edit" && informationEnBn()?.[2],
    },
    {
      name: "mikrotikPackage",
      as: "select",
      type: "select",
      id: "mikrotikPackage",
      isVisible: inputPermission.mikrotikPackage,
      disabled: bpSettings.hasMikrotik ? !formData.mikrotikId : false,
      validation: true,
      label: t("selectPackage"),
      firstOptions: t("selectPackage"),
      textAccessor: "name",
      valueAccessor: "id",
      options:
        bpSettings.hasMikrotik && page
          ? ppPackage?.filter((pack) => pack.mikrotik === formData.mikrotikId)
          : ppPackage,
      onChange: (e) => {
        packageChangeHandler(e.target.value);
      },
    },
    {
      name: "monthlyFee",
      type: "number",
      id: "monthlyFee",
      isVisible: inputPermission.monthlyFee,
      disabled: status ? !formData.packageId : false,
      validation: true,
      label: t("monthlyFee"),
      placeholder: "0",
      onChange: (e) => {
        setFormData({
          ...formData,
          packageRate: e.target.value,
        });
      },
    },
    {
      name: "balance",
      type: "number",
      id: "balance",
      isVisible: inputPermission.balance,
      disabled: status ? !formData.packageId : false,
      validation: false,
      label: t("balance"),
      placeholder: "0",
      onChange: (e) => {
        setFormData({
          ...formData,
          balance: e.target.value,
        });
      },
    },
    {
      name: "pppoeName",
      type: "text",
      id: "pppoeName",
      isVisible: inputPermission.pppoeName,
      disabled: status ? !formData.packageId : false,
      validation: true,
      label: t("PPPoEName"),
      placeholder: "e.g. PPPoE-Name",
      onChange: (e) => {
        setFormData({
          ...formData,
          pppoeName: e.target.value,
        });
      },
    },
    {
      name: "password",
      type: "text",
      id: "password",
      isVisible: inputPermission.password,
      disabled: status ? !formData.packageId : false,
      validation: true,
      label: t("password"),
      placeholder: "e.g. Password: ********",
      onChange: (e) => {
        setFormData({
          ...formData,
          password: e.target.value,
        });
      },
    },
    {
      name: "area",
      as: "select",
      type: "select",
      id: "area",
      isVisible: inputPermission.area,
      disabled: status ? !formData.packageId : false,
      validation: true,
      label: t("selectArea"),
      firstOptions: t("selectArea"),
      textAccessor: "name",
      valueAccessor: "id",
      options: areas,
      onChange: (e) => {
        setFormData({
          ...formData,
          areaId: e.target.value,
        });
      },
    },
    {
      name: "subArea",
      as: "select",
      type: "select",
      id: "subArea",
      isVisible: inputPermission.subArea,
      disabled: status ? !formData.packageId : false,
      validation: true,
      label: t("selectSubArea"),
      firstOptions: t("selectSubArea"),
      textAccessor: "name",
      valueAccessor: "id",
      options: subAreas.filter((item) => item?.area === formData.areaId),
      onChange: (e) => {
        setFormData({
          ...formData,
          subAreaId: e.target.value,
        });
      },
    },
    {
      name: "poleBox",
      as: "select",
      type: "select",
      id: "poleBox",
      isVisible: bpSettings.poleBox && inputPermission.poleBox,
      disabled: status ? !formData.packageId : false,
      validation: false,
      label: t("selectPoleBox"),
      firstOptions: t("selectPoleBox"),
      textAccessor: "name",
      valueAccessor: "id",
      options: poleBox.filter((item) => item?.subArea === formData.subAreaId),
      onChange: (e) => {
        setFormData({
          ...formData,
          poleBoxId: e.target.value,
        });
      },
    },
    {
      name: "name",
      type: "text",
      id: "name",
      isVisible: inputPermission.name,
      disabled: status ? !formData.packageId : false,
      validation: true,
      label: t("name"),
      placeholder: "e.g. Name",
      onChange: (e) => {
        setFormData({
          ...formData,
          name: e.target.value,
        });
      },
    },
    {
      name: "mobile",
      type: "text",
      id: "mobile",
      isVisible: inputPermission.mobile,
      disabled: status
        ? !formData.packageId
        : false || (!permission?.customerMobileEdit && role === "collector"),
      validation: page ? bpSettings?.addCustomerWithMobile : true,
      label: t("mobile"),
      placeholder: "+8801XXXXXXXXX",
      onChange: (e) => {
        setFormData({
          ...formData,
          mobile: e.target.value,
        });
      },
    },
    {
      name: "nid",
      type: "text",
      id: "nid",
      isVisible: inputPermission.nid,
      disabled: status ? !formData.packageId : false,
      validation: page ? false : true,
      label: t("NIDno"),
      placeholder: "e.g. 10,13 or 17 digits",
      onChange: (e) => {
        setFormData({
          ...formData,
          nid: e.target.value,
        });
      },
    },
    {
      name: "birthDate",
      type: "date",
      id: "birthDate",
      isVisible: inputPermission.birthDate,
      disabled: status ? !formData.packageId : false,
      validation: false,
      label: t("birthDate"),
      placeholderText: "YYYY MM DD",
      component: "DatePicker",
      dateFormat: "yyyy MM dd",
      showYearDropdown: "showYearDropdown",
      scrollableYearDropdown: "scrollableYearDropdown",
      yearDropdownItemNumber: 150,
      onChange: (date) => {
        setFormData({
          ...formData,
          dateOFbirth: date,
        });
      },
    },
    {
      name: "address",
      type: "text",
      id: "address",
      isVisible: inputPermission.address,
      disabled: status ? !formData.packageId : false,
      validation: page ? false : true,
      label: t("address"),
      onChange: (e) => {
        setFormData({
          ...formData,
          address: e.target.value,
        });
      },
    },
    {
      name: "email",
      type: "text",
      id: "email",
      isVisible: inputPermission.email,
      disabled: status ? !formData.packageId : false,
      validation: page ? false : true,
      label: t("email"),
      placeholder: "***@mail.com",
      onChange: (e) => {
        setFormData({
          ...formData,
          email: e.target.value,
        });
      },
    },
    {
      name: "billingCycle",
      type: "date",
      id: "billingCycle",
      isVisible: inputPermission.billingCycle,
      disabled: status ? !formData.packageId : false,
      validation: true,
      label: t("billingCycle"),
      placeholderText: "YYYY MM DD HH:mm A",
      component: "DatePicker",
      dateFormat: "yyyy MM dd hh:mm a",
      timeIntervals: 60,
      showTimeSelect: "showTimeSelect",
      onChange: (date) => {
        setFormData({
          ...formData,
          billingCycleDate: date,
        });
      },
    },
    {
      name: "promiseDate",
      type: "date",
      id: "promiseDate",
      isVisible: bpSettings?.promiseDate && inputPermission.promiseDate,
      disabled: status ? !formData.packageId : false,
      validation: false,
      label: t("promiseDate"),
      placeholderText: "YYYY MM DD HH:mm A",
      component: "DatePicker",
      dateFormat: "yyyy MM dd hh:mm a",
      timeIntervals: 60,
      showTimeSelect: "showTimeSelect",
      onChange: (date) => {
        setFormData({
          ...formData,
          promiseDate: date,
        });
      },
    },
    {
      name: "connectionDate",
      type: "date",
      id: "connectionDate",
      isVisible: inputPermission.connectionDate,
      disabled: status ? !formData.packageId : false,
      validation: false,
      label: t("connectionDate"),
      placeholderText: "YYYY MM DD HH:mm A",
      component: "DatePicker",
      dateFormat: "yyyy MM dd hh:mm a",
      timeIntervals: 60,
      showTimeSelect: "showTimeSelect",
      onChange: (date) => {
        setFormData({
          ...formData,
          connectionDate: date,
        });
      },
    },
    {
      name: "connectionFee",
      type: "number",
      id: "connectionFee",
      isVisible: inputPermission.connectionFee,
      disabled: status ? !formData.packageId : false,
      validation: false,
      label: t("connectionFee"),
      onChange: (e) => {
        setFormData({
          ...formData,
          connectionFee: e.target.value,
        });
      },
    },
    {
      name: "customerBillingType",
      as: "select",
      type: "select",
      id: "customerBillingType",
      isVisible: inputPermission.customerBillingType,
      disabled: status ? !formData.packageId : false,
      validation: true,
      label: t("customerBillType"),
      firstOptions: t("customerBillType"),
      textAccessor: "name",
      valueAccessor: "value",
      options: [
        {
          value: "prepaid",
          name: t("prepaid"),
        },
        {
          value: "postpaid",
          name: t("postPaid"),
        },
      ],
      onChange: (e) => {
        setFormData({
          ...formData,
          customerBillingType: e.target.value,
        });
      },
    },
    {
      name: "division",
      as: "select",
      type: "select",
      id: "division",
      isVisible: inputPermission.division,
      disabled: status ? !formData.packageId : false,
      validation: false,
      label: t("selectDivision"),
      firstOptions: t("selectDivision"),
      textAccessor: "name",
      valueAccessor: "id",
      options: divisionsJSON.divisions,
      onChange: (e) => {
        setFormData({
          ...formData,
          division: e.target.value,
        });
      },
    },
    {
      name: "district",
      as: "select",
      type: "select",
      id: "district",
      isVisible: inputPermission.district,
      disabled: status ? !formData.packageId : false,
      validation: false,
      label: t("selectDistrict"),
      firstOptions: t("selectDistrict"),
      textAccessor: "name",
      valueAccessor: "id",
      options: districtsJSON?.districts.filter(
        (item) => item.division_id === formData.division
      ),
      onChange: (e) => {
        setFormData({
          ...formData,
          district: e.target.value,
        });
      },
    },
    {
      name: "thana",
      as: "select",
      type: "select",
      id: "thana",
      isVisible: inputPermission.thana,
      disabled: status ? !formData.packageId : false,
      validation: false,
      label: t("selectThana"),
      firstOptions: t("selectThana"),
      textAccessor: "name",
      valueAccessor: "id",
      options: thanaJSON?.thana.filter(
        (item) => item.district_id === formData.district
      ),
      onChange: (e) => {
        setFormData({
          ...formData,
          thana: e.target.value,
        });
      },
    },
    {
      name: "comment",
      type: "text",
      id: "comment",
      isVisible: inputPermission.comment,
      disabled: status ? !formData.packageId : false,
      validation: false,
      label: t("comment"),
      onChange: (e) => {
        setFormData({
          ...formData,
          comment: e.target.value,
        });
      },
    },
    {
      name: "status",
      isVisible: inputPermission.status,
      disabled: false,
      validation: true,
      label: t("status"),
      component: "customerStatus",
      inputField: [
        {
          type: "radio",
          id: "activeCustomer",
          isVisible: true,
          disabled: false,
          label: t("active"),
          value: "active",
        },
        {
          type: "radio",
          id: "inactiveCustomer",
          isVisible: true,
          disabled: false,
          label: t("inactive"),
          value: "inactive",
        },
        {
          type: "radio",
          id: "expiredCustomer",
          isVisible: page ? true : false,
          disabled: true,
          label: t("expired"),
          value: "expired",
        },
      ],
      onChange: (e) => {
        setFormData({
          ...formData,
          status: e.target.value,
        });
      },
    },
    {
      name: "referenceName",
      type: "text",
      id: "referenceName",
      isVisible: inputPermission.referenceName,
      disabled: status ? !formData.packageId : false,
      validation: false,
      label: t("referenceName"),
      placeholder: "e.g. Name",
      onChange: (e) => {
        setFormData({
          ...formData,
          referenceName: e.target.value,
        });
      },
    },
    {
      name: "referenceMobile",
      type: "text",
      id: "referenceMobile",
      isVisible: inputPermission.referenceMobile,
      disabled: status ? !formData.packageId : false,
      validation: false,
      label: t("referenceMobile"),
      placeholder: "+8801XXXXXXXXX",
      onChange: (e) => {
        setFormData({
          ...formData,
          referenceMobile: e.target.value,
        });
      },
    },
    // {
    //   name: "autoDisable",
    //   type: "checkbox",
    //   id: "autoDisable",
    //   isVisible: bpSettings.hasMikrotik && inputPermission.autoDisable,
    //   disabled: formData.nextMonthAutoDisable,
    //   label: t("autoConnectionOnOf"),
    //   component: "willContinue",
    //   onChange: (e) => {
    //     setFormData({
    //       ...formData,
    //       autoDisable: e.target.checked,
    //     });
    //   },
    // },
    // {
    //   name: "nextMonthAutoDisable",
    //   type: "checkbox",
    //   id: "nextMonthAutoDisable",
    //   isVisible: bpSettings.hasMikrotik && inputPermission.nextMonthAutoDisable,
    //   disabled: formData.autoDisable,
    //   // label: t("autoConnectionOnOf"),
    //   component: "nextMonth",
    //   onChange: (e) => {
    //     setFormData({
    //       ...formData,
    //       nextMonthAutoDisable: e.target.checked,
    //     });
    //   },
    // },

    // staff add input option
    {
      name: "addStaff",
      isVisible: inputPermission.addStaff,
      disabled: false,
      validation: false,
      label: t("addStaff"),
      component: "addStaff",
      onChange: (e) => {
        setFormData({
          addStaff: e.target.checked,
        });
      },
      inputField: [
        {
          type: "checkbox",
          id: "addStaff",
          isVisible: true,
          disabled: false,
          label: t("addStaff"),
          checked: formData.addStaff,
          value: formData.addStaff,
        },
      ],
    },
    {
      name: "salary",
      type: "number",
      id: "salary",
      isVisible: formData.addStaff && inputPermission.salary,
      disabled: false,
      validation: false,
      label: t("salary"),
    },
    {
      name: "website",
      type: "text",
      id: "website",
      isVisible: inputPermission.website,
      disabled: false,
      validation: true,
      label: t("website"),
    },
    // {
    //   name: "commissionType",
    //   className: "displayGrid2",
    //   isVisible: inputPermission.commissionType,
    //   disabled: false,
    //   validation: true,
    //   label: t("commissionType"),
    //   component: "customerStatus",
    //   inputField: [
    //     {
    //       type: "radio",
    //       id: "globalPakcage",
    //       isVisible: true,
    //       disabled: false,
    //       label: t("globalCommission"),
    //       value: "global",
    //     },
    //     {
    //       type: "radio",
    //       id: "fixedPackage",
    //       isVisible: true,
    //       disabled: false,
    //       label: t("packageBased"),
    //       value: "packageBased",
    //     },
    //   ],
    // },
    // {
    //   name: "commissionRate",
    //   type: "number",
    //   id: "commissionRate",
    //   isVisible: commissionType === "global" && inputPermission.commissionRate,
    //   disabled: false,
    //   validation: true,
    //   label: t("website"),
    // },
    // {
    //   name: "isp",
    //   type: "number",
    //   id: "isp",
    //   isVisible: commissionType === "global" && inputPermission.isp,
    //   disabled: false,
    //   validation: true,
    //   label: t("ispOwner"),
    // },
  ];

  return {
    inputOption,
    inputInitialValues,
    validationSchema,
  };
};

export default useDataInputOption;
