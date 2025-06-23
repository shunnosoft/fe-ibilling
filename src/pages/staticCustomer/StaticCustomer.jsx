import React, { useEffect, useState, useMemo } from "react";
import moment from "moment";
import { CSVLink } from "react-csv";
import { Link, useNavigate } from "react-router-dom";
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
  ClockHistory,
} from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { Accordion, Card, Collapse } from "react-bootstrap";
import { useTranslation } from "react-i18next";

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
  fetchMikrotik,
  getArea,
  getAllPackages,
  getQueuePackageByIspOwnerId,
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
import CustomerDelete from "../Customer/customerCRUD/CustomerDelete";
import TransferToReseller from "../Customer/customerCRUD/TransferToReseller";
import BulkOptions from "../Customer/customerCRUD/bulkOpration/BulkOptions";
import DataFilter from "../common/DataFilter";
import useDataState from "../../hooks/useDataState";
import { handleActiveFilter } from "../common/activeFilter";
import useSelectorState from "../../hooks/useSelectorState";

const Customer = () => {
  //call hooks
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // current Date
  let today = new Date();
  let firstDate = new Date(today.getFullYear(), today.getMonth(), 1);
  let lastDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  firstDate.setHours(0, 0, 0, 0);
  lastDate.setHours(23, 59, 59, 999);

  //---> Get user & current user data form useISPOwner hooks
  const { role, ispOwnerData, ispOwnerId, bpSettings, permissions } =
    useISPowner();

  //---> Get redux store state data from useSelectorState hooks
  const {
    areas,
    subAreas,
    polesBox,
    mikrotiks,
    allPackages,
    withoutMtkPackages,
    bulletinPermission,
  } = useSelectorState();

  // get user data set from useDataState hooks
  const { filterOptions, setFilterOption } = useDataState();

  //get ispOwner all manager & collector form redux store
  const manager = useSelector((state) => state.manager?.manager);
  const collectors = useSelector((state) => state?.collector?.collector);

  // get static customer form redux store
  const customers = useSelector((state) => state?.customer?.staticCustomer);

  // ispOwner collector area
  const collectorArea = useSelector((state) =>
    role === "collector"
      ? state.persistedReducer.auth?.currentUser?.collector?.areas
      : []
  );

  //loading state
  const [isLoading, setIsLoading] = useState(false);
  const [customerLoading, setCustomerLoading] = useState(false);

  //user id
  const [userId, setUserId] = useState();

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

  const [staticCustomers, setStaticCustomers] = useState([]);

  // set customer id in state for note
  const [customerNoteId, setCustomerNoteId] = useState();

  // set customer name state
  const [customerName, setCustomerName] = useState("");

  // get specific customer
  const [singleCustomer, setSingleCustomer] = useState("");
  const [singleData, setSingleData] = useState();
  const [customerData, setCustomerData] = useState({});

  const [allArea, setAreas] = useState([]);

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

  // bulk modal handle state
  const [isOpen, setIsOpen] = useState(false);

  //================// API CALL's //================//
  useEffect(() => {
    //===========================================================> FIRST API

    //---> @Get ispOwner areas sub-area data
    !subAreas.length && getSubAreasApi(dispatch, ispOwnerId);

    //---> @Get ispOwner queue all customer data
    !customers?.length &&
      getStaticCustomer(dispatch, ispOwnerId, setCustomerLoading);

    //===========================================================> SECOND STEP API

    //---> @Get ispOwner areas data
    !areas?.length && getArea(dispatch, ispOwnerId, setIsLoading);

    //---> @Get ispOwner mikrotiks data
    !mikrotiks?.length && fetchMikrotik(dispatch, ispOwnerId, setIsLoading);

    //---> @Get ispOwner mikrotiks queue package data
    !withoutMtkPackages.length &&
      getQueuePackageByIspOwnerId(ispOwnerId, dispatch, setIsLoading);

    //===========================================================> LAST API

    //---> @Get ispOwner all mikrotik packages data
    !allPackages.length && getAllPackages(dispatch, ispOwnerId, setIsLoading);

    //---> @Get ispOwner sub-areas pol-box data
    !polesBox?.length && getPoleBoxApi(dispatch, ispOwnerId, setIsLoading);

    //---> @Get bulletin permissions data
    Object.keys(bulletinPermission)?.length === 0 &&
      getBulletinPermission(dispatch);
  }, []);

  useEffect(() => {
    let customerModified = [];

    // add area to customers
    customers?.map((c) => {
      if (!c.area) {
        subAreas?.map((sub) => {
          if (sub.id === c.subArea) {
            customerModified.push({
              ...c,
              area: sub.area,
            });
          }
        });
      } else {
        customerModified.push(c);
      }
    });

    // set customers in state
    setStaticCustomers(customerModified);

    // set customer in state for filter
    Object?.values(filterOptions) &&
      setStaticCustomers(handleActiveFilter(customerModified, filterOptions));
  }, [customers]);

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
    setSingleData(customerId);
  };

  // reload Handler
  const reloadHandler = () => {
    getStaticCustomer(dispatch, ispOwnerId, setCustomerLoading);
  };

  // set filter value in pdf
  const filterData = {
    area: filterOptions.area
      ? areas.find((item) => item.id === filterOptions.area).name
      : t("allArea"),
    subArea: filterOptions.subArea
      ? subAreas.find((item) => item.id === filterOptions.subArea).name
      : t("allSubArea"),
    status: filterOptions.status,
    payment: filterOptions.paymentStatus,
  };

  // customer current package find
  const customerPackageFind = (pack) => {
    const findPack = allPackages.find((item) => item.id.includes(pack));
    return findPack;
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

  let customerForCsV = staticCustomers.map((customer) => {
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
  let customerForCsVTableInfo = staticCustomers.map((customer) => {
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

  // single customer activity log handle
  const handleCustomerActivityLog = (data) => {
    navigate(`/activity/${data?.id}`, { state: data });
  };

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
        accessor: (data) => `${data?.name} ${data.queue?.target}`,
        Cell: ({ row: { original } }) => (
          <div>
            <p>{original?.name}</p>
            <p>
              {original.queue.target}

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
            {customers && customerPackageFind(original?.mikrotikPackage)?.name}
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
        accessor: (data) => `${getCustomerDayLeft(data?.billingCycle)}`,
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

                <li onClick={() => handleCustomerActivityLog(original)}>
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <ClockHistory />
                      <p className="actionP">{t("activityLog")}</p>
                    </div>
                  </div>
                </li>

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
    [t, customers, allPackages]
  );

  //bulk operations
  const [bulkCustomers, setBulkCustomer] = useState([]);

  //total monthly fee and due calculation
  const dueMonthlyFee = useMemo(() => {
    let dueAmount = 0;
    let totalSumDue = 0;
    let totalMonthlyFee = 0;

    staticCustomers.map((item) => {
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
  }, [staticCustomers]);

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
                        />
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
                          <DataFilter
                            page="static"
                            customers={customers}
                            setCustomers={setStaticCustomers}
                            filterOptions={filterOptions}
                            setFilterOption={setFilterOption}
                          />
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>

                    <div className="collectorWrapper pb-2">
                      <Table
                        isLoading={customerLoading}
                        customComponent={customComponent}
                        bulkLength={bulkCustomers?.length}
                        columns={columns}
                        data={staticCustomers}
                        bulkState={{
                          setBulkCustomer,
                        }}
                      ></Table>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                {(bulletinPermission?.customer ||
                  bulletinPermission?.allPage) && <NetFeeBulletin />}
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
          tableData={staticCustomers}
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
