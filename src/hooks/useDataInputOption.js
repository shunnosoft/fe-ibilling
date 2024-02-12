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

  // set change form data in state
  const [formData, setFormData] = useState({
    areaId: "",
    autoDisable: false,
    addStaff: false,
    billingCycleDate: new Date(),
    connectionDate: new Date(),
    dateOFbirth: new Date(),
    division: "",
    district: "",
    mikrotikId: "",
    nextMonthAutoDisable: false,
    packageId: "",
    packageRate: "",
    packageName: "",
    promiseDate: new Date(),
    subAreaId: "",
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
      autoDisable: data?.autoDisable,
      billingCycleDate: data?.billingCycle,
      connectionDate: data?.connectionDate,
      dateOFbirth: Date.parse(data?.birthDate),
      division: divisionId,
      district: districtId,
      mikrotikId: data?.mikrotik,
      nextMonthAutoDisable: data?.nextMonthAutoDisable,
      packageId: data?.mikrotikPackage,
      packageRate: data?.monthlyFee,
      packageName: data?.pppoe?.profile,
      promiseDate: data?.promiseDate,
      subAreaId: data?.subArea,
      thana: thanaId,
    });
  }, [data]);

  // input initial values
  const inputInitialValues = {
    address: data?.address || "",
    billingCycle: formData.billingCycleDate,
    balance: data?.balance || 0,
    birthDate: formData.dateOFbirth,
    customerId: data?.customerId || "",
    connectionFee: data?.connectionFee || 0,
    customerBillingType: data?.customerBillingType || "prepaid",
    connectionDate: formData.connectionDate,
    comment: data?.pppoe?.comment || "",
    division: formData.division || "",
    district: formData.district || "",
    email: data?.email || "",
    monthlyFee: Number(formData.packageRate),
    mikrotik: data?.mikrotik || "",
    mikrotikPackage: data?.mikrotikPackage || "",
    mobile: data?.mobile || "",
    name: data?.name || "",
    nid: data?.nid || "",
    pppoeName: data?.pppoe?.name || "",
    promiseDate: formData.promiseDate,
    password: data?.pppoe?.password || "",
    poleBox: data?.poleBox || "",
    subArea: data?.subArea || "",
    status: data?.status || "",
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
      value: formData.mikrotikId,
      onChange: (e) => {
        setFormData({
          ...formData,
          mikrotikId: e.target.value,
        });
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
          ? ppPackage?.filter((pack) => pack.mikrotik === formData.mikrotikId)
          : ppPackage,
      value: formData.packageId,
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
      value: formData.packageRate,
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
      disabled: false,
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
      disabled: false,
      validation: false,
      label: t("selectPoleBox"),
      firstOptions: t("selectPoleBox"),
      textAccessor: "name",
      valueAccessor: "id",
      options: poleBox.filter((item) => item?.subArea === formData.subAreaId),
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
      value: formData.dateOFbirth,
      onChange: (e) => {
        setFormData({
          ...formData,
          dateOFbirth: e.target.value,
        });
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
      disabled: false,
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
      disabled: false,
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
    //   name: "autoDisable",
    //   type: "checkbox",
    //   id: "autoDisable",
    //   isVisible: bpSettings.hasMikrotik && inputPermission.autoDisable,
    //   disabled: formData.nextMonthAutoDisable,
    //   label: t("willContinue"),
    //   component: "autoDisable",
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
    //   label: t("nextMonth"),
    //   component: "nextMonthAutoDisable",
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
  };
};

export default useDataInputOption;
