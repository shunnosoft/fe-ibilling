import React, { useEffect, useMemo, useState } from "react";
import {
  ArchiveFill,
  ArrowClockwise,
  ArrowRightSquareFill,
  CardChecklist,
  CashStack,
  ChatText,
  FileExcelFill,
  FiletypeCsv,
  FilterCircle,
  KeyFill,
  Newspaper,
  PenFill,
  PersonFill,
  PersonPlusFill,
  PrinterFill,
  ThreeDots,
  ArrowBarLeft,
  ArrowBarRight,
  PencilSquare,
  Phone,
  GeoAlt,
  FileEarmarkBarGraph,
  FileEarmark,
  ClockHistory,
} from "react-bootstrap-icons";
import { CSVLink } from "react-csv";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { Accordion, Card, Collapse } from "react-bootstrap";

// internal import
import Table from "../../components/table/Table";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { badge } from "../../components/common/Utils";
import IndeterminateCheckbox from "../../components/table/bulkCheckbox";
import {
  getPoleBoxApi,
  getSubAreasApi,
} from "../../features/actions/customerApiCall";
import {
  editCustomer,
  fetchMikrotik,
  fetchReseller,
  getArea,
  getCollector,
  getCustomer,
  getManger,
  getPPPoEPackage,
  getPackagewithoutmikrotik,
} from "../../features/apiCalls";
import useDash from "../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import Loader from "../../components/common/Loader";
import CustomerPost from "./customerCRUD/CustomerPost";
import CustomerDetails from "./customerCRUD/CustomerDetails";
import CustomerReport from "./customerCRUD/showCustomerReport";
import SingleMessage from "../../components/singleCustomerSms/SingleMessage";
import TransferToReseller from "./customerCRUD/TransferToReseller";
import CustomerDelete from "./customerCRUD/CustomerDelete";
import FormatNumber from "../../components/common/NumberFormat";
import Footer from "../../components/admin/footer/Footer";
import BandwidthModal from "./BandwidthModal";
import CustomerNote from "./customerCRUD/CustomerNote";
import PasswordReset from "../../components/modals/passwordReset/PasswordReset";
import CreateSupportTicket from "../../components/modals/CreateSupportTicket";
import CustomersNumber from "./CustomersNumber";
import "./client.css";
import CreateInvoice from "./customerCRUD/CreateInvoice";
import NetFeeBulletin from "../../components/bulletin/NetFeeBulletin";
import { getBulletinPermission } from "../../features/apiCallAdmin";
import EditPPPoECustomer from "./customerCRUD/temp/EditPPPoECustomer";
import RechargeCustomer from "./customerCRUD/temp/RechargeCustomer";
import PrintOptions from "../../components/common/PrintOptions";
import {
  getCustomerDayLeft,
  getCustomerPromiseDate,
} from "./customerCRUD/customerBillDayPromiseDate";
import useISPowner from "../../hooks/useISPOwner";
import { getOwnerUsers } from "../../features/getIspOwnerUsersApi";
import BulkOptions from "./customerCRUD/bulkOpration/BulkOptions";
import DataFilter from "../common/DataFilter";
import useDataState from "../../hooks/useDataState";
import { handleActiveFilter } from "../common/activeFilter";
import { useNavigate } from "react-router-dom";

