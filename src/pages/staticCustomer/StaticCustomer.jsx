import React, { useEffect, useState, useMemo } from "react";
import moment from "moment";
import { CSVLink } from "react-csv";
import { Link } from "react-router-dom";
import {
  ThreeDots,
  ArchiveFill,
  PenFill,
  PersonFill,
  CashStack,
  ChatText,
  PersonPlusFill,
  FileExcelFill,
  PrinterFill,
  ArrowClockwise,
  KeyFill,
  CardChecklist,
  Newspaper,
  ArrowRightSquareFill,
  FilterCircle,
  BoxSeam,
  FiletypeCsv,
  ArrowBarLeft,
  ArrowBarRight,
  ReceiptCutoff,
  PencilSquare,
  Phone,
  GeoAlt,
  FileEarmarkBarGraph,
  FileEarmark,
} from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { Accordion, Card, Collapse } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";

// custom hooks
import useISPowner from "../../hooks/useISPOwner";

// internal imports
import "../collector/collector.css";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import Footer from "../../components/admin/footer/Footer";
import { FontColor, FourGround } from "../../assets/js/theme";
import CustomerDetails from "./customerCRUD/CustomerDetails";
import RechargeCustomer from "./customerCRUD/RechargeCustomer";
import {
  getStaticCustomer,
  getPackagewithoutmikrotik,
  fetchMikrotik,
  getArea,
  getCollector,
  getManger,
  getAllPackages,
  staticMACBinding,
  getQueuePackageByIspOwnerId,
  fetchReseller,
} from "../../features/apiCalls";
import CustomerReport from "./customerCRUD/showCustomerReport";
import { badge } from "../../components/common/Utils";
import Table from "../../components/table/Table";
import SingleMessage from "../../components/singleCustomerSms/SingleMessage";
import AddStaticCustomer from "./customerCRUD/AddStaticCustomer";
import IndeterminateCheckbox from "../../components/table/bulkCheckbox";
import Loader from "../../components/common/Loader";
import FormatNumber from "../../components/common/NumberFormat";
import PasswordReset from "../../components/modals/passwordReset/PasswordReset";
import CustomerNote from "./customerCRUD/CustomerNote";
import CreateSupportTicket from "../../components/modals/CreateSupportTicket";
import {
  getPoleBoxApi,
  getSubAreasApi,
} from "../../features/actions/customerApiCall";
import FireWallFilterIpDropControl from "./FireWallFilterIpDropControl";
import CustomersNumber from "../Customer/CustomersNumber";
import StaticCreateInvoice from "./StaticCreateInvoice";
import NetFeeBulletin from "../../components/bulletin/NetFeeBulletin";
import { getBulletinPermission } from "../../features/apiCallAdmin";
import EditStaticCustomer from "./customerCRUD/temp/EditStaticCustomer";
import { updateStaticCustomerApi } from "../../features/staticCustomerApi";
import PrintOptions from "../../components/common/PrintOptions";
import {
  getCustomerDayLeft,
  getCustomerPromiseDate,
} from "../Customer/customerCRUD/customerBillDayPromiseDate";
import { getOwnerUsers } from "../../features/getIspOwnerUsersApi";
import CustomerDelete from "../Customer/customerCRUD/CustomerDelete";
import TransferToReseller from "../Customer/customerCRUD/TransferToReseller";
import BulkOptions from "../Customer/customerCRUD/bulkOpration/BulkOptions";

