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
import { getResellerPackageRate } from "../features/apiCallReseller";
import {
  getCustomerDayLeft,
  getMonthStartDay,
} from "../pages/Customer/customerCRUD/customerBillDayPromiseDate";

const useDataInputOption = (inputPermission, page, status, data) => {
  const { t } = useTranslation();

  // current date
  const today = new Date();

  // get user & current user data form useISPOwner hook
  const {
    role,
    bpSettings,
    userType,
    hasMikrotik,
    resellerData,
    userData,
    permission,
    permissions,
  } = useISPowner();

  // admin staff user role permission
  const adminUser =
    role === "ispOwner" ||
    role === "manager" ||
    (role === "collector" && !userData.reseller);

  // reseller staff user role permission
  const rsRole = role === "reseller";
  const rscRole = role === "collector" && userData.reseller;
  const resellerUser =
    role === "reseller" || (role === "collector" && userData.reseller);

  // reseller id from role base
  const resellerId = role === "collector" ? userData.reseller : userData.id;

  // get all mikrotik from redux store
  const mikrotiks = useSelector((state) => state?.mikrotik?.mikrotik);

  // get mikrotik and without mikrotik packages in redux store
  const ppPackage = useSelector((state) =>
    page === "pppoe"
      ? hasMikrotik
        ? adminUser
          ? state?.package?.pppoePackages
          : state?.mikrotik?.pppoePackage
        : state?.mikrotik?.pppoePackage
      : page === "static"
      ? hasMikrotik
        ? adminUser
          ? state?.package?.packages
          : ""
        : state?.package?.packages
      : ""
  );

  // get all area form redux store
  const areas = useSelector((state) => state?.area?.area);

  // get areas subarea form redux store
  const subAreas = useSelector((state) =>
    adminUser ? state.area?.subArea : state?.area?.area
  );

  // get subareas poleBox form redux store
  const poleBox = useSelector((state) => state.area?.poleBox);

  // set change form data in state
  const [formData, setFormData] = useState({});

  // set ispOwner package commission in state
  const [packageCommission, setPackageCommission] = useState();

  useEffect(() => {
    // set division district and thana in state
    const divisionId = getNameId(divisionsJSON.divisions, data?.division)?.id;
    const districtId = getNameId(districtsJSON.districts, data?.district)?.id;
    const thanaId = getNameId(thanaJSON.thana, data?.thana)?.id;

    // set customer initial data
    setFormData({
      ...formData,
      amount: data?.amount,
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
      due: data?.due,
      email: data?.email,
      fatherName: data?.fatherName,
      mikrotikId: data?.mikrotik,
      mobile: data?.mobile,
      name: data?.name,
      nid: data?.nid,
      note: data?.note,
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
      salary: data?.salary,
      thana: thanaId,
    });
  }, [data]);

  // get package commission rate based on commission type
  useEffect(() => {
    const packageId = formData.packageId;

    // get ispOwner package rate
    packageId &&
      userData?.commissionType === "packageBased" &&
      userData?.commissionStyle === "fixedRate" &&
      getResellerPackageRate(resellerId, packageId, setPackageCommission);
  }, [formData?.packageId]);

  // single mikrotik package change handler
  const packageChangeHandler = async (id) => {
    // find mikrotik package in pppoe packages
    const singlePackage = ppPackage.find((val) => val.id === id);

    if (status === "edit") {
      // home user billing date
      const billingDate = new Date(data?.billingCycle);

      // customer bill month days
      const monthDate = new Date(
        billingDate.getFullYear(),
        billingDate.getMonth(),
        0
      ).getDate();

      // customer bill month day
      const monthDay = new Date(
        billingDate.getFullYear(),
        billingDate.getMonth() - 1,
        billingDate.getDate()
      );

      // customer useds day in current date
      const daysUsed = getMonthStartDay(monthDay);

      // customer bill day left
      const dayLeft = getCustomerDayLeft(data.billingCycle);

      // customer current package useds day amount
      const currentPackgeUsedDayAmount =
        (data.monthlyFee / monthDate) * daysUsed;

      // customer current package day left amount
      const currentPackgeBalance = data.monthlyFee - currentPackgeUsedDayAmount;

      // customer day left amountcurrentPackgeBalance
      const changePackageDayLeftAmount =
        (singlePackage?.rate / monthDate) * dayLeft;

      // customer change package amount after day left change in current date
      let changePackageAmount = 0;

      if (data.status === "active" && billingDate >= today && data) {
        // customer current package change before current package and after balance
        if (data.mikrotikPackage === singlePackage.id) {
          changePackageAmount = data.balance;
        } else {
          if (data.balance < 0) {
            // customer privious package and crrent package used amount
            changePackageAmount = -(
              currentPackgeUsedDayAmount +
              changePackageDayLeftAmount -
              data.balance
            );
          } else {
            changePackageAmount =
              currentPackgeBalance - changePackageDayLeftAmount + data.balance;
          }
        }
      } else {
        // for inactive or expired user change package monthly fee
        changePackageAmount = -singlePackage?.rate + data.balance;
      }

      // set single package change balance
      setFormData((formData.balance = Math.round(changePackageAmount)));
    }

    // set single package data
    setFormData({
      ...formData,
      packageId: singlePackage.id,
      packageRate: singlePackage.rate,
      packageName: singlePackage.name,
    });
  };

  // select Mikrotik Package
  const staticPackageChangeHandler = (target) => {
    if (target.id === "firewall-queue") {
      const temp = ppPackage.find((val) => val.id === target.value);

      // package limit set function
      const getLimit = setPackageLimit(target.value, false);

      // set single package data
      setFormData({
        ...formData,
        packageId: temp.id,
        packageRate: temp.rate,
        packageName: temp.name,
        maxUpLimit: getLimit,
      });
    }

    if (target.id === "core-queue") {
      const temp = ppPackage.find((val) => val.id === target.value);

      // set single package data
      setFormData({
        ...formData,
        packageId: temp.id,
        packageRate: temp.rate,
        packageName: temp.name,
      });
    }

    if (target.id === "uploadPackge") {
      // package limit set function
      const getLimit = setPackageLimit(target.value, false);

      // set single package data
      setFormData({
        ...formData,
        uploadPackgeId: target.value,
        maxUpLimit: getLimit,
      });
    }

    if (target.id === "downloadPackge") {
      const temp = ppPackage.find((val) => val.id === target.value);

      // package limit set function
      const getLimit = setPackageLimit(target.value, true);

      // set single package data
      setFormData({
        ...formData,
        packageId: temp.id,
        packageRate: temp.rate,
        packageName: temp.name,
        maxDownLimit: getLimit,
      });
    }
  };

  //function for set 0
  const setPackageLimit = (value) => {
    const temp = ppPackage.find((val) => val.id === value);

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

  // input validation array of object with name, validation, isVisible
  const validationArrayofInput = [
    {
      name: "amount",
      validation: Yup.number().required(t("enterAmount")),
      isVisible: inputPermission.amount,
    },
    {
      name: "area",
      validation: Yup.string().required(t("selectArea")),
      isVisible: inputPermission.area,
    },
    {
      name: "address",
      validation: Yup.string(),
      isVisible: inputPermission.address,
    },
    {
      name: "customerId",
      validation:
        !bpSettings?.genCustomerId &&
        Yup.string().required(t("selectCustomer")),
      isVisible: !bpSettings.genCustomerId && inputPermission.customerId,
    },
    {
      name: "connectionFee",
      validation: Yup.number(),
      isVisible: inputPermission.connectionFee,
    },
    {
      name: "customerBillingType",
      validation: Yup.string().required(t("select billing type")),
      isVisible: inputPermission.customerBillingType,
    },
    {
      name: "comment",
      validation: Yup.string(),
      isVisible: inputPermission.comment,
    },
    {
      name: "email",
      validation: Yup.string().email(t("incorrectEmail")),
      isVisible: inputPermission.email,
    },
    {
      name: "monthlyFee",
      validation: adminUser
        ? Yup.number().integer().min(0, t("minimumPackageRate"))
        : Yup.number()
            .required(t("writeMonthFee"))
            .min(
              userData?.commissionType === "packageBased" &&
                userData?.commissionStyle === "fixedRate"
                ? packageCommission?.ispOwnerRate
                : formData.packageRate,
              t("packageRateMustBeUpToIspOwnerCommission")
            ),
      isVisible: inputPermission.monthlyFee,
    },
    {
      name: "mobile",
      validation:
        bpSettings?.addCustomerWithMobile ||
        permission?.addCustomerWithMobile ||
        resellerData?.permission?.addCustomerWithMobile
          ? Yup.string()
              .matches(/^(01){1}[3456789]{1}(\d){8}$/, t("incorrectMobile"))
              .min(11, t("write11DigitMobileNumber"))
              .max(11, t("over11DigitMobileNumber"))
              .required(t("writeMobileNumber"))
          : Yup.string()
              .matches(/^(01){1}[3456789]{1}(\d){8}$/, t("incorrectMobile"))
              .min(11, t("write11DigitMobileNumber"))
              .max(11, t("over11DigitMobileNumber")),
      isVisible: inputPermission.mobile,
    },
    {
      name: "ipAddress",
      validation: Yup.string().required(t("writeIPAddress")),
      isVisible: inputPermission.ipAddress,
    },
    {
      name: "name",
      validation: Yup.string().required(t("writeCustomerName")),
      isVisible: inputPermission.name,
    },
    {
      name: "nid",
      validation: Yup.string().matches(
        /^(?:\d{10}|\d{13}|\d{17})$/,
        t("invalidNID")
      ),
      isVisible: inputPermission.nid,
    },
    {
      name: "mikrotikPackage",
      validation: Yup.string().required(t("selectMikrotikPackage")),
      isVisible: inputPermission.mikrotikPackage,
    },
    {
      name: "pppoeName",
      validation: Yup.string().required(t("writePPPoEName")),
      isVisible: inputPermission.pppoeName,
    },
    {
      name: "password",
      validation: Yup.string().required(t("writePPPoEPassword")),
      isVisible: inputPermission.password,
    },
    {
      name: "queueName",
      validation: Yup.string().required(t("writeCustomerName")),
      isVisible: inputPermission.queueName,
    },
    {
      name: "referenceMobile",
      validation: Yup.string()
        .matches(/^(01){1}[3456789]{1}(\d){8}$/, t("incorrectMobile"))
        .min(11, t("write11DigitMobileNumber"))
        .max(11, t("over11DigitMobileNumber")),
      isVisible: inputPermission.referenceMobile,
    },
    {
      name: "subArea",
      validation: Yup.string().required(t("selectSubArea")),
      isVisible: inputPermission.subArea,
    },
  ];

  // option validation schema
  const validationSchema = Yup.object().shape(
    validationArrayofInput.reduce((acc, curr) => {
      if (curr.isVisible) {
        acc[curr.name] = curr.validation && curr.validation;
      }
      return acc;
    }, {})
  );

  // array of input options
  const initialValuesArrayofInput = [
    {
      id: 1,
      name: "amount",
      value: Number(formData.amount) || 0,
      isVisible: inputPermission.amount,
    },
    {
      id: 1,
      name: "area",
      value: formData.areaId || "",
      isVisible: inputPermission.area,
    },
    {
      id: 2,
      name: "address",
      value: formData.address || "",
      isVisible: inputPermission.address,
    },
    {
      id: 3,
      name: "billingCycle",
      value: formData.billingCycleDate || today,
      isVisible: inputPermission.billingCycle,
    },
    {
      id: 4,
      name: "balance",
      value: formData.balance || "",
      isVisible: inputPermission.balance,
    },
    {
      id: 5,
      name: "birthDate",
      value: formData.dateOFbirth || "",
      isVisible: inputPermission.birthDate,
    },
    {
      id: 6,
      name: "customerId",
      value: formData.customerId || "",
      isVisible: inputPermission.customerId,
    },
    {
      id: 7,
      name: "connectionFee",
      value: Number(formData.connectionFee) || 0,
      isVisible: inputPermission.connectionFee,
    },
    {
      id: 8,
      name: "customerBillingType",
      value: formData.customerBillingType || "prepaid",
      isVisible: inputPermission.customerBillingType,
    },
    {
      id: 9,
      name: "connectionDate",
      value: formData.connectionDate || today,
      isVisible: inputPermission.connectionDate,
    },
    {
      id: 10,
      name: "comment",
      value: formData.comment || "",
      isVisible: inputPermission.comment,
    },
    {
      id: 11,
      name: "division",
      value: formData.division || "",
      isVisible: inputPermission.division,
    },
    {
      id: 12,
      name: "district",
      value: formData.district || "",
      isVisible: inputPermission.district,
    },
    {
      id: 27,
      name: "due",
      value: Number(formData.due) || 0,
      isVisible: inputPermission.due,
    },
    {
      id: 13,
      name: "email",
      value: formData.email || "",
      isVisible: inputPermission.email,
    },
    {
      id: 24,
      name: "fatherName",
      value: formData.fatherName || "",
      isVisible: inputPermission.fatherName,
    },
    {
      id: 29,
      name: "ipAddress",
      value: formData.ipAddress || "",
      isVisible: inputPermission.ipAddress,
    },
    {
      id: 14,
      name: "monthlyFee",
      value: Number(formData.packageRate) || 0,
      isVisible: inputPermission.monthlyFee,
    },
    {
      id: 14,
      name: "mikrotik",
      value: formData.mikrotikId || "",
      isVisible: inputPermission.mikrotik,
    },
    {
      id: 15,
      name: "mikrotikPackage",
      value: formData.packageId || "",
      isVisible: inputPermission.mikrotikPackage,
    },
    {
      id: 15,
      name: "mobile",
      value: formData.mobile || "",
      isVisible: inputPermission.mobile,
    },
    {
      id: 30,
      name: "maxUpLimit",
      value: formData.maxUpLimit || "",
      isVisible:
        ["firewall-queue", "simple-queue"].includes(userType) &&
        inputPermission.mikrotikPackage,
    },
    {
      id: 30,
      name: "maxDownLimit",
      value: formData.maxDownLimit || "",
      isVisible:
        ["firewall-queue", "simple-queue"].includes(userType) &&
        inputPermission.mikrotikPackage,
    },
    {
      id: 16,
      name: "name",
      value: formData.name || "",
      isVisible: inputPermission.name,
    },
    {
      id: 17,
      name: "nid",
      value: formData.nid || "",
      isVisible: inputPermission.nid,
    },
    {
      id: 19,
      name: "note",
      value: formData.note || "",
      isVisible: inputPermission.note,
    },
    {
      id: 18,
      name: "pppoeName",
      value: formData.pppoeName || "",
      isVisible: inputPermission.pppoeName,
    },
    {
      id: 19,
      name: "promiseDate",
      value: formData.promiseDate || today,
      isVisible: inputPermission.promiseDate,
    },
    {
      id: 19,
      name: "password",
      value: formData.password || "",
      isVisible: inputPermission.password,
    },
    {
      id: 19,
      name: "poleBox",
      value: formData.poleBoxId || "",
      isVisible: inputPermission.poleBox,
    },
    {
      id: 29,
      name: "queueName",
      value: formData.queueName || "",
      isVisible: inputPermission.queueName,
    },
    {
      id: 20,
      name: "referenceName",
      value: formData.referenceName || "",
      isVisible: inputPermission.referenceName,
    },
    {
      id: 21,
      name: "referenceMobile",
      value: formData.referenceMobile || "",
      isVisible: inputPermission.referenceMobile,
    },
    {
      id: 22,
      name: "subArea",
      value: formData.subAreaId || "",
      isVisible: inputPermission.subArea,
    },
    {
      id: 22,
      name: "status",
      value: formData.status || "active",
      isVisible: inputPermission.status,
    },
    {
      id: 26,
      name: "salary",
      value: Number(formData.salary) || 0,
      isVisible: inputPermission.salary,
    },
    {
      id: 22,
      name: "thana",
      value: formData.thana || "",
      isVisible: inputPermission.thana,
    },
    {
      id: 23,
      name: "profile",
      value: formData.packageName || "",
      isVisible: page === "pppoe" && inputPermission.mikrotikPackage,
    },
  ];

  // input initial values
  const inputInitialValues = initialValuesArrayofInput.reduce((acc, curr) => {
    if (curr.isVisible) {
      acc[curr.name] = curr.value && curr.value;
    }
    return acc;
  }, {});

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
      isVisible: page === "pppoe" && inputPermission.mikrotikPackage,
      disabled: bpSettings.hasMikrotik
        ? status === "post"
          ? !formData.mikrotikId
          : resellerUser && !permission?.customerMikrotikPackageEdit
        : false,
      validation: true,
      label: t("selectPackage"),
      firstOptions: t("selectPackage"),
      textAccessor: "name",
      valueAccessor: "id",
      options:
        page === "pppoe"
          ? bpSettings.hasMikrotik
            ? ppPackage?.filter(
                (pack) =>
                  pack.packageType === "pppoe" &&
                  pack.mikrotik === formData.mikrotikId
              )
            : ppPackage
          : "",
      onChange: (e) => {
        packageChangeHandler(e.target.value);
      },
    },
    {
      name: "mikrotikPackage",
      as: "select",
      type: "select",
      id: userType,
      isVisible:
        page === "static" &&
        ["firewall-queue", "core-queue"].includes(userType) &&
        inputPermission.mikrotikPackage,
      disabled: bpSettings.hasMikrotik
        ? status === "post"
          ? !formData.mikrotikId
          : resellerUser && !permission?.customerMikrotikPackageEdit
        : false,
      validation: true,
      label: t("selectPackage"),
      firstOptions: t("selectPackage"),
      textAccessor: "name",
      valueAccessor: "id",
      options:
        page === "static"
          ? bpSettings.hasMikrotik
            ? ppPackage?.filter(
                (pack) =>
                  pack.packageType === "queue" &&
                  pack.mikrotik === formData.mikrotikId
              )
            : ppPackage
          : "",
      onChange: (e) => {
        staticPackageChangeHandler(e.target);
      },
    },
    {
      name: "uploadPackge",
      as: "select",
      type: "select",
      id: "uploadPackge",
      isVisible:
        page === "static" &&
        userType === "simple-queue" &&
        inputPermission.mikrotikPackage,
      disabled: adminUser ? (status ? !formData.mikrotikId : false) : true,
      validation: true,
      label: t("uploadPackge"),
      firstOptions: t("selectPackage"),
      textAccessor: "name",
      valueAccessor: "id",
      value: formData.uploadPackgeId || "",
      options:
        page === "static" &&
        bpSettings.hasMikrotik &&
        ppPackage?.filter(
          (pack) =>
            pack.packageType === "queue" &&
            pack.mikrotik === formData.mikrotikId
        ),
      onChange: (e) => {
        staticPackageChangeHandler(e.target);
      },
    },
    {
      name: "mikrotikPackage",
      as: "select",
      type: "select",
      id: "downloadPackge",
      isVisible:
        page === "static" &&
        userType === "simple-queue" &&
        inputPermission.mikrotikPackage,
      disabled: adminUser ? (status ? !formData.mikrotikId : false) : true,
      validation: true,
      label: t("downloadPackge"),
      firstOptions: t("selectPackage"),
      textAccessor: "name",
      valueAccessor: "id",
      options:
        page === "static" &&
        ppPackage?.filter(
          (pack) =>
            pack.packageType === "queue" &&
            pack.mikrotik === formData.mikrotikId
        ),
      onChange: (e) => {
        staticPackageChangeHandler(e.target);
      },
    },
    {
      name: "monthlyFee",
      type: "number",
      id: "monthlyFee",
      isVisible: inputPermission.monthlyFee,
      disabled: status
        ? !formData.packageId
        : (resellerUser && !permission?.monthlyFeeEdit) || false,
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
      type: "text",
      id: "balance",
      isVisible: inputPermission.balance,
      disabled: adminUser ? (status ? !formData.packageId : false) : true,
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
      name: "ipAddress",
      type: "text",
      id: "ipAddress",
      isVisible: inputPermission.ipAddress,
      disabled: status ? !formData.packageId : false,
      validation: true,
      label: t("ipAddress"),
      placeholder: "e.g. 192.168.0.1",
      onChange: (e) => {
        setFormData({
          ...formData,
          ipAddress: e.target.value,
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
      name: "queueName",
      type: "text",
      id: "queueName",
      isVisible: inputPermission.queueName,
      disabled: status ? !formData.packageId : false,
      validation: true,
      label: t("queueName"),
      placeholder: "e.g. Queue-Name",
      onChange: (e) => {
        setFormData({
          ...formData,
          queueName: e.target.value,
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
      options: adminUser
        ? subAreas.filter((item) => item?.area === formData.areaId)
        : subAreas,
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
      disabled:
        status === "post"
          ? !formData.packageId
          : (rsRole && !permission?.singleCustomerNumberEdit) ||
            (rscRole && !resellerData?.permission?.customerMobileEdit) ||
            false,
      validation: ["pppoe", "static"].includes(page)
        ? bpSettings?.addCustomerWithMobile ||
          permission?.addCustomerWithMobile ||
          resellerData?.permission?.addCustomerWithMobile
        : true,
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
      disabled:
        status === "post"
          ? adminUser
            ? !formData.packageId
            : true
          : status === "edit"
          ? adminUser
            ? !formData.packageId
            : !permission?.billingCycleEdit
          : false,
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
      disabled: status ? (adminUser ? !formData.packageId : true) : false,
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
          id: "newCustomer",
          isVisible: ["staff"].includes(page) ? true : false,
          disabled: false,
          label: t("new"),
          value: "new",
        },
        {
          type: "radio",
          id: "activeCustomer",
          isVisible: true,
          disabled:
            status === "post"
              ? false
              : status === "edit"
              ? (rsRole && !permission?.customerStatusEdit) ||
                (rscRole && !permissions?.customerActivate)
              : false,
          label: t("active"),
          value: "active",
        },
        {
          type: "radio",
          id: "inactiveCustomer",
          isVisible: true,
          disabled:
            status === "post"
              ? false
              : status === "edit"
              ? (rsRole &&
                  ((!permission?.logicalInactive && formData.balance > 0) ||
                    !permission?.customerStatusEdit)) ||
                (rscRole && !permissions?.customerDeactivate)
              : false,
          label: t("inactive"),
          value: "inactive",
        },
        {
          type: "radio",
          id: "expiredCustomer",
          isVisible: ["pppoe"].includes(page) ? true : false,
          disabled: true,
          label: t("expired"),
          value: "expired",
        },
        {
          type: "radio",
          id: "bannedCustomer",
          isVisible: ["staff"].includes(page) ? true : false,
          disabled: false,
          label: t("banned"),
          value: "banned",
        },
        {
          type: "radio",
          id: "deletedCustomer",
          isVisible: ["staff"].includes(page) ? true : false,
          disabled: false,
          label: t("deleted"),
          value: "deleted",
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
      name: "fatherName",
      type: "text",
      id: "fatherName",
      isVisible: inputPermission.fatherName,
      disabled: false,
      validation: false,
      label: t("parentName"),
      placeholder: "e.g. Father Name",
      onChange: (e) => {
        setFormData({
          ...formData,
          fatherName: e.target.value,
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
      isVisible:
        page !== "staff"
          ? formData.addStaff && inputPermission.salary
          : inputPermission.salary,
      disabled: false,
      validation: true,
      label: t("salary"),
      placeholder: "0",
      onChange: (e) => {
        setFormData({
          ...formData,
          salary: e.target.value,
        });
      },
    },
    {
      name: "due",
      type: "number",
      id: "due",
      isVisible: inputPermission.due,
      disabled: false,
      validation: false,
      label: t("due"),
      placeholder: "0",
      onChange: (e) => {
        setFormData({
          ...formData,
          due: e.target.value,
        });
      },
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
    {
      name: "amount",
      type: "number",
      id: "amount",
      isVisible: inputPermission.amount,
      disabled: false,
      validation: false,
      label: t("amount"),
      onChange: (e) => {
        setFormData({
          ...formData,
          amount: e.target.value,
        });
      },
    },
    {
      name: "note",
      type: "text",
      id: "note",
      isVisible: inputPermission.note,
      disabled: false,
      validation: false,
      label: t("note"),
      onChange: (e) => {
        setFormData({
          ...formData,
          note: e.target.value,
        });
      },
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