const PPPOECustomer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // current Date
  let today = new Date();
  let firstDate = new Date(today.getFullYear(), today.getMonth(), 1);
  let lastDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  firstDate.setHours(0, 0, 0, 0);
  lastDate.setHours(23, 59, 59, 999);

  // get user & current user data form useISPOwner hooks
  const { role, ispOwnerId, bpSettings, permissions } = useISPowner();

  // get user data set from useDataState hooks
  const { filterOptions, setFilterOption } = useDataState();

  // get all customer
  const customers = useSelector((state) => state.customer.customer);

  // get collector
  const collectors = useSelector((state) => state?.collector?.collector);

  // get manager
  const manager = useSelector((state) => state.manager?.manager);

  // get isp owner data
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth.userData
  );

  //get all areas
  const areas = useSelector((state) => state.area?.area);

  // get all subarea
  const subAreas = useSelector((state) => state.area?.subArea);

  //get mikrotik
  const mikrotiks = useSelector((state) => state?.mikrotik?.mikrotik);

  // get all package list
  let packages = useSelector((state) => state?.package?.pppoePackages);

  //get all pole Box
  const poleBox = useSelector((state) => state.area?.poleBox);

  // get bulletin permission
  const bulletinPagePermission = useSelector(
    (state) => state.adminNetFeeSupport?.bulletinPermission
  );

  //loading states
  const [loading, setLoading] = useState(false);

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

  // customer loading state
  const [customerLoading, setCustomerLoading] = useState(false);

  // customer state
  const [pppoeCustomers, setPPPoeCustomers] = useState([]);

  // bulk customer state
  const [bulkCustomers, setBulkCustomer] = useState([]);

  // customer id state
  const [customerId, setCustomerId] = useState("");

  // user id state
  const [userId, setUserId] = useState();

  // set customer id in state for note
  const [customerNoteId, setCustomerNoteId] = useState();

  // set customer name state
  const [customerName, setCustomerName] = useState("");

  // check uncheck mikrotik state when delete customer
  const [checkMikrotik, setMikrotikCheck] = useState(false);

  // single customer object state
  const [customerData, setCustomerData] = useState({});

  // print modal state
  const [modalShow, setModalShow] = useState(false);

  //bandwidth modal state
  const [bandWidthModal, setBandWidthModal] = useState(false);

  // collector loading
  const [collectorLoading, setCollectorLoading] = useState(false);

  // get specific customer
  const [singleCustomer, setSingleCustomer] = useState("");

  // customers number update or delete modal show state
  const [numberModalShow, setNumberModalShow] = useState(false);

  const [open, setOpen] = useState(false);

  // pole box filter loding
  const [isLoadingPole, setIsLoadingPole] = useState(false);

  // optional modal state
  const [modalStatus, setModalStatus] = useState("");
  const [showModal, setShowModal] = useState(false);

  // bulk modal handle state
  const [show, setShow] = useState(false);

  //initial api calls
  useEffect(() => {
    // get mikrotik api without mikrotik / has mikrotik
    if (!bpSettings?.hasMikrotik) {
      getPackagewithoutmikrotik(ispOwnerId, dispatch, setLoading);
    } else {
      if (mikrotiks.length === 0)
        fetchMikrotik(dispatch, ispOwnerId, setLoading);
    }

    // get area api
    if (areas.length === 0) getArea(dispatch, ispOwnerId, setLoading);

    // get sub area api
    if (subAreas.length === 0) getSubAreasApi(dispatch, ispOwnerId);

    // get customer api
    if (customers.length === 0)
      getCustomer(dispatch, ispOwnerId, setCustomerLoading);

    // get package list api
    if (packages.length === 0)
      getPPPoEPackage(dispatch, ispOwnerId, setIsLoadingPole);

    if (role !== "collector") {
      if (collectors.length === 0)
        getCollector(dispatch, ispOwnerId, setCollectorLoading);
      role === "ispOwner" && getManger(dispatch, ispOwnerId);
    }

    if (poleBox.length === 0)
      getPoleBoxApi(dispatch, ispOwnerId, setIsLoadingPole);

    // get ispOwner all staffs
    getOwnerUsers(dispatch, ispOwnerId);

    // get reseller api
    fetchReseller(dispatch, ispOwnerId, setCollectorLoading);

    // bulletin get apipppoeCustomerOption
    Object.keys(bulletinPagePermission)?.length === 0 &&
      getBulletinPermission(dispatch);
  }, []);

  // set all customer in state
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
    setPPPoeCustomers(customerModified);

    // set customer in state for filter
    Object?.values(filterOptions) &&
      setPPPoeCustomers(handleActiveFilter(customerModified, filterOptions));
  }, [customers]);

  //get single customer from user action
  const getSpecificCustomer = (customerId) => {
    setCustomerId(customerId);
  };

  // customer delete controller
  const customerDelete = (customerId) => {
    setMikrotikCheck(false);
    setCustomerId(customerId);
  };

  // reload handler
  const reloadHandler = () => {
    getCustomer(dispatch, ispOwnerId, setCustomerLoading);
  };

  //total monthly fee and due calculation
  const dueMonthlyFee = useMemo(() => {
    let dueAmount = 0;
    let totalSumDue = 0;
    let totalMonthlyFee = 0;

    pppoeCustomers.map((item) => {
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
  }, [pppoeCustomers]);

  const bandwidthModalController = (customerID) => {
    setCustomerId(customerID);
    setBandWidthModal(true);
  };

  // pppoe customer print option
  const printData = {
    id: 1003,
    value: "pppoe",
    label: "pppoe",
    checked: true,
  };

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

  //print modal controller
  const printModalController = (customerID) => {
    setModalShow(true);
  };

  //find customer subArea name
  const getCustomerSubArea = (value) => {
    const findSubArea = subAreas.find((val) => val.id === value?.subArea);

    const findArea = areas.find((val) => val.id === findSubArea?.area);

    return { findSubArea, findArea };
  };

  // atuomatic connection on off doble clicked handle
  const autoDisableHandle = (value, e) => {
    if (e?.detail == 2 && value) {
      let data = {
        ...value,
        singleCustomerID: value?.id,
        autoDisable: !value?.autoDisable,
      };
      editCustomer(dispatch, data, setLoading, setShow, "auto");
    }
  };

  // mikrotik find
  const getMikrotik = (id) => {
    const mikrotik = mikrotiks.find((val) => val?.id === id);
    return mikrotik;
  };

  // single customer activity log handle
  const handleCustomerActivityLog = (data) => {
    navigate(`/activity/${data?.id}`);
  };

  //column for table
  const columns = useMemo(
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
        Cell: ({ row: { original } }) => {
          return (
            <>
              {bpSettings.hasMikrotik && (
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
              )}

              {!bpSettings.hasMikrotik && <p>{original?.customerId}</p>}
            </>
          );
        },
      },
      {
        width: "13%",
        Header: t("namePPPoE"),
        accessor: (data) => `${data?.name} ${data.pppoe?.name}`,
        Cell: ({ row: { original } }) => (
          <div>
            <p>{original?.name}</p>
            <p>
              {original.pppoe?.name}
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
        accessor: "pppoe.profile",
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

              {bpSettings?.promiseDate && (
                <p
                  className={`d-flex align-self-end text-${
                    getCustomerPromiseDate(original)?.promiseDateChange
                  }`}
                >
                  {getCustomerPromiseDate(original)?.promiseDate}
                </p>
              )}
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
        Header: t("action"),
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
                  onClick={() => {
                    getSpecificCustomer(original.id);
                    setModalStatus("profile");
                    setShowModal(true);
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
                      setCustomerId(original.id);
                      setCustomerData(original);
                      setModalStatus("customerRecharge");
                      setShowModal(true);
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

                {(permissions?.customerEdit || role === "ispOwner") && (
                  <li
                    onClick={() => {
                      setCustomerId(original.id);
                      setModalStatus("customerEdit");
                      setShowModal(true);
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
                    setCustomerData(original);
                    setModalStatus("report");
                    setShowModal(true);
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
                    setShowModal(true);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <CardChecklist />
                      <p className="actionP">{t("note")}</p>
                    </div>
                  </div>
                </li>

                {(permissions?.customerDelete || role === "ispOwner") && (
                  <li
                    onClick={() => {
                      customerDelete(original.id);
                      setModalStatus("delete");
                      setShowModal(true);
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

                {permissions?.sendSMS || role !== "collector" ? (
                  <li
                    onClick={() => {
                      getSpecificCustomer(original.id);
                      setModalStatus("message");
                      setShowModal(true);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <ChatText />
                        <p className="actionP">{t("message")}</p>
                      </div>
                    </div>
                  </li>
                ) : (
                  ""
                )}
                {role === "ispOwner" &&
                  ispOwnerData?.bpSettings?.hasReseller && (
                    <li
                      onClick={() => {
                        getSpecificCustomer(original.id);
                        setModalStatus("resellerTransfer");
                        setShowModal(true);
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
                {/* {(role === "ispOwner" || role === "manager") &&
                  ispOwnerData.bpSettings?.hasMikrotik && (
                    <li onClick={() => bandwidthModalController(original.id)}>
                      <div className="dropdown-item">
                        <div className="customerAction">
                          <Server />
                          <p className="actionP">{t("bandwidth")}</p>
                        </div>
                      </div>
                    </li>
                  )} */}

                <li
                  onClick={() => {
                    setSingleCustomer(original);
                    setModalStatus("supportTicket");
                    setShowModal(true);
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
                      setModalStatus("passwordReset");
                      setShowModal(true);
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
                      getSpecificCustomer(original.id);
                      setCustomerData(original);
                      setModalStatus("invoice");
                      setShowModal(true);
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
              </ul>
            </div>
          </div>
        ),
      },
    ],
    [t]
  );

  const sortingCustomer = useMemo(() => {
    return [...pppoeCustomers].sort((a, b) => {
      a = parseInt(a.customerId?.replace(/[^0-9]/g, ""));
      b = parseInt(b.customerId?.replace(/[^0-9]/g, ""));

      return a - b;
    });
  }, [pppoeCustomers]);

  const tableData = useMemo(() => sortingCustomer, [pppoeCustomers]);

  //export customer data
  let customerForCsV = useMemo(
    () =>
      tableData.map((customer) => {
        return {
          companyName: ispOwnerData.company,
          home: "Home",
          companyAddress: ispOwnerData.address,
          name: customer.name,
          customerAddress: customer.address,
          connectionType: "Wired",
          connectivity: "Share",
          createdAt: moment(customer.createdAt).format("MM/DD/YYYY"),
          package: customer?.pppoe?.profile,
          division: customer?.division || "",
          district: customer?.district || "",
          thana: customer?.thana || "",
          mobile: customer?.mobile || "",
          email: customer.email || "",
          monthlyFee: customer.monthlyFee,
        };
      }),
    [pppoeCustomers]
  );

  // csv header
  const headers = [
    { label: "client_type", key: "home" },
    { label: "connection_type", key: "connectionType" },
    { label: "client_name", key: "name" },
    { label: "bandwidth_distribution_point", key: "companyAddress" },
    { label: "connectivity_type", key: "connectivity" },
    { label: "activation_date", key: "createdAt" },
    { label: "bandwidth_allocation", key: "package" },
    { label: "division", key: "division" },
    { label: "district", key: "district" },
    { label: "thana", key: "thana" },
    { label: "address", key: "customerAddress" },
    { label: "client_mobile", key: "mobile" },
    { label: "client_email", key: "email" },
    { label: "selling_bandwidthBDT (Excluding VAT).", key: "monthlyFee" },
  ];

  //export customer data
  let customerForCsVTableInfo = useMemo(
    () =>
      tableData.map((customer) => {
        return {
          customerId: customer.customerId,
          name: customer.name,
          pppoeName: customer.pppoe?.name,
          customerAddress: customer.address,
          createdAt: moment(customer.createdAt).format("YYYY-MM-DD"),
          mikrotik: getMikrotik(customer.mikrotik)?.name,
          package: customer?.pppoe?.profile,
          password: customer?.pppoe?.password,
          mobile: customer?.mobile || "",
          status: customer.status,
          paymentStatus: customer.paymentStatus,
          subArea: customer && getCustomerSubArea(customer)?.findSubArea?.name,
          area: customer && getCustomerSubArea(customer)?.findArea?.name,
          email: customer.email || "",
          monthlyFee: customer.monthlyFee,
          balance: customer.balance,
          userType: customer?.queue.type,
          billingCycle: moment(customer.billingCycle).format("YYYY-MM-DD"),
        };
      }),
    [pppoeCustomers]
  );

  // csv table header
  const customerForCsVTableInfoHeader = [
    { label: "customer_id", key: "customerId" },
    { label: "name_of_client", key: "name" },
    { label: "PPPoE_Name", key: "pppoeName" },
    { label: "address_of_client", key: "customerAddress" },
    { label: "activation_date", key: "createdAt" },
    { label: "client_mikrotik", key: "mikrotik" },
    { label: "bandwidth_allocation MB", key: "package" },
    { label: "password", key: "password" },
    { label: "client_phone", key: "mobile" },
    { label: "status", key: "status" },
    { label: "payment Status", key: "paymentStatus" },
    { label: "subArea", key: "subArea" },
    { label: "area", key: "area" },
    { label: "email", key: "email" },
    { label: "balance", key: "balance" },
    { label: "billing_cycle", key: "billingCycle" },
    { label: "user_type", key: "userType" },
    { label: "selling_bandwidthBDT (Excluding VAT).", key: "monthlyFee" },
  ];

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
                  <div className="component_name">{t("customer")}</div>

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
                      {customerLoading ? (
                        <Loader />
                      ) : (
                        <ArrowClockwise
                          className="arrowClock"
                          title={t("refresh")}
                          onClick={reloadHandler}
                        />
                      )}
                    </div>

                    <div>
                      {(permissions?.customerAdd || role === "ispOwner") && (
                        <div className="addAndSettingIcon">
                          <PersonPlusFill
                            className="addcutmButton"
                            onClick={() => {
                              setModalStatus("customerPost");
                              setShowModal(true);
                            }}
                            title={t("newCustomer")}
                          />
                        </div>
                      )}
                    </div>

                    <Collapse in={open} dimension="width">
                      <div id="example-collapse-text">
                        <Card className="cardCollapse border-0">
                          <div className="d-flex align-items-center">
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
                                    onClick={printModalController}
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
                {(permissions?.viewCustomerList || role !== "collector") && (
                  <div className="mt-2">
                    <Accordion alwaysOpen activeKey={activeKeys}>
                      <Accordion.Item eventKey="filter">
                        <Accordion.Body>
                          <DataFilter
                            page="pppoe"
                            customers={customers}
                            setCustomers={setPPPoeCustomers}
                            filterOptions={filterOptions}
                            setFilterOption={setFilterOption}
                          />
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                    <div className="collectorWrapper pb-2">
                      <Table
                        customComponent={customComponent}
                        bulkLength={bulkCustomers?.length}
                        isLoading={customerLoading}
                        columns={columns}
                        data={tableData}
                        bulkState={{
                          setBulkCustomer,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* bulletin modal */}
                {(bulletinPagePermission?.customer ||
                  bulletinPagePermission?.allPage) && <NetFeeBulletin />}
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>

      {/* all modal */}

      {/* customer details modal  */}
      {modalStatus === "profile" && (
        <CustomerDetails
          show={showModal}
          setShow={setShowModal}
          customerId={customerId}
        />
      )}

      {/* customer create modal  */}
      {modalStatus === "customerPost" && (
        <CustomerPost show={showModal} setShow={setShowModal} />
      )}

      {/* customer edit modal  */}
      {modalStatus === "customerEdit" && (
        <EditPPPoECustomer
          show={showModal}
          setShow={setShowModal}
          single={customerId}
        />
      )}

      {/* bill collection modal  */}
      {modalStatus === "customerRecharge" && (
        <RechargeCustomer
          show={showModal}
          setShow={setShowModal}
          single={customerId}
          customerData={customerData}
        />
      )}

      {/* customer report modal  */}
      {modalStatus === "report" && (
        <CustomerReport
          show={showModal}
          setShow={setShowModal}
          single={customerData}
        />
      )}

      {/* customer note modal */}
      {modalStatus === "note" && (
        <CustomerNote
          show={showModal}
          setShow={setShowModal}
          customerId={customerNoteId}
          customerName={customerName}
        />
      )}

      {/* customer delete modal  */}
      {modalStatus === "delete" && (
        <CustomerDelete
          show={showModal}
          setShow={setShowModal}
          single={customerId}
          mikrotikCheck={checkMikrotik}
          setMikrotikCheck={setMikrotikCheck}
          status="pppoe"
        />
      )}

      {/* single message send modal  */}
      {modalStatus === "message" && (
        <SingleMessage
          show={showModal}
          setShow={setShowModal}
          single={customerId}
          sendCustomer="customer"
        />
      )}

      {/* transferReseller modal */}
      {modalStatus === "resellerTransfer" && (
        <TransferToReseller
          show={showModal}
          setShow={setShowModal}
          customerId={customerId}
          page="pppoe"
        />
      )}

      {/* customer support ticket modal */}
      {modalStatus === "supportTicket" && (
        <CreateSupportTicket
          show={showModal}
          setShow={setShowModal}
          collectors={collectors}
          manager={manager}
          customer={singleCustomer}
          ispOwner={ispOwnerId}
        />
      )}

      {/* password reset modal */}
      {modalStatus === "passwordReset" && (
        <PasswordReset
          show={showModal}
          setShow={setShowModal}
          userId={userId}
        />
      )}

      {/* create temp invoice */}
      {modalStatus === "invoice" && (
        <CreateInvoice
          show={showModal}
          setShow={setShowModal}
          single={customerId}
          customerData={customerData}
        />
      )}

      {/* <BandwidthModal
        setModalShow={setBandWidthModal}
        modalShow={bandWidthModal}
        customerId={customerId}
      /> */}

      {/* customers number update or delete modal */}
      <CustomersNumber showModal={numberModalShow} />

      {/* bulk options modal  */}
      <BulkOptions bulkCustomers={bulkCustomers} page="pppoe" />

      {/* print option modal */}
      <PrintOptions
        show={modalShow}
        setShow={setModalShow}
        filterData={filterData}
        tableData={tableData}
        page={"customer"}
        printData={printData}
      />
    </>
  );
};

export default React.memo(PPPOECustomer);