const Customer = () => {
  //call hooks
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // current Date
  let today = new Date();
  let firstDate = new Date(today.getFullYear(), today.getMonth(), 1);
  let lastDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  firstDate.setHours(0, 0, 0, 0);
  lastDate.setHours(23, 59, 59, 999);

  // get user & current user data form useISPOwner
  const { role, ispOwnerId, bpSettings, permissions } = useISPowner();

  // get ispOwner data form store
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth?.userData
  );

  //get data from redux store
  const mikrotiks = useSelector((state) => state?.mikrotik?.mikrotik);

  //get ispOwner all manager & collector form redux store
  const manager = useSelector((state) => state.manager?.manager);
  const collectors = useSelector((state) => state?.collector?.collector);

  // get static customer form redux store
  const cus = useSelector((state) => state?.customer?.staticCustomer);

  // ispOwner collector area
  const collectorArea = useSelector((state) =>
    role === "collector"
      ? state.persistedReducer.auth?.currentUser?.collector?.areas
      : []
  );

  //get ispOwner areas form redux
  const allareas = useSelector((state) => state?.area?.area);

  // get all subAreas
  const storeSubArea = useSelector((state) => state.area?.subArea);

  //get all pole Box
  const poleBox = useSelector((state) => state.area?.poleBox);

  // get all package list
  let packages = useSelector((state) => state?.package?.packages);

  // get all packages
  const allPackages = useSelector((state) => state.package.allPackages);

  // get bulletin permission
  const butPermission = useSelector(
    (state) => state.adminNetFeeSupport?.bulletinPermission
  );

  //loading state
  const [isLoading, setIsloading] = useState(false);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [isShow, setIsShow] = useState(false);

  //user id
  const [userId, setUserId] = useState();

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

  const [cusSearch, setCusSearch] = useState("");

  const [mikrotikPac, setMikrotikPac] = useState();
  const [Customers1, setCustomers1] = useState([]);

  const [Customers2, setCustomers2] = useState([]);

  // set customer id in state for note
  const [customerNoteId, setCustomerNoteId] = useState();

  // set customer name state
  const [customerName, setCustomerName] = useState("");

  // get specific customer
  const [singleCustomer, setSingleCustomer] = useState("");
  const [singleData, setSingleData] = useState();
  const [customerData, setCustomerData] = useState({});

  const [allArea, setAreas] = useState([]);

  const [subAreaIds, setSubArea] = useState([]);
  const [singleArea, setArea] = useState({});
  const [subAreas, setSubAreas] = useState([]);

  // get specific customer Report
  const [customerReportData, setId] = useState([]);

  // check mikrotik checkbox
  const [mikrotikCheck, setMikrotikCheck] = useState(false);

  const [open, setOpen] = useState(false);

  // optional modal state
  const [modalStatus, setModalStatus] = useState("");
  const [show, setShow] = useState(false);

  // customers number update or delete modal show state
  const [numberModalShow, setNumberModalShow] = useState(false);

  // pole box filter loding
  const [isLoadingPole, setIsLoadingPole] = useState(false);

  // subArea current poleBox state
  const [currentPoleBox, setCurrentPoleBox] = useState([]);

  // bulk modal handle state
  const [isOpen, setIsOpen] = useState(false);

  const [filterOptions, setFilterOption] = useState({
    status: "",
    paymentStatus: "",
    area: "",
    subArea: "",
    poleBox: "",
    package: "",
    mikrotik: "",
    freeUser: "",
    startDate: "",
    endDate: "",
    dayFilter: "",
    changedPromiseDate: "",
    connection: "",
  });

  useEffect(() => {
    // ispOwner queue customers get api
    if (cus.length === 0)
      getStaticCustomer(dispatch, ispOwnerId, setCustomerLoading);

    //ispOwner queue all package get api
    if (bpSettings.hasMikrotik && packages.length === 0)
      getQueuePackageByIspOwnerId(ispOwnerId, dispatch, setIsloading);

    // with out mikrotik queue packages get api
    if (
      !bpSettings?.hasMikrotik &&
      (role === "manager" || role === "ispOwner")
    ) {
      packages.length === 0 &&
        getPackagewithoutmikrotik(ispOwnerId, dispatch, setIsloading);
    }

    // ispOwner pppoe all package get api
    if (allPackages.length === 0)
      getAllPackages(dispatch, ispOwnerId, setIsloading);

    //ispOwner mikrotiks get api call
    if (mikrotiks.length === 0)
      fetchMikrotik(dispatch, ispOwnerId, setIsloading);

    //get ispOwner areas
    if (allArea.length === 0) getArea(dispatch, ispOwnerId, setIsloading);

    // get sub area api
    getSubAreasApi(dispatch, ispOwnerId);

    // get subareas pole boxs
    if (poleBox.length === 0)
      getPoleBoxApi(dispatch, ispOwnerId, setIsLoadingPole);

    //get ispOwner staffs
    if (role !== "collector") {
      if (collectors.length === 0)
        getCollector(dispatch, ispOwnerId, setIsloading);

      role === "ispOwner" && getManger(dispatch, ispOwnerId);
    }

    // get ispOwner all staffs
    getOwnerUsers(dispatch, ispOwnerId);

    // get reseller api
    fetchReseller(dispatch, ispOwnerId, setIsloading);

    // netFee bulletin get api call
    Object.keys(butPermission)?.length === 0 && getBulletinPermission(dispatch);
  }, []);

  useEffect(() => {
    let temp = [];

    if (cus) {
      cus.map((customer) => {
        let areaFound = false;
        allareas?.map((area) => {
          area.subAreas.map((sub) => {
            if (customer.subArea === sub) {
              areaFound = true;
              temp.push({
                ...customer,
                area: area.id,
                profile: customer.pppoe.profile,
              });
            }
          });
        });

        if (!areaFound) {
          temp.push({
            ...customer,
            area: "noArea",
            profile: customer.pppoe?.profile,
          });
        }
      });
    }

    setCustomers1(temp);
    setCustomers2(temp);
  }, [cus]);

  useEffect(() => {
    if (role === "collector") {
      let areas = [];

      collectorArea?.map((item) => {
        let area = {
          id: item.area?.id,
          name: item.area?.name,
          subAreas: [
            {
              id: item?.id,
              name: item?.name,
            },
          ],
        };

        let found = areas?.find((area) => area.id === item.area?.id);
        if (found) {
          found.subAreas.push({ id: item?.id, name: item?.name });

          return (areas[areas.findIndex((item) => item?.id === found?.id)] =
            found);
        } else {
          return areas.push(area);
        }
      });
      setAreas(areas);
    }
  }, [collectorArea, role]);

  // get specific customer
  const getSpecificCustomer = (id) => {
    setSingleCustomer(id);
  };

  const getSpecificCustomerReport = (reportData) => {
    setId(reportData);
  };

  // cutomer delete
  const customerDelete = (customerId) => {
    setMikrotikCheck(false);
    // const singleData = cus?.find((item) => item.id === customerId);
    setSingleData(customerId);
  };

  //mac-binding handler
  const macBindingCall = (customerId) => {
    staticMACBinding(customerId);
  };

  // reload Handler
  const reloadHandler = () => {
    if (
      !bpSettings?.hasMikrotik &&
      (role === "manager" || role === "ispOwner")
    ) {
      getPackagewithoutmikrotik(ispOwnerId, dispatch, setIsloading);
    }

    getStaticCustomer(dispatch, ispOwnerId, setCustomerLoading);
  };

  const onChangeArea = (param) => {
    let area = JSON.parse(param);
    const allSub = storeSubArea.filter((val) => val.area === area.id);
    setSubAreas(allSub);
    setArea(area);
    if (
      area &&
      Object.keys(area).length === 0 &&
      Object.getPrototypeOf(area) === Object.prototype
    ) {
      setSubArea([]);
    } else {
      let subAreaIds = [];

      area?.subAreas.map((sub) => subAreaIds.push(sub));

      setSubArea(subAreaIds);
    }
  };

  const handleActiveFilter = () => {
    let tempCustomers = Customers2.reduce((acc, c) => {
      const {
        area,
        subArea,
        poleBox,
        status,
        mikrotik,
        paymentStatus,
        freeUser,
        startDate,
        endDate,
        dayFilter,
        changedPromiseDate,
        connection,
      } = filterOptions;

      const billingCycle = new Date(
        moment(c.billingCycle).format("YYYY/MM/DD")
      ).getTime();

      const promiseDate = new Date(
        moment(c.promiseDate).format("YYYY/MM/DD")
      ).getTime();

      let today = new Date();
      let lastDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      ).getTime();

      const todayDate = new Date(
        moment(new Date()).format("YYYY/MM/DD")
      ).getTime();

      const filterStartData = new Date(
        moment(filterOptions.startDate).format("YYYY-MM-DD")
      ).getTime();

      const filterEndData = new Date(
        moment(filterOptions.endDate).format("YYYY-MM-DD")
      ).getTime();

      let getArea = [];
      if (area) {
        getArea = allareas.find((item) => item.id === area);
      }

      // automaticConnection filter
      let connectionStatus;
      if (connection === "true") {
        connectionStatus = false;
      } else if (connection === "false") {
        connectionStatus = true;
      }

      // make possible conditions objects if the filter value not selected thats return true
      //if filter value exist then compare
      const conditions = {
        area: area ? getArea.subAreas.some((item) => item === c.subArea) : true,
        subArea: subArea ? c.subArea === subArea : true,
        poleBox: poleBox ? c.poleBox === poleBox : true,
        status: status ? c.status === status : true,
        paid: paymentStatus ? c.paymentStatus === "paid" : true,
        unpaid: paymentStatus
          ? c.paymentStatus === "unpaid" && c.monthlyFee !== 0
          : true,
        free: paymentStatus ? c.monthlyFee === 0 : true,
        partial: paymentStatus
          ? c.paymentStatus === "unpaid" &&
            c.monthlyFee > c.balance &&
            c.balance > 0
          : true,
        advance: paymentStatus
          ? c.monthlyFee <= c.balance && c.monthlyFee > 0
          : true,
        overdue: paymentStatus
          ? c.paymentStatus === "unpaid" && c.balance < 0
          : true,
        mikrotik: mikrotik ? c.mikrotik === mikrotik : true,
        freeUser: freeUser ? c.monthlyFee === 0 : true,
        nonFreeUser: freeUser ? c.monthlyFee !== 0 : true,
        prepaid: freeUser ? c.customerBillingType === "prepaid" : true,
        postpaid: freeUser ? c.customerBillingType === "postpaid" : true,
        package: filterOptions.package
          ? c.mikrotikPackage === filterOptions.package
          : true,
        filterDate:
          startDate && endDate
            ? filterStartData <= billingCycle && filterEndData >= billingCycle
            : true,
        dayFilter: dayFilter
          ? moment(c.billingCycle).diff(moment(), "days") ===
            Number(filterOptions.dayFilter)
          : true,
        changedPromiseDate: changedPromiseDate
          ? billingCycle == todayDate &&
            billingCycle < promiseDate &&
            promiseDate < lastDayOfMonth
          : true,

        connection: connection ? c.autoDisable !== connectionStatus : true,
      };

      //check if condition pass got for next step or is fail stop operation
      //if specific filter option value not exist it will return true

      let isPass = false;
      isPass = conditions["area"];
      if (!isPass) return acc;
      isPass = conditions["subArea"];
      if (!isPass) return acc;

      isPass = conditions["poleBox"];
      if (!isPass) return acc;

      isPass = conditions["status"];
      if (!isPass) return acc;

      if (paymentStatus) {
        isPass = conditions[paymentStatus];
        if (!isPass) return acc;
      }

      isPass = conditions["mikrotik"];
      if (!isPass) return acc;

      if (freeUser) {
        isPass = conditions[freeUser];
        if (!isPass) return acc;
      }

      isPass = conditions["package"];
      if (!isPass) return acc;

      isPass = conditions["filterDate"];
      if (!isPass) return acc;

      isPass = conditions["dayFilter"];
      if (!isPass) return acc;

      isPass = conditions["changedPromiseDate"];
      if (!isPass) return acc;

      isPass = conditions["connection"];
      if (!isPass) return acc;

      if (isPass) acc.push(c);
      return acc;
    }, []);

    // set filter customer in customer state
    setCustomers1(tempCustomers);
  };

  const handleFilterReset = () => {
    setMikrotikPac([]);
    setFilterOption({
      status: "",
      paymentStatus: "",
      area: "",
      subArea: "",
      package: "",
      startDate: "",
      endDate: "",
    });
    setCustomers1(cus);
  };

  const onChangeSubArea = (id) => {
    const subAreaPoleBox = poleBox?.filter((val) => val.subArea === id);
    setCurrentPoleBox(subAreaPoleBox);
    setCusSearch(id);
  };

  let subArea, customerStatus, customerPaymentStatus;
  if (singleArea && cusSearch) {
    subArea = singleArea?.subAreas?.find((item) => item.id === subAreaIds[0]);
  }

  if (filterOptions.status) {
    if (filterOptions.status === "active") {
      customerStatus = "এক্টিভ";
    } else if (filterOptions.status === "inactive") {
      customerStatus = "ইনএক্টিভ";
    }
  }

  if (filterOptions.paymentStatus) {
    if (filterOptions.paymentStatus === "unpaid") {
      customerPaymentStatus = "বকেয়া";
    } else if (filterOptions.paymentStatus === "paid") {
      customerPaymentStatus = "পরিশোধ";
    } else if (filterOptions.paymentStatus === "expired") {
      customerPaymentStatus = "মেয়াদোত্তীর্ণ";
    }
  }

  const filterData = {
    area: singleArea?.name ? singleArea.name : t("allArea"),
    subArea: subArea ? subArea.name : t("allSubArea"),
    status: customerStatus ? customerStatus : t("allCustomer"),
    payment: customerPaymentStatus ? customerPaymentStatus : t("allCustomer"),
  };

  const mikrotikHandler = async (id) => {
    setFilterOption({
      ...filterOptions,
      mikrotik: id,
    });
    if (!id) {
      setMikrotikPac([]);
    }
    if (id) {
      const mikrotikPackage = packages.filter((pack) => pack.mikrotik === id);
      setMikrotikPac(mikrotikPackage);
    }
  };

  // customer current package find
  const customerPackageFind = (pack) => {
    const findPack = allPackages.find((item) => item.id.includes(pack));
    return findPack;
  };

  // customer autoDisable connection check & promiseDate handler
  const changePromiseConnection = (e) => {
    if (e.target.value !== "changedPromiseDate") {
      setFilterOption({
        ...filterOptions,
        connection: e.target.value,
      });
    } else {
      setFilterOption({
        ...filterOptions,
        changedPromiseDate: e.target.value,
      });
    }
  };

  // atuomatic connection on off doble clicked handle
  const autoDisableHandle = (value, e) => {
    if (e?.detail == 2 && value) {
      let data = {
        ...value,

        autoDisable: !value?.autoDisable,
      };

      updateStaticCustomerApi(
        value.id,
        dispatch,
        data,
        setIsLoadingPole,
        "",
        "",
        "auto"
      );
    }
  };

  // static customer print option
  const printData = {
    id: 1003,
    value: "ip",
    label: "ip",
    checked: true,
  };

  let customerForCsV = Customers1.map((customer) => {
    return {
      companyName: ispOwnerData.company,
      home: "Home",
      companyAddress: ispOwnerData.address,
      name: customer.name,
      customerAddress: customer.address,
      connectionType: "Wired",
      connectivity: "Dedicated",
      createdAt: moment(customer.createdAt).format("YYYY/MM/DD"),
      package: customer?.pppoe?.profile,
      ip: "",
      road: ispOwnerData.address,
      address: ispOwnerData.address,
      area: ispOwnerData?.fullAddress?.area || "",
      district: ispOwnerData?.fullAddress?.district || "",
      thana: ispOwnerData?.fullAddress?.thana || "",
      mobile: customer?.mobile.slice(1) || "",
      email: customer.email || "",
      monthlyFee: customer.monthlyFee,
    };
  });

  const headers = [
    { label: "name_operator", key: "companyName" },
    { label: "type_of_client", key: "home" },
    { label: "distribution Location point", key: "companyAddress" },
    { label: "name_of_client", key: "name" },
    { label: "address_of_client", key: "customerAddress" },
    { label: "type_of_connection", key: "connectionType" },
    { label: "type_of_connectivity", key: "connectivity" },
    { label: "activation_date", key: "createdAt" },
    { label: "bandwidth_allocation MB", key: "package" },
    { label: "allowcated_ip", key: "ip" },
    { label: "house_no", key: "address" },
    { label: "road_no", key: "road" },
    { label: "area", key: "area" },
    { label: "district", key: "district" },
    { label: "thana", key: "thana" },
    { label: "client_phone", key: "mobile" },
    { label: "mail", key: "email" },
    { label: "selling_bandwidthBDT (Excluding VAT).", key: "monthlyFee" },
  ];

  //export customer data
  let customerForCsVTableInfo = Customers1.map((customer) => {
    return {
      name: customer.name,
      ip:
        customer.userType === "firewall-queue"
          ? customer.queue.address
          : customer.queue.target,
      customerAddress: customer.address,
      createdAt: moment(customer.createdAt).format("YYYY/MM/DD"),
      package: customer?.pppoe?.profile,
      mobile: customer?.mobile || "",
      status: customer.status,
      paymentStatus: customer.paymentStatus,
      email: customer.email || "",
      monthlyFee: customer.monthlyFee,
      balance: customer.balance,
      billingCycle: moment(customer.billingCycle).format("YYYY/MM/DD"),
    };
  });

  const customerForCsVTableInfoHeader = [
    { label: "name_of_client", key: "name" },
    { label: "address_of_client", key: "customerAddress" },
    { label: "activation_date", key: "createdAt" },
    { label: "customer_ip", key: "ip" },
    { label: "bandwidth_allocation MB", key: "package" },
    { label: "client_phone", key: "mobile" },
    { label: "status", key: "status" },
    { label: "payment Status", key: "paymentStatus" },
    { label: "email", key: "email" },
    { label: "monthly_fee", key: "monthlyFee" },
    { label: "balance", key: "balance" },
    { label: "billing_cycle", key: "billingCycle" },
  ];

  const columns = React.useMemo(
    () => [
      {
        width: "2%",
        id: "selection",
        Header: ({ getToggleAllPageRowsSelectedProps }) => (
          <IndeterminateCheckbox
            customeStyle={true}
            {...getToggleAllPageRowsSelectedProps()}
          />
        ),
        Cell: ({ row }) => (
          <div>
            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
          </div>
        ),
      },
      {
        width: "6%",
        Header: t("id"),
        accessor: "customerId",
        Cell: ({ row: { original } }) => (
          <div
            onClick={(e) => autoDisableHandle(original, e)}
            style={{ cursor: "pointer" }}
          >
            {original?.autoDisable ? (
              <p className="text-success">{original?.customerId}</p>
            ) : (
              <p className="text-danger">{original?.customerId}</p>
            )}
          </div>
        ),
      },
      {
        width: "13%",
        Header: t("nameIP"),
        accessor: (data) =>
          `${data?.name} ${data?.queue.address} ${data?.queue.srcAddress} ${data?.queue.target}`,
        Cell: ({ row: { original } }) => (
          <div>
            <p>{original?.name}</p>
            <p>
              {original.userType === "firewall-queue"
                ? original.queue.address
                : original.userType === "core-queue"
                ? original.queue.srcAddress
                : original.queue.target}

              <span className="ms-1">
                {firstDate <= new Date(original?.createdAt) &&
                  lastDate >= new Date(original?.createdAt) && (
                    <small className="new_badge badge bg-secondary">
                      {"new"}
                    </small>
                  )}
              </span>
            </p>
          </div>
        ),
      },
      {
        width: "18%",
        Header: t("mobileAddress"),
        accessor: (data) => `${data?.mobile} ${data?.address}`,
        Cell: ({ row: { original } }) => (
          <div>
            <p style={{ fontWeight: "500" }}>
              <Phone className="text-info" /> {original?.mobile || "N/A"}
            </p>
            <p>
              <GeoAlt />
              {original?.address || "N/A"}
            </p>
          </div>
        ),
      },
      {
        width: "13%",
        Header: t("package"),
        accessor: (data) => customerPackageFind(data?.mikrotikPackage)?.name,
        Cell: ({ row: { original } }) => (
          <div>
            {cus && customerPackageFind(original?.mikrotikPackage)?.name}
          </div>
        ),
      },
      {
        width: "11%",
        Header: t("billBalance"),
        accessor: (data) => `${data?.monthlyFee} ${data?.balance}`,
        Cell: ({ row: { original } }) => (
          <div style={{ fontWeight: "500" }}>
            <p>৳{original?.monthlyFee}</p>
            <p
              className={`text-${
                original?.balance > -1 ? "success" : "danger"
              }`}
            >
              ৳{original?.balance}
            </p>
          </div>
        ),
      },
      {
        width: "18%",
        Header: t("billPromise"),
        accessor: (data) =>
          `${moment(data?.billingCycle).format("YYYY/MM/DD hh:mm A")} 
          ${moment(data?.promiseDate).format("YYYY/MM/DD hh:mm A")}`,
        Cell: ({ row: { original } }) => (
          <div className="d-flex">
            <div>
              <p>{getCustomerPromiseDate(original)?.billDate}</p>

              <p
                className={`d-flex align-self-end text-${
                  getCustomerPromiseDate(original)?.promiseDateChange
                }`}
              >
                {getCustomerPromiseDate(original)?.promiseDate}
              </p>
            </div>
          </div>
        ),
      },
      {
        width: "6%",
        Header: t("day"),
        accessor: (data) => `${new Date(data?.billingCycle).getDay()}`,
        Cell: ({ row: { original } }) => (
          <div className="text-center p-1">
            <p
              className={`${
                getCustomerDayLeft(original?.billingCycle) >= 20
                  ? "border border-2 border-success"
                  : getCustomerDayLeft(original?.billingCycle) >= 10
                  ? "border border-2 border-primary"
                  : getCustomerDayLeft(original?.billingCycle) >= 0
                  ? "magantaColor"
                  : "bg-danger text-white"
              }`}
            >
              {getCustomerDayLeft(original?.billingCycle)}
            </p>
          </div>
        ),
      },
      {
        width: "8%",
        Header: t("status"),
        accessor: (data) => `${data?.paymentStatus} ${data?.status}`,
        Cell: ({ row: { original } }) => (
          <div className="text-center">
            <p>{badge(original?.paymentStatus)}</p>
            <p>{badge(original?.status)}</p>
          </div>
        ),
      },
      {
        width: "5%",
        Header: () => <div className="text-center">{t("action")}</div>,
        id: "option",

        Cell: ({ row: { original } }) => (
          <div className="d-flex justify-content-center align-items-center">
            <div className="dropdown">
              <ThreeDots
                className="dropdown-toggle ActionDots"
                id="areaDropdown"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              />
              <ul className="dropdown-menu" aria-labelledby="customerDrop">
                <li
                  data-bs-toggle="modal"
                  data-bs-target="#showCustomerDetails"
                  onClick={() => {
                    getSpecificCustomer(original.id);
                    setModalStatus("profile");
                    setShow(true);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <PersonFill />
                      <p className="actionP">{t("profile")}</p>
                    </div>
                  </div>
                </li>

                {(permissions?.billPosting || role === "ispOwner") && (
                  <li
                    onClick={() => {
                      getSpecificCustomer(original.id);
                      getSpecificCustomerReport(original);
                      setModalStatus("customerRecharge");
                      setShow(true);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <CashStack />
                        <p className="actionP">{t("recharge")}</p>
                      </div>
                    </div>
                  </li>
                )}

                {(role === "ispOwner" || permissions.customerEdit) && (
                  <li
                    onClick={() => {
                      setSingleCustomer(original.id);
                      setModalStatus("customerEdit");
                      setShow(true);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <PenFill />
                        <p className="actionP">{t("edit")}</p>
                      </div>
                    </div>
                  </li>
                )}

                <li
                  onClick={() => {
                    getSpecificCustomerReport(original);
                    setModalStatus("report");
                    setShow(true);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <FileEarmarkBarGraph />
                      <p className="actionP">{t("report")}</p>
                    </div>
                  </div>
                </li>

                <li
                  onClick={() => {
                    setCustomerNoteId(original.id);
                    setCustomerName(original?.name);
                    setModalStatus("note");
                    setShow(true);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <CardChecklist />
                      <p className="actionP">{t("note")}</p>
                    </div>
                  </div>
                </li>

                {(role === "ispOwner" || permissions.customerDelete) && (
                  <li
                    onClick={() => {
                      customerDelete(original.id);
                      setModalStatus("delete");
                      setShow(true);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <ArchiveFill />
                        <p className="actionP">{t("delete")}</p>
                      </div>
                    </div>
                  </li>
                )}

                {(role === "ispOwner" || permissions.sendSMS) && (
                  <li
                    onClick={() => {
                      getSpecificCustomer(original.id);
                      setModalStatus("message");
                      setShow(true);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <ChatText />
                        <p className="actionP">{t("message")}</p>
                      </div>
                    </div>
                  </li>
                )}

                {role === "ispOwner" &&
                  ispOwnerData?.bpSettings?.hasReseller && (
                    <li
                      onClick={() => {
                        getSpecificCustomer(original.id);
                        setModalStatus("resellerTransfer");
                        setShow(true);
                      }}
                    >
                      <div className="dropdown-item">
                        <div className="customerAction">
                          <ArrowRightSquareFill />
                          <p className="actionP">{t("transferReseller")}</p>
                        </div>
                      </div>
                    </li>
                  )}

                <li
                  onClick={() => {
                    getSpecificCustomer(original);
                    setModalStatus("supportTicket");
                    setShow(true);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <Newspaper />
                      <p className="actionP">{t("supportTicket")}</p>
                    </div>
                  </div>
                </li>

                {role === "ispOwner" && original.mobile && (
                  <li
                    onClick={() => {
                      setUserId(original.user);
                      setModalStatus("password");
                      setShow(true);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <KeyFill />
                        <p className="actionP">{t("passwordReset")}</p>
                      </div>
                    </div>
                  </li>
                )}

                {((role === "ispOwner" && bpSettings?.customerInvoice) ||
                  (role === "manager" && permissions?.customerInvoice)) && (
                  <li
                    onClick={() => {
                      setIsOpen(true);
                      getSpecificCustomer(original.id);
                      setCustomerData(original);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <FileEarmark />
                        <p className="actionP">{t("invoice")}</p>
                      </div>
                    </div>
                  </li>
                )}

                {/* {(role === "ispOwner" || role === "manager") &&
                  bpSettings?.hasMikrotik && (
                    <li onClick={() => macBindingCall(original.id)}>
                      <div className="dropdown-item">
                        <div className="customerAction">
                          <Router />
                          <p className="actionP">{t("macBinding")}</p>
                        </div>
                      </div>
                    </li>
                  )} */}
              </ul>
            </div>
          </div>
        ),
      },
    ],
    [t, cus, allPackages]
  );

  //bulk operations
  const [bulkCustomers, setBulkCustomer] = useState([]);

  //total monthly fee and due calculation
  const dueMonthlyFee = useMemo(() => {
    let dueAmount = 0;
    let totalSumDue = 0;
    let totalMonthlyFee = 0;

    Customers1.map((item) => {
      if (item.paymentStatus === "unpaid") {
        // filter due ammount
        dueAmount = item.monthlyFee - item.balance;

        // total sum due
        totalSumDue += dueAmount;
      }

      // sum of all monthly fee
      totalMonthlyFee += item.monthlyFee;
    });

    return { totalSumDue, totalMonthlyFee };
  }, [Customers1]);

  //custom table header component
  const customComponent = (
    <div
      className="text-center"
      style={{ fontSize: "18px", fontWeight: "500", display: "flex" }}
    >
      {dueMonthlyFee?.totalMonthlyFee > 0 && (
        <div>
          {t("monthlyFee")}:-৳
          {FormatNumber(dueMonthlyFee.totalMonthlyFee)}
        </div>
      )}
      &nbsp;&nbsp;
      {dueMonthlyFee.totalSumDue > 0 && (
        <div>
          {t("due")}:-৳
          {FormatNumber(dueMonthlyFee.totalSumDue)}
        </div>
      )}
    </div>
  );
  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />

      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <div className="collectorTitle d-flex justify-content-between px-4">
                  <h2> {t("staticCustomer")}</h2>

                  <div
                    style={{ height: "45px" }}
                    className="d-flex align-items-center"
                  >
                    <div
                      onClick={() => {
                        if (!activeKeys) {
                          setActiveKeys("filter");
                        } else {
                          setActiveKeys("");
                        }
                      }}
                      title={t("filter")}
                    >
                      <FilterCircle className="addcutmButton" />
                    </div>

                    <div className="reloadBtn">
                      {isLoading ? (
                        <Loader />
                      ) : (
                        <ArrowClockwise
                          className="arrowClock"
                          title={t("refresh")}
                          onClick={() => reloadHandler()}
                        ></ArrowClockwise>
                      )}
                    </div>

                    <div>
                      {(role === "ispOwner" || permissions.customerAdd) && (
                        <PersonPlusFill
                          title={t("addStaticCustomer")}
                          className="addcutmButton"
                          onClick={() => {
                            setModalStatus("customerPost");
                            setShow(true);
                          }}
                        />
                      )}
                    </div>

                    <Collapse in={open} dimension="width">
                      <div id="example-collapse-text">
                        <Card className="cardCollapse border-0">
                          <div className="d-flex align-items-center">
                            {role === "ispOwner" && bpSettings?.hasMikrotik && (
                              <div
                                className="settingbtn"
                                title={t("packageSetting")}
                              >
                                <Link to={`/packageSetting`}>
                                  <BoxSeam className="addcutmButton" />
                                </Link>
                              </div>
                            )}
                            {role === "ispOwner" &&
                              (bpSettings?.queueType === "simple-queue" ||
                                bpSettings?.queueType === "core-queue") &&
                              bpSettings?.hasMikrotik && (
                                <div
                                  className="addAndSettingIcon"
                                  title={t("fireWallFilterIpDrop")}
                                  onClick={() => {
                                    setModalStatus("IPDrop");
                                    setShow(true);
                                  }}
                                >
                                  <ReceiptCutoff className="addcutmButton" />
                                </div>
                              )}

                            {((role === "manager" &&
                              permissions?.customerEdit) ||
                              role === "ispOwner") && (
                              <div
                                className="addAndSettingIcon"
                                title={t("customerNumberUpdateOrDelete")}
                                onClick={() =>
                                  setNumberModalShow({
                                    ...numberModalShow,
                                    [false]: true,
                                  })
                                }
                              >
                                <PencilSquare className="addcutmButton" />
                              </div>
                            )}

                            {(permissions?.viewCustomerList ||
                              role === "ispOwner") && (
                              <>
                                <div className="addAndSettingIcon">
                                  <CSVLink
                                    data={customerForCsVTableInfo}
                                    filename={ispOwnerData.company}
                                    headers={customerForCsVTableInfoHeader}
                                    title="Customer Report"
                                  >
                                    <FiletypeCsv className="addcutmButton" />
                                  </CSVLink>
                                </div>

                                <div className="addAndSettingIcon">
                                  <CSVLink
                                    data={customerForCsV}
                                    filename={ispOwnerData.company}
                                    headers={headers}
                                    title={t("downloadBTRCreport")}
                                  >
                                    <FileExcelFill className="addcutmButton" />
                                  </CSVLink>
                                </div>

                                <div className="addAndSettingIcon">
                                  <PrinterFill
                                    title={t("print")}
                                    className="addcutmButton"
                                    onClick={() => {
                                      setModalStatus("print");
                                      setShow(true);
                                    }}
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </Card>
                      </div>
                    </Collapse>

                    {!open && (
                      <ArrowBarLeft
                        className="ms-1"
                        size={34}
                        style={{ cursor: "pointer" }}
                        onClick={() => setOpen(!open)}
                        aria-controls="example-collapse-text"
                        aria-expanded={open}
                      />
                    )}

                    {open && (
                      <ArrowBarRight
                        className="ms-1"
                        size={34}
                        style={{ cursor: "pointer" }}
                        onClick={() => setOpen(!open)}
                        aria-controls="example-collapse-text"
                        aria-expanded={open}
                      />
                    )}
                  </div>
                </div>
              </FourGround>

              <FourGround>
                {permissions?.viewCustomerList || role !== "collector" ? (
                  <div className="mt-2">
                    <Accordion alwaysOpen activeKey={activeKeys}>
                      <Accordion.Item eventKey="filter">
                        <Accordion.Body>
                          <div className="displayGrid6">
                            <select
                              className="form-select shadow-none mt-0"
                              onChange={(e) => {
                                onChangeArea(e.target.value);
                                setFilterOption({
                                  ...filterOptions,
                                  area: JSON.parse(e.target.value).id,
                                });
                              }}
                            >
                              <option
                                value={JSON.stringify({
                                  id: "",
                                  name: "",
                                  subAreas: [],
                                })}
                                defaultValue
                                selected={filterOptions.area === ""}
                              >
                                {t("allArea")}
                              </option>

                              {Customers2.some((c) => c.area === "noArea") && (
                                <option
                                  value={JSON.stringify({
                                    id: "noArea",
                                    name: "",
                                    subAreas: [],
                                  })}
                                  selected={filterOptions.area === "noArea"}
                                >
                                  {t("customerWithoutArea")}
                                </option>
                              )}

                              {(role === "collector" ? allArea : allareas)?.map(
                                (area, key) => {
                                  return (
                                    <option
                                      selected={filterOptions.area === area.id}
                                      key={key}
                                      value={JSON.stringify(area)}
                                    >
                                      {area.name}
                                    </option>
                                  );
                                }
                              )}
                            </select>

                            {/* //Todo */}
                            <select
                              className="form-select shadow-none mt-0"
                              onChange={(e) => {
                                onChangeSubArea(e.target.value);
                                setFilterOption({
                                  ...filterOptions,
                                  subArea: e.target.value,
                                });
                              }}
                            >
                              <option
                                selected={filterOptions.subArea === ""}
                                value=""
                                defaultValue
                              >
                                {t("subArea")}
                              </option>
                              {subAreas?.map((sub, key) => (
                                <option
                                  selected={filterOptions.subArea === sub.id}
                                  key={key}
                                  value={sub.id}
                                >
                                  {sub.name}
                                </option>
                              ))}
                            </select>

                            <select
                              className="form-select shadow-none mt-0"
                              onChange={(e) => {
                                setFilterOption({
                                  ...filterOptions,
                                  poleBox: e.target.value,
                                });
                              }}
                            >
                              <option
                                selected={filterOptions.poleBox === ""}
                                value=""
                                defaultValue
                              >
                                {t("poleBox")}
                              </option>
                              {currentPoleBox?.map((pol, key) => (
                                <option
                                  selected={filterOptions.poleBox === pol.id}
                                  key={key}
                                  value={pol.id}
                                >
                                  {pol.name}
                                </option>
                              ))}
                            </select>

                            <select
                              className="form-select shadow-none mt-0"
                              onChange={(e) => {
                                setFilterOption({
                                  ...filterOptions,
                                  status: e.target.value,
                                });
                              }}
                            >
                              <option
                                selected={filterOptions.status === ""}
                                value=""
                                defaultValue
                              >
                                {t("status")}
                              </option>
                              <option
                                selected={filterOptions.status === "active"}
                                value="active"
                              >
                                {t("active")}
                              </option>
                              <option
                                selected={filterOptions.status === "inactive"}
                                value="inactive"
                              >
                                {t("in active")}
                              </option>
                              <option
                                selected={filterOptions.status === "expired"}
                                value="expired"
                              >
                                {t("expired")}
                              </option>
                            </select>

                            <select
                              className="form-select shadow-none mt-0"
                              onChange={(e) => {
                                setFilterOption({
                                  ...filterOptions,
                                  paymentStatus: e.target.value,
                                });
                              }}
                            >
                              <option
                                selected={filterOptions.paymentStatus === ""}
                                value=""
                                defaultValue
                              >
                                {t("paymentStatus")}
                              </option>
                              <option
                                selected={
                                  filterOptions.paymentStatus === "free"
                                }
                                value="free"
                              >
                                {t("free")}
                              </option>
                              <option
                                selected={
                                  filterOptions.paymentStatus === "paid"
                                }
                                value="paid"
                              >
                                {t("payPaid")}
                              </option>
                              <option
                                selected={
                                  filterOptions.paymentStatus === "unpaid"
                                }
                                value="unpaid"
                              >
                                {t("unpaid")}
                              </option>
                              <option
                                selected={
                                  filterOptions.paymentStatus === "partial"
                                }
                                value="partial"
                              >
                                {t("partial")}
                              </option>
                              <option
                                selected={
                                  filterOptions.paymentStatus === "advance"
                                }
                                value="advance"
                              >
                                {t("advance")}
                              </option>
                              <option
                                selected={
                                  filterOptions.paymentStatus === "overdue"
                                }
                                value="overdue"
                              >
                                {t("overDue")}
                              </option>
                            </select>
                            {bpSettings?.hasMikrotik && (
                              <select
                                className="form-select shadow-none mt-0"
                                onChange={(e) => {
                                  mikrotikHandler(e.target.value);
                                }}
                              >
                                <option
                                  selected={filterOptions.mikrotik === ""}
                                  value=""
                                  defaultValue
                                >
                                  {t("mikrotik")}
                                </option>

                                {mikrotiks.map((m, i) => {
                                  return (
                                    <option
                                      key={i}
                                      selected={
                                        filterOptions.mikrotik === `${m.id}`
                                      }
                                      value={m.id}
                                    >
                                      {m.name}
                                    </option>
                                  );
                                })}
                              </select>
                            )}

                            <select
                              className="form-select shadow-none mt-0"
                              onChange={(e) => {
                                setFilterOption({
                                  ...filterOptions,
                                  package: e.target.value,
                                });
                              }}
                            >
                              <option
                                selected={filterOptions.mikrotik === ""}
                                value=""
                                defaultValue
                              >
                                {t("package")}
                              </option>

                              {mikrotikPac?.map((m, i) => {
                                return (
                                  <option
                                    key={i}
                                    selected={
                                      filterOptions.package === `${m.name}`
                                    }
                                    value={m.id}
                                  >
                                    {m.name}
                                  </option>
                                );
                              })}
                            </select>

                            <select
                              onChange={(e) =>
                                setFilterOption({
                                  ...filterOptions,
                                  freeUser: e.target.value,
                                })
                              }
                              className="form-select shadow-none mt-0"
                            >
                              <option
                                selected={filterOptions.freeUser === "allUser"}
                                value="allUser"
                              >
                                {t("sokolCustomer")}
                              </option>
                              <option
                                selected={filterOptions.freeUser === "freeUser"}
                                value="freeUser"
                              >
                                {t("freeCustomer")}
                              </option>
                              <option
                                selected={
                                  filterOptions.freeUser === "nonFreeUser"
                                }
                                value="nonFreeUser"
                              >
                                {t("nonFreeCustomer")}
                              </option>
                            </select>

                            <select
                              className="form-select shadow-none mt-0"
                              onChange={(e) =>
                                setFilterOption({
                                  ...filterOptions,
                                  dayFilter: e.target.value,
                                })
                              }
                            >
                              <option value="">{t("filterBillDate")}</option>
                              <option value="1">{t("oneDayLeft")}</option>
                              <option value="2">{t("twoDayLeft")}</option>
                              <option value="3">{t("threeDayLeft")}</option>
                              <option value="4">{t("fourDayLeft")}</option>
                            </select>

                            <div>
                              <DatePicker
                                className="form-control mt-0"
                                selected={filterOptions.startDate}
                                onChange={(date) =>
                                  setFilterOption({
                                    ...filterOptions,
                                    startDate: date,
                                  })
                                }
                                dateFormat="dd-MM-yyyy"
                                placeholderText={t("startBillingCycleDate")}
                              />
                            </div>

                            <div>
                              <DatePicker
                                className="form-control mt-0"
                                selected={filterOptions.endDate}
                                onChange={(date) =>
                                  setFilterOption({
                                    ...filterOptions,
                                    endDate: date,
                                  })
                                }
                                dateFormat="dd-MM-yyyy"
                                placeholderText={t("endBillingCycleDate")}
                              />
                            </div>

                            <select
                              className="form-select shadow-none mt-0"
                              onChange={changePromiseConnection}
                            >
                              <option value="">{t("promiseDateChange")}</option>
                              <option value="changedPromiseDate">
                                {t("changedCustomer")}
                              </option>
                              <option value="true">{t("connectionOn")}</option>
                              <option value="false">
                                {t("connectionOff")}
                              </option>
                            </select>

                            <div
                              id="customer_filter_button"
                              className="d-flex justify-content-end align-items-end mt-0"
                            >
                              <button
                                className="btn btn-outline-primary w-6rem h-76"
                                id="filterBtn"
                                type="button"
                                onClick={handleActiveFilter}
                              >
                                {t("filter")}
                              </button>
                              <button
                                className="btn btn-outline-secondary w-6rem h-76 ms-2"
                                id="filter_reset"
                                type="button"
                                onClick={handleFilterReset}
                              >
                                {t("reset")}
                              </button>
                            </div>
                          </div>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>

                    <div className="collectorWrapper pb-2">
                      <Table
                        isLoading={customerLoading}
                        customComponent={customComponent}
                        bulkLength={bulkCustomers?.length}
                        columns={columns}
                        data={Customers1}
                        bulkState={{
                          setBulkCustomer,
                        }}
                      ></Table>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                {(butPermission?.customer || butPermission?.allPage) && (
                  <NetFeeBulletin />
                )}
              </FourGround>

              <Footer />
            </FontColor>
          </div>
        </div>
      </div>

      {/* Model start */}

      {/* customer profile details modal */}
      {modalStatus === "profile" && (
        <CustomerDetails
          show={show}
          setShow={setShow}
          customerId={singleCustomer}
        />
      )}

      {/* customer create modal */}
      {modalStatus === "customerPost" && (
        <AddStaticCustomer show={show} setShow={setShow} />
      )}

      {/* single customer update */}
      {modalStatus === "customerEdit" && (
        <EditStaticCustomer
          show={show}
          setShow={setShow}
          single={singleCustomer}
          handleActiveFilter={handleActiveFilter}
        />
      )}

      {/* customer bill collection */}
      {modalStatus === "customerRecharge" && (
        <RechargeCustomer
          show={show}
          setShow={setShow}
          single={singleCustomer}
          customerData={customerReportData}
        />
      )}

      {/* customer report modal */}
      {modalStatus === "report" && (
        <CustomerReport
          show={show}
          setShow={setShow}
          single={customerReportData}
        />
      )}

      {/* customer note modal */}
      {modalStatus === "note" && (
        <CustomerNote
          show={show}
          setShow={setShow}
          customerId={customerNoteId}
          customerName={customerName}
        />
      )}

      {/* customer delete modal */}
      {modalStatus === "delete" && (
        <CustomerDelete
          show={show}
          setShow={setShow}
          single={singleData}
          mikrotikCheck={mikrotikCheck}
          setMikrotikCheck={setMikrotikCheck}
        />
      )}

      {/* static customer message */}
      {modalStatus === "message" && (
        <SingleMessage
          show={show}
          setShow={setShow}
          single={singleCustomer}
          sendCustomer="staticCustomer"
        />
      )}

      {/* transferReseller modal */}
      {modalStatus === "resellerTransfer" && (
        <TransferToReseller
          show={show}
          setShow={setShow}
          customerId={singleCustomer}
          page="static"
        />
      )}

      {/* password reset modal */}
      {modalStatus === "password" && (
        <PasswordReset show={show} setShow={setShow} userId={userId} />
      )}

      {/* support ticket modal */}
      {modalStatus === "supportTicket" && (
        <CreateSupportTicket
          show={show}
          setShow={setShow}
          collectors={collectors}
          manager={manager}
          customer={singleCustomer}
          ispOwner={ispOwnerId}
          reseller=""
        />
      )}

      {/* customers number update or delete modal */}
      <CustomersNumber showModal={numberModalShow} />

      {/* fire wall filter ip drop control */}
      {modalStatus === "IPDrop" && (
        <FireWallFilterIpDropControl show={show} setShow={setShow} />
      )}

      {/* print option modal */}
      {modalStatus === "print" && (
        <PrintOptions
          show={show}
          setShow={setShow}
          filterData={filterData}
          tableData={Customers1}
          page="customer"
          printData={printData}
        />
      )}

      {/* static customer create invoice */}
      <StaticCreateInvoice
        show={isOpen}
        setShow={setIsOpen}
        single={singleCustomer}
        customerData={customerData}
      />

      {/* Model finish */}

      {/* bulk options modal  */}
      <BulkOptions bulkCustomers={bulkCustomers} page="static" />
    </>
  );
};

export default Customer;
