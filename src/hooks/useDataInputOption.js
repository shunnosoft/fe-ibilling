import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

// custom hook import
import useISPowner from "./useISPOwner";
import { useEffect, useState } from "react";

//divisional location
import divisionsJSON from "../bdAddress/bd-divisions.json";
import districtsJSON from "../bdAddress/bd-districts.json";
import thanaJSON from "../bdAddress/bd-upazilas.json";
import { getNameId } from "../utils/getLocationName";
import { informationEnBn } from "../components/common/tooltipInformation/informationEnBn";

const useDataInputOption = (inputPermission, page, status, data) => {
  const { t } = useTranslation();

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

  // set mikrotik id in state
  const [mikrotikId, setMikrotikId] = useState("");

  // set package id in state
  const [packageId, setPackageId] = useState("");

  // set package rate in state
  const [packageRate, setPackageRate] = useState("");

  // set mikrotik package name in state
  const [packageName, setPackageName] = useState("");

  // set billing cycle date in state
  const [billingCycleDate, setBillingCycleDate] = useState(new Date());

  // set date of birth in state
  const [dateOFbirth, setDateOFBirth] = useState(new Date());

  // set connection date in state
  const [connectionDate, setConnectionDate] = useState(new Date());

  // set promise date in state
  const [promiseDate, setPromiseDate] = useState(new Date());

  // set divisional area in state
  const [divisionalArea, setDivisionalArea] = useState({
    division: "",
    district: "",
    thana: "",
  });

  // set area id in state
  const [areaId, setAreaId] = useState("");

  // set subArea id in state
  const [subAreaId, setSubareaId] = useState("");

  // set division district and thana in state
  const [divisionId, setDivisionId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [thanaId, setThanaId] = useState("");

  // set auto disable in state
  const [autoDisable, setAutoDisable] = useState(false);

  // set next month auto disable in state
  const [nextMonthAutoDisable, setNextMonthAutoDisable] = useState(false);

  // set add staff status
  const [addStaffStatus, setAddStaffStatus] = useState(false);
  const [birthDate, setBirthDate] = useState();

  // set isp owner & reseller commission type in state
  const [commissionType, setCommissionType] = useState("");

  const packageChangeHandler = async (id) => {
    const singlePackage = ppPackage.find((val) => val.id === id);

    // set package id in state
    setPackageId(singlePackage.id);

    // set package rate in state
    setPackageRate(singlePackage.rate);

    // set package name in state
    setPackageName(singlePackage.name);
  };

  useEffect(() => {
    // set billing cycle date in state
    setBillingCycleDate(data?.billingCycle);

    // set date of birth in state
    setDateOFBirth(data?.birthDate);

    // set connection date in state
    setConnectionDate(data?.connectionDate);

    // set mikrotik id in state
    setMikrotikId(data?.mikrotik);

    // set package id in state
    setPackageId(data?.mikrotikPackage);

    // set area id in state
    setAreaId(data?.area);

    // set auto disable in state
    setAutoDisable(data?.autoDisable);

    // set next month auto disable in state
    setNextMonthAutoDisable(data?.nextMonthAutoDisable);

    // set package rate in state
    setPackageRate(data?.monthlyFee);

    // set promise date in state
    setPromiseDate(data?.promiseDate);

    // set package name in state
    setPackageName(data?.pppoe?.profile);

    // set subarea id in state
    setSubareaId(data?.subAreaId);

    // set division district and thana in state
    const division_id = getNameId(divisionsJSON.divisions, data?.division)?.id;
    const district_id = getNameId(districtsJSON.districts, data?.district)?.id;
    const thana_id = getNameId(thanaJSON.thana, data?.thana)?.id;

    setDivisionId(division_id);
    setDistrictId(district_id);
    setThanaId(thana_id);
  }, [data]);

  // input initial values
  const inputInitialValues = {
    address: data?.address || "",
    billingCycle: billingCycleDate,
    balance: data?.balance || 0,
    birthDate: dateOFbirth,
    customerId: !bpSettings.genCustomerId && data?.customerId,
    connectionFee: data?.connectionFee || 0,
    customerBillingType: data?.customerBillingType || "prepaid",
    connectionDate: connectionDate,
    comment: data?.pppoe?.comment || "",
    division: divisionalArea.division || "",
    district: divisionalArea.district || "",
    email: data?.email || "",
    monthlyFee: Number(packageRate),
    mikrotik: data?.mikrotik || "",
    mikrotikPackage: data?.mikrotikPackage || "",
    mobile: data?.mobile || "",
    name: data?.name || "",
    nid: data?.nid || "",
    pppoeName: data?.pppoe?.name || "",
    promiseDate: promiseDate,
    password: data?.pppoe?.password || "",
    poleBox: data?.poleBox || "",
    subArea: data?.subArea || "",
    status: data?.status || "",
    thana: divisionalArea.thana || "",
    profile: packageName,
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
      value: mikrotikId,
      onChange: (e) => {
        setMikrotikId(e.target.value);
      },
      info: informationEnBn()?.[2],
    },
    {
      name: "mikrotikPackage",
      as: "select",
      type: "select",
      id: "mikrotikPackage",
      isVisible: inputPermission.mikrotikPackage,
      disabled: false,
      validation: true,
      label: t("selectPackage"),
      firstOptions: t("selectPackage"),
      textAccessor: "name",
      valueAccessor: "id",
      options:
        bpSettings.hasMikrotik && page
          ? ppPackage?.filter((pack) => pack.mikrotik === mikrotikId)
          : ppPackage,
      value: packageId,
      onChange: (e) => {
        packageChangeHandler(e.target.value);
      },
    },
    {
      name: "monthlyFee",
      type: "number",
      id: "monthlyFee",
      isVisible: inputPermission.monthlyFee,
      disabled: false,
      validation: true,
      label: t("monthlyFee"),
      value: packageRate,
      onChange: (e) => {
        setPackageRate(e.target.value);
      },
    },
    {
      name: "balance",
      type: "number",
      id: "balance",
      isVisible: !bpSettings.hasMikrotik && inputPermission.balance,
      disabled: false,
      label: t("balance"),
    },
    {
      name: "pppoeName",
      type: "text",
      id: "pppoeName",
      isVisible: inputPermission.pppoeName,
      disabled: false,
      validation: true,
      label: t("PPPoEName"),
    },
    {
      name: "password",
      type: "text",
      id: "password",
      isVisible: inputPermission.password,
      disabled: false,
      validation: true,
      label: t("password"),
      component: "password", // input as password type field base on component
    },
    {
      name: "area",
      as: "select",
      type: "select",
      id: "area",
      isVisible: inputPermission.area,
      disabled: false,
      validation: true,
      label: t("selectArea"),
      firstOptions: t("selectArea"),
      textAccessor: "name",
      valueAccessor: "id",
      options: areas,
      onChange: (e) => {
        setAreaId(e.target.value);
      },
    },
    {
      name: "subArea",
      as: "select",
      type: "select",
      id: "subArea",
      isVisible: inputPermission.subArea,
      disabled: false,
      validation: true,
      label: t("selectSubArea"),
      firstOptions: t("selectSubArea"),
      textAccessor: "name",
      valueAccessor: "id",
      options: subAreas.filter((item) => item?.area === areaId),
      onChange: (e) => {
        setSubareaId(e.target.value);
      },
    },
    {
      name: "poleBox",
      as: "select",
      type: "select",
      id: "poleBox",
      isVisible: bpSettings.poleBox && inputPermission.poleBox,
      disabled: false,
      validation: false,
      label: t("selectPoleBox"),
      firstOptions: t("selectPoleBox"),
      textAccessor: "name",
      valueAccessor: "id",
      options: poleBox.filter((item) => item?.subArea === subAreaId),
    },
    {
      name: "name",
      type: "text",
      id: "name",
      isVisible: inputPermission.name,
      disabled: false,
      validation: true,
      label: t("name"),
    },
    {
      name: "mobile",
      type: "text",
      id: "mobile",
      isVisible: inputPermission.mobile,
      disabled: !permission?.customerMobileEdit && role === "collector",
      validation: page ? bpSettings?.addCustomerWithMobile : true,
      label: t("mobile"),
      placeholder: "+8801XXXXXXXXX",
    },
    {
      name: "nid",
      type: "text",
      id: "nid",
      isVisible: inputPermission.nid,
      disabled: false,
      validation: page ? false : true,
      label: t("NIDno"),
      placeholder: "e.g. 10,13 or 17 digits",
    },
    {
      name: "birthDate",
      type: "date",
      id: "birthDate",
      isVisible: inputPermission.birthDate,
      disabled: false,
      validation: false,
      label: t("birthDate"),
      placeholderText: "YYYY MM DD",
      component: "DatePicker",
      dateFormat: "yyyy MM dd",
      showYearDropdown: "showYearDropdown",
      scrollableYearDropdown: "scrollableYearDropdown",
      yearDropdownItemNumber: 150,
      value: birthDate,
      onChange: (e) => {
        setBirthDate(e.target.value);
      },
    },
    {
      name: "address",
      type: "text",
      id: "address",
      isVisible: inputPermission.address,
      disabled: false,
      validation: page ? false : true,
      label: t("address"),
    },
    {
      name: "email",
      type: "text",
      id: "email",
      isVisible: inputPermission.email,
      disabled: false,
      validation: page ? false : true,
      label: t("email"),
      placeholder: "***@mail.com",
    },
    {
      name: "billingCycle",
      type: "date",
      id: "billingCycle",
      isVisible: inputPermission.billingCycle,
      disabled: false,
      validation: true,
      label: t("billingCycle"),
      placeholderText: "YYYY MM DD HH:mm A",
      component: "DatePicker",
      dateFormat: "yyyy MM dd hh:mm a",
      timeIntervals: 60,
      showTimeSelect: "showTimeSelect",
    },
    {
      name: "promiseDate",
      type: "date",
      id: "promiseDate",
      isVisible: bpSettings?.promiseDate && inputPermission.promiseDate,
      disabled: false,
      validation: false,
      label: t("promiseDate"),
      placeholderText: "YYYY MM DD HH:mm A",
      component: "DatePicker",
      dateFormat: "yyyy MM dd hh:mm a",
      timeIntervals: 60,
      showTimeSelect: "showTimeSelect",
    },
    {
      name: "connectionDate",
      type: "date",
      id: "connectionDate",
      isVisible: inputPermission.connectionDate,
      disabled: false,
      validation: false,
      label: t("connectionDate"),
      placeholderText: "YYYY MM DD HH:mm A",
      component: "DatePicker",
      dateFormat: "yyyy MM dd hh:mm a",
      timeIntervals: 60,
      showTimeSelect: "showTimeSelect",
    },
    {
      name: "connectionFee",
      type: "number",
      id: "connectionFee",
      isVisible: inputPermission.connectionFee,
      disabled: false,
      validation: false,
      label: t("connectionFee"),
    },
    {
      name: "customerBillingType",
      as: "select",
      type: "select",
      id: "customerBillingType",
      isVisible: inputPermission.customerBillingType,
      disabled: false,
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
    },
    {
      name: "division",
      as: "select",
      type: "select",
      id: "division",
      isVisible: inputPermission.division,
      disabled: false,
      validation: false,
      label: t("selectDivision"),
      firstOptions: t("selectDivision"),
      textAccessor: "name",
      valueAccessor: "id",
      options: divisionsJSON.divisions,
      onChange: (e) => {
        setDivisionId(e.target.value);
      },
    },
    {
      name: "district",
      as: "select",
      type: "select",
      id: "district",
      isVisible: inputPermission.district,
      disabled: false,
      validation: false,
      label: t("selectDistrict"),
      firstOptions: t("selectDistrict"),
      textAccessor: "name",
      valueAccessor: "id",
      options: districtsJSON?.districts.filter(
        (item) => item.division_id === divisionId
      ),
      onChange: (e) => {
        setDistrictId(e.target.value);
      },
    },
    {
      name: "thana",
      as: "select",
      type: "select",
      id: "thana",
      isVisible: inputPermission.thana,
      disabled: false,
      validation: false,
      label: t("selectThana"),
      firstOptions: t("selectThana"),
      textAccessor: "name",
      valueAccessor: "id",
      options: thanaJSON?.thana.filter(
        (item) => item.district_id === districtId
      ),
      onChange: (e) => {
        setThanaId(e.target.value);
      },
    },
    {
      name: "comment",
      type: "text",
      id: "comment",
      isVisible: inputPermission.comment,
      disabled: false,
      validation: false,
      label: t("comment"),
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
    },
    // {
    //   name: {
    //     autoDisable: "autoDisable",
    //     nextMonthAutoDisable: "nextMonthAutoDisable",
    //   },
    //   isVisible: bpSettings.hasMikrotik && inputPermission.autoDisable,
    //   disabled: false,
    //   validation: false,
    //   label: t("automaticConnectionOff"),
    //   component: "autoDisable",
    //   inputField: [
    //     {
    //       name: "autoDisable",
    //       type: "checkbox",
    //       id: "autoDisable",
    //       disabled: nextMonthAutoDisable,
    //       label: t("willContinue"),
    //       checked: autoDisable,
    //       value: autoDisable,
    //       onChange: (e) => {
    //         setAutoDisable(e.target.checked);
    //       },
    //     },
    //     {
    //       name: "nextMonthAutoDisable",
    //       type: "checkbox",
    //       id: "nextMonthAutoDisable",
    //       disabled: autoDisable,
    //       label: t("nextMonth"),
    //       checked: nextMonthAutoDisable,
    //       value: nextMonthAutoDisable,
    //       onChange: (e) => {
    //         setNextMonthAutoDisable(e.target.checked);
    //       },
    //     },
    //   ],
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
        setAddStaffStatus(e.target.checked);
      },
      inputField: [
        {
          type: "checkbox",
          id: "addStaff",
          isVisible: true,
          disabled: false,
          label: t("addStaff"),
          checked: addStaffStatus,
          value: addStaffStatus,
        },
      ],
    },
    {
      name: "salary",
      type: "number",
      id: "salary",
      isVisible: addStaffStatus && inputPermission.salary,
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
  };
};

export default useDataInputOption;
