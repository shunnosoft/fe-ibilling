import React, { useEffect, useMemo, useState } from "react";
import {
  ArchiveFill,
  ArrowClockwise,
  ArrowRightSquareFill,
  CardChecklist,
  CashStack,
  ChatText,
  CurrencyDollar,
  FileExcelFill,
  FiletypeCsv,
  FilterCircle,
  GearFill,
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
} from "react-bootstrap-icons";
import { CSVLink } from "react-csv";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import DatePicker from "react-datepicker";
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
import BulkSubAreaEdit from "./customerCRUD/bulkOpration/bulkSubAreaEdit";
import BulkBillingCycleEdit from "./customerCRUD/bulkOpration/bulkBillingCycleEdit";
import BulkStatusEdit from "./customerCRUD/bulkOpration/bulkStatusEdit";
import BulkPackageEdit from "./customerCRUD/bulkOpration/bulkPackageEdit";
import BulkCustomerDelete from "./customerCRUD/bulkOpration/BulkdeleteModal";
import BulkAutoConnectionEdit from "./customerCRUD/bulkOpration/bulkAutoConnectionEdit";
import BulkCustomerTransfer from "./customerCRUD/bulkOpration/bulkCustomerTransfer";
import CustomerDelete from "./customerCRUD/CustomerDelete";
import { printOptionData } from "./customerCRUD/printOptionData";
import FormatNumber from "../../components/common/NumberFormat";
import BulkPromiseDateEdit from "./customerCRUD/bulkOpration/BulkPromiseDateEdit";
import Footer from "../../components/admin/footer/Footer";
import BandwidthModal from "./BandwidthModal";
import BulkBalanceEdit from "./customerCRUD/bulkOpration/BulkBalanceEdit";
import CustomerNote from "./customerCRUD/CustomerNote";
import PasswordReset from "../../components/modals/passwordReset/PasswordReset";
import CreateSupportTicket from "../../components/modals/CreateSupportTicket";
import BulkMikrotikEdit from "./customerCRUD/bulkOpration/bulkMikrotikEdit";
import BulkRecharge from "./customerCRUD/bulkOpration/BulkRecharge";
import CustomersNumber from "./CustomersNumber";
import "./client.css";
import BulkPaymentStatusEdit from "./customerCRUD/bulkOpration/BulkPaymentStatusEdit";
import CreateInvoice from "./customerCRUD/CreateInvoice";
import NetFeeBulletin from "../../components/bulletin/NetFeeBulletin";
import { getBulletinPermission } from "../../features/apiCallAdmin";
import BulkCustomerMessage from "./customerCRUD/bulkOpration/BulkCustomerMessage";
import EditPPPoECustomer from "./customerCRUD/temp/EditPPPoECustomer";
import RechargeCustomer from "./customerCRUD/temp/RechargeCustomer";
import PrintOptions from "../../components/common/PrintOptions";
import {
  getCustomerDayLeft,
  getCustomerPromiseDate,
} from "./customerCRUD/customerBillDayPromiseDate";
import useISPowner from "../../hooks/useISPOwner";
import { getOwnerUsers } from "../../features/getIspOwnerUsersApi";

const PPPOECustomer = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // get user & current user data form useISPOwner
  const { role, ispOwnerId, bpSettings, permissions } = useISPowner();

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

  //get collector areas
  const collectorSubAreas = useSelector((state) =>
    role === "collector"
      ? state.persistedReducer.auth?.currentUser?.collector?.areas
      : []
  );

  //without mikrotik packages
  const withOutMikrotikPackages = useSelector(
    (state) => state.package.packages
  );

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

  // state for select print option print
  const [printOption, setPrintOptions] = useState([]);

  // print modal state
  const [modalShow, setModalShow] = useState(false);

  //bandwidth modal state
  const [bandWidthModal, setBandWidthModal] = useState(false);

  // Single area state
  const [areaId, setAreaId] = useState("");

  // single subArea state
  const [subAreaId, setSubAreaId] = useState("");

  // mikrotik package state
  const [mikrotikPackages, setMikrotikPackages] = useState([]);

  //collector area
  const [collectorAreas, setCollectorAreas] = useState([]);

  // collector loading
  const [collectorLoading, setCollectorLoading] = useState(false);

  // get specific customer
  const [singleCustomer, setSingleCustomer] = useState("");

  //filter state
  const [filterOptions, setFilterOption] = useState({
    status: "",
    paymentStatus: "",
    partialPayment: "",
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

  // customers number update or delete modal show state
  const [numberModalShow, setNumberModalShow] = useState(false);

  //bulk menu show and hide
  const [isMenuOpen, setMenuOpen] = useState(false);

  const [open, setOpen] = useState(false);

  // pole box filter loding
  const [isLoadingPole, setIsLoadingPole] = useState(false);

  // optional modal state
  const [modalStatus, setModalStatus] = useState("");
  const [showModal, setShowModal] = useState(false);

  // bulk modal handle state
  const [bulkStatus, setBulkStatus] = useState("");
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

    // set initial state for print oprions
    setPrintOptions(printOptionData);

    // get ispOwner all staffs
    getOwnerUsers(dispatch, ispOwnerId);

    // bulletin get api
    Object.keys(bulletinPagePermission)?.length === 0 &&
      getBulletinPermission(dispatch);
  }, []);

  // set all customer in state
  useEffect(() => {
    setPPPoeCustomers(customers);
  }, [customers]);

  //collector area state update
  useEffect(() => {
    if (role === "collector") {
      //loop over areas
      const tempCollectorAreas = areas.filter((item) => {
        return collectorSubAreas.some((subArea) => {
          return item.subAreas.some((s) => s === subArea.id);
        });
      });
      //update the collector area state
      setCollectorAreas(tempCollectorAreas);
    }
  }, [collectorSubAreas, areas, subAreas]);

  //get single customer from user action
  const getSpecificCustomer = (customerId) => {
    setCustomerId(customerId);
  };

  // customer delete controller
  const customerDelete = (customerId) => {
    setMikrotikCheck(false);
    setCustomerId(customerId);
  };

  // mikrotik handler method
  const mikrotikHandler = async (id) => {
    setFilterOption({
      ...filterOptions,
      mikrotik: id,
    });
    if (!id) {
      setMikrotikPackages([]);
    }
    if (id) {
      const mikrotikPackage = packages.filter((pack) => pack.mikrotik === id);
      setMikrotikPackages(mikrotikPackage);
    }
  };

  // reload handler
  const reloadHandler = () => {
    getCustomer(dispatch, ispOwnerId, setCustomerLoading);
  };

  // filter and filter reset
  const handleActiveFilter = () => {
    let tempCustomers = customers.reduce((acc, c) => {
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
        moment(c.billingCycle).format("YYYY-MM-DD")
      ).getTime();

      const promiseDate = new Date(
        moment(c.promiseDate).format("YYYY-MM-DD")
      ).getTime();

      let today = new Date();
      let lastDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      ).getTime();

      const todayDate = new Date(
        moment(new Date()).format("YYYY-MM-DD")
      ).getTime();

      const filterStartData = new Date(
        moment(filterOptions.startDate).format("YYYY-MM-DD")
      ).getTime();

      const filterEndData = new Date(
        moment(filterOptions.endDate).format("YYYY-MM-DD")
      ).getTime();

      // get all subarea
      var getArea = [];
      var allSub = [];
      if (area) {
        allSub = subAreas.filter((val) => val.area === area);
        getArea = areas.find((item) => item.id === area);
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
        area: area ? allSub.some((item) => item.id === c.subArea) : true,
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
        overDue: paymentStatus
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
    setPPPoeCustomers(tempCustomers);
  };

  // filter reset controller
  const handleFilterReset = () => {
    setMikrotikPackages([]);
    setFilterOption({
      status: "",
      paymentStatus: "",
      partialPayment: "",
      area: "",
      subArea: "",
      mikrotik: "",
      package: "",
      isFree: "",
      startDate: "",
      endDate: "",
      poleBox: "",
    });
    setPPPoeCustomers(customers);
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
  const getCustomerSubArea = (subId) => {
    const findSubArea = subAreas.find((val) => val.id === subId);
    return findSubArea;
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
            <p>{original.pppoe?.name}</p>
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
                        <CurrencyDollar />
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
                  data-bs-toggle="modal"
                  data-bs-target="#showCustomerReport"
                  onClick={() => {
                    setCustomerData(original);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <CashStack />
                      <p className="actionP">{t("report")}</p>
                    </div>
                  </div>
                </li>
                <li
                  data-bs-toggle="modal"
                  data-bs-target="#customerNote"
                  onClick={() => {
                    setCustomerNoteId(original.id);
                    setCustomerName(original?.name);
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
                    data-bs-toggle="modal"
                    data-bs-target="#customerDelete"
                    onClick={() => {
                      customerDelete(original.id);
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
                    data-bs-toggle="modal"
                    data-bs-target="#customerMessageModal"
                    onClick={() => {
                      getSpecificCustomer(original.id);
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
                      data-bs-toggle="modal"
                      data-bs-target="#transferToReseller"
                      onClick={() => {
                        getSpecificCustomer(original.id);
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
                  data-bs-toggle="modal"
                  data-bs-target="#createSupportTicket"
                  onClick={() => setSingleCustomer(original)}
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
                {(role === "ispOwner" && bpSettings?.customerInvoice) ||
                (role === "manager" && permissions?.customerInvoice) ? (
                  <li
                    data-bs-toggle="modal"
                    data-bs-target="#createInvoiceModal"
                    onClick={() => {
                      getSpecificCustomer(original.id);
                      setCustomerData(original);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <CurrencyDollar />
                        <p className="actionP">{t("invoice")}</p>
                      </div>
                    </div>
                  </li>
                ) : (
                  ""
                )}
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
          connectivity: "Dedicated",
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
          package: customer?.pppoe?.profile,
          password: customer?.pppoe?.password,
          mobile: customer?.mobile || "",
          status: customer.status,
          paymentStatus: customer.paymentStatus,
          subArea: getCustomerSubArea(customer?.subArea)?.name,
          email: customer.email || "",
          monthlyFee: customer.monthlyFee,
          balance: customer.balance,
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
    { label: "bandwidth_allocation MB", key: "package" },
    { label: "password", key: "password" },
    { label: "client_phone", key: "mobile" },
    { label: "status", key: "status" },
    { label: "payment Status", key: "paymentStatus" },
    { label: "subArea", key: "subArea" },
    { label: "email", key: "email" },
    { label: "balance", key: "balance" },
    { label: "billing_cycle", key: "billingCycle" },
    { label: "selling_bandwidthBDT (Excluding VAT).", key: "monthlyFee" },
  ];

  // filter value for pdf
  let filterData = {};
  if (modalShow) {
    let area, subArea, customerStatus, customerPaymentStatus;

    // area
    if (filterOptions.area) {
      area = areas.find((item) => item.id === filterOptions.area);
    }

    // subarea
    if (filterOptions.subArea) {
      subArea = subAreas.find((item) => item.id === filterOptions.subArea);
    }

    // status
    if (filterOptions.status) {
      if (filterOptions.status === "active") {
        customerStatus = t("active");
      } else if (filterOptions.status === "inactive") {
        customerStatus = t("in active");
      }
    }

    // payment status
    if (filterOptions.paymentStatus) {
      if (filterOptions.paymentStatus === "unpaid") {
        customerPaymentStatus = t("due");
      } else if (filterOptions.paymentStatus === "paid") {
        customerPaymentStatus = t("paid");
      } else if (filterOptions.paymentStatus === "expired") {
        customerPaymentStatus = t("expired");
      }
    }

    // set filter value in pdf
    filterData = {
      area: area?.name ? area?.name : t("allArea"),
      subArea: subArea?.name ? subArea.name : t("allSubArea"),
      status: customerStatus ? customerStatus : t("sokolCustomer"),
      payment: customerPaymentStatus
        ? customerPaymentStatus
        : t("sokolCustomer"),
    };
  }

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

  //manual filter options
  const filterInputs = [
    {
      name: "area",
      type: "select",
      id: "area",
      value: filterOptions.area,
      isVisible: true,
      disabled: false,
      onChange: (e) => {
        setAreaId(e.target.value);
        setFilterOption({
          ...filterOptions,
          area: e.target.value,
        });
      },
      options: role === "collector" ? collectorAreas : areas,
      firstOptions: t("allArea"),
      textAccessor: "name",
      valueAccessor: "id",
    },
    {
      name: "subArea",
      type: "select",
      id: "subArea",
      value: filterOptions.subArea,
      isVisible: true,
      disabled: false,
      onChange: (e) => {
        setSubAreaId(e.target.value);
        setFilterOption({
          ...filterOptions,
          subArea: e.target.value,
        });
      },
      options: subAreas.filter((item) => item?.area === areaId),
      firstOptions: t("subArea"),
      textAccessor: "name",
      valueAccessor: "id",
    },
    {
      name: "poleBox",
      type: "select",
      id: "poleBox",
      value: filterOptions.poleBox,
      isVisible: bpSettings?.poleBox,
      disabled: false,
      onChange: (e) => {
        setFilterOption({
          ...filterOptions,
          poleBox: e.target.value,
        });
      },
      options: poleBox.filter((item) => item?.subArea === subAreaId),
      firstOptions: t("poleBox"),
      textAccessor: "name",
      valueAccessor: "id",
    },
    {
      name: "status",
      type: "select",
      id: "status",
      value: filterOptions.status,
      isVisible: true,
      disabled: false,
      onChange: (e) => {
        setFilterOption({
          ...filterOptions,
          status: e.target.value,
        });
      },
      options: [
        {
          text: t("active"),
          value: "active",
        },
        {
          text: t("in active"),
          value: "inactive",
        },
        {
          text: t("expired"),
          value: "expired",
        },
      ],
      firstOptions: t("status"),
      textAccessor: "text",
      valueAccessor: "value",
    },
    {
      name: "paymentStatus",
      type: "select",
      id: "paymentStatus",
      value: filterOptions.paymentStatus,
      isVisible: true,
      disabled: false,
      onChange: (e) => {
        setFilterOption({
          ...filterOptions,
          paymentStatus: e.target.value,
        });
      },
      options: [
        {
          text: t("free"),
          value: "free",
        },
        {
          text: t("paid"),
          value: "paid",
        },
        {
          text: t("unpaid"),
          value: "unpaid",
        },
        {
          text: t("partialPayment"),
          value: "partial",
        },
        {
          text: t("advance"),
          value: "advance",
        },
        {
          text: t("overDue"),
          value: "overDue",
        },
      ],
      firstOptions: t("paymentStatus"),
      textAccessor: "text",
      valueAccessor: "value",
    },
    {
      name: "mikrotik",
      type: "select",
      id: "mikrotik",
      value: filterOptions.mikrotik,
      isVisible: bpSettings?.hasMikrotik,
      disabled: false,
      onChange: (e) => mikrotikHandler(e.target.value),
      options: mikrotiks,
      firstOptions: t("mikrotik"),
      textAccessor: "name",
      valueAccessor: "id",
    },
    {
      name: "package",
      type: "select",
      id: "package",
      value: filterOptions.package,
      isVisible: true,
      disabled: false,
      onChange: (e) => {
        setFilterOption({
          ...filterOptions,
          package: e.target.value,
        });
      },
      options: bpSettings?.hasMikrotik
        ? mikrotikPackages
        : withOutMikrotikPackages,
      firstOptions: t("package"),
      textAccessor: "name",
      valueAccessor: "id",
    },
    {
      name: "freeUser",
      type: "select",
      id: "freeUser",
      value: filterOptions.freeUser,
      isVisible: true,
      disabled: false,
      onChange: (e) =>
        setFilterOption({
          ...filterOptions,
          freeUser: e.target.value,
        }),
      options: [
        { value: "freeUser", text: t("freeCustomer") },
        { value: "nonFreeUser", text: t("nonFreeCustomer") },
        { value: "prepaid", text: t("prepaid") },
        { value: "postpaid", text: t("postPaid") },
      ],
      firstOptions: t("sokolCustomer"),
      textAccessor: "text",
      valueAccessor: "value",
    },
    {
      name: "billDayLeft",
      type: "select",
      id: "billDayLeft",
      value: filterOptions.dayFilter,
      isVisible: true,
      disabled: false,
      onChange: (e) =>
        setFilterOption({
          ...filterOptions,
          dayFilter: e.target.value,
        }),
      options: [
        { value: "1", text: t("oneDayLeft") },
        { value: "2", text: t("twoDayLeft") },
        { value: "3", text: t("threeDayLeft") },
        { value: "4", text: t("fourDayLeft") },
        { value: "7", text: t("sevenDayLeft") },
      ],
      firstOptions: t("filterBillDate"),
      textAccessor: "text",
      valueAccessor: "value",
    },
  ];

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
                          <div className="displayGrid6">
                            {filterInputs.map(
                              (item) =>
                                item.isVisible && (
                                  <select
                                    className="form-select shadow-none mt-0"
                                    onChange={item.onChange}
                                    value={item.value}
                                  >
                                    <option value="">
                                      {item.firstOptions}
                                    </option>
                                    {item.options?.map((opt) => (
                                      <option value={opt[item.valueAccessor]}>
                                        {opt[item.textAccessor]}
                                      </option>
                                    ))}
                                  </select>
                                )
                            )}

                            {/* date picker for filter billing cycle */}
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

                            <div className="displayGrid1 mt-0">
                              <button
                                className="btn btn-outline-primary"
                                type="button"
                                onClick={handleActiveFilter}
                              >
                                {t("filter")}
                              </button>
                              <button
                                className="btn btn-outline-secondary"
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
      <CustomerReport single={customerData} />

      {/* customer note modal */}
      <CustomerNote customerId={customerNoteId} customerName={customerName} />

      {/* customer delete modal  */}
      <CustomerDelete
        single={customerId}
        mikrotikCheck={checkMikrotik}
        setMikrotikCheck={setMikrotikCheck}
        status="customerDelete"
      />
      {/* single message send modal  */}
      <SingleMessage single={customerId} sendCustomer="customer" />

      {/* transferReseller modal */}
      <TransferToReseller customerId={customerId} />

      {/* password reset modal */}
      {modalStatus === "passwordReset" && (
        <PasswordReset
          show={showModal}
          setShow={setShowModal}
          userId={userId}
        />
      )}

      {/* create temp invoice */}
      <CreateInvoice single={customerId} customerData={customerData} />

      <BandwidthModal
        setModalShow={setBandWidthModal}
        modalShow={bandWidthModal}
        customerId={customerId}
      />
      <CreateSupportTicket
        collectors={collectors}
        manager={manager}
        customer={singleCustomer}
        ispOwner={ispOwnerId}
        reseller=""
      />

      {/* customers number update or delete modal */}
      <CustomersNumber showModal={numberModalShow} />

      {/* bulk Modal */}
      {((role === "ispOwner" && bpSettings?.bulkAreaEdit) ||
        permissions?.bulkAreaEdit) &&
        bulkStatus === "customerBulkEdit" && (
          <BulkSubAreaEdit
            bulkCustomer={bulkCustomers}
            show={show}
            setShow={setShow}
          />
        )}

      {bulkStatus === "customerBalanceEdit" && (
        <BulkBalanceEdit
          bulkCustomer={bulkCustomers}
          show={show}
          setShow={setShow}
        />
      )}

      {bulkStatus === "customerBillingCycle" && (
        <BulkBillingCycleEdit
          bulkCustomer={bulkCustomers}
          show={show}
          setShow={setShow}
        />
      )}

      {bulkStatus === "bulkPromiseDateEdit" && (
        <BulkPromiseDateEdit
          bulkCustomer={bulkCustomers}
          show={show}
          setShow={setShow}
        />
      )}

      {bulkStatus === "bulkMessage" && (
        <BulkCustomerMessage
          bulkCustomer={bulkCustomers}
          show={show}
          setShow={setShow}
        />
      )}

      {bulkStatus === "bulkPaymentStatusEdit" && (
        <BulkPaymentStatusEdit
          bulkCustomer={bulkCustomers}
          show={show}
          setShow={setShow}
        />
      )}

      {bulkStatus === "bulkStatusEdit" && (
        <BulkStatusEdit
          bulkCustomer={bulkCustomers}
          show={show}
          setShow={setShow}
        />
      )}

      {bpSettings.hasMikrotik && (
        <>
          {bulkStatus === "bulkMikrotikEdit" && (
            <BulkMikrotikEdit
              bulkCustomer={bulkCustomers}
              show={show}
              setShow={setShow}
            />
          )}

          {bulkStatus === "autoDisableEditModal" && (
            <BulkAutoConnectionEdit
              bulkCustomer={bulkCustomers}
              show={show}
              setShow={setShow}
            />
          )}
        </>
      )}

      {bulkStatus === "bulkDeleteCustomer" && (
        <BulkCustomerDelete
          bulkCustomer={bulkCustomers}
          show={show}
          setShow={setShow}
        />
      )}

      {bulkStatus === "bulkPackageEdit" && (
        <BulkPackageEdit
          bulkCustomer={bulkCustomers}
          show={show}
          setShow={setShow}
        />
      )}

      {bulkStatus === "bulkRecharge" && (
        <BulkRecharge
          bulkCustomer={bulkCustomers}
          show={show}
          setShow={setShow}
        />
      )}

      {bulkStatus === "bulkTransferToReseller" && (
        <BulkCustomerTransfer
          bulkCustomer={bulkCustomers}
          show={show}
          setShow={setShow}
        />
      )}
      {/* bulk modal end */}

      {bulkCustomers.length > 0 && (
        <div className="client_wraper2">
          <div
            className={`settings_wraper2 ${
              isMenuOpen ? "show-menu2" : "hide-menu2"
            }`}
          >
            <ul className="client_service_list2 ps-0">
              {((role === "ispOwner" && bpSettings?.bulkAreaEdit) ||
                (bpSettings?.bulkAreaEdit &&
                  permissions?.bulkAreaEdit &&
                  role !== "collector")) && (
                <li
                  type="button"
                  className="p-1"
                  onClick={() => {
                    setBulkStatus("customerBulkEdit");
                    setShow(true);
                  }}
                >
                  <div className="menu_icon2">
                    <button
                      className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-1 bg-primary"
                      title={t("editArea")}
                    >
                      <i class="fas fa-map-marked-alt fa-xs"></i>
                      <span className="button_title">{t("editArea")}</span>
                    </button>
                  </div>
                  <div className="menu_label2">{t("editArea")}</div>
                </li>
              )}

              <hr className="mt-0 mb-0" />
              {((role === "ispOwner" && bpSettings?.updateCustomerBalance) ||
                (bpSettings?.updateCustomerBalance &&
                  permissions?.updateCustomerBalance &&
                  role === "manager")) && (
                <li
                  type="button"
                  className="p-1"
                  onClick={() => {
                    setBulkStatus("customerBalanceEdit");
                    setShow(true);
                  }}
                >
                  <div className="menu_icon2">
                    <button
                      className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-2 bg-warning"
                      title={t("editBalance")}
                    >
                      <i className="fas fa-dollar fa-xs "></i>
                      <span className="button_title">{t("editBalance")}</span>
                    </button>
                  </div>
                  <div className="menu_label2">{t("editBalance")}</div>
                </li>
              )}

              <hr className="mt-0 mb-0" />
              {((role === "ispOwner" && bpSettings?.bulkStatusEdit) ||
                (bpSettings?.bulkStatusEdit &&
                  permissions?.bulkStatusEdit &&
                  role === "manager") ||
                (role === "collector" &&
                  bpSettings.bulkStatusEdit &&
                  permissions.bulkStatusEdit)) && (
                <li
                  type="button"
                  className="p-1"
                  onClick={() => {
                    setBulkStatus("bulkStatusEdit");
                    setShow(true);
                  }}
                >
                  <div className="menu_icon2">
                    <button
                      className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-1 bg-info"
                      title={t("editStatus")}
                    >
                      <i className="fas fa-edit fa-xs  "></i>
                      <span className="button_title"> {t("editStatus")}</span>
                    </button>
                  </div>
                  <div className="menu_label2">{t("editStatus")}</div>
                </li>
              )}

              <hr className="mt-0 mb-0" />
              {((role === "ispOwner" && bpSettings?.bulkPaymentStatusEdit) ||
                (bpSettings?.bulkPaymentStatusEdit &&
                  permissions?.bulkPaymentStatusEdit &&
                  role === "manager") ||
                (role === "collector" &&
                  bpSettings.bulkPaymentStatusEdit &&
                  permissions.bulkPaymentStatusEdit)) && (
                <li
                  type="button"
                  className="p-1"
                  onClick={() => {
                    setBulkStatus("bulkPaymentStatusEdit");
                    setShow(true);
                  }}
                >
                  <div className="menu_icon2">
                    <button
                      className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-1 bg-info"
                      title={t("editPaymentStatus")}
                    >
                      <i className="fas fa-edit fa-xs  "></i>
                      <span className="button_title">
                        {t("editPaymentStatus")}
                      </span>
                    </button>
                  </div>
                  <div className="menu_label2">{t("editPaymentStatus")}</div>
                </li>
              )}

              <hr className="mt-0 mb-0" />
              {((role === "ispOwner" && bpSettings?.bulkBillingCycleEdit) ||
                (bpSettings?.bulkBillingCycleEdit &&
                  permissions?.bulkBillingCycleEdit &&
                  role === "manager")) && (
                <li
                  type="button"
                  className="p-1"
                  onClick={() => {
                    setBulkStatus("customerBillingCycle");
                    setShow(true);
                  }}
                >
                  <div className="menu_icon2">
                    <button
                      className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-2 bg-secondary"
                      title={t("editBillingCycle")}
                    >
                      <i class="far fa-calendar-alt fa-xs"></i>
                      <span className="button_title">
                        {t("editBillingCycle")}
                      </span>
                    </button>
                  </div>
                  <div className="menu_label2">{t("editBillingCycle")}</div>
                </li>
              )}

              <hr className="mt-0 mb-0" />
              {((role === "ispOwner" && bpSettings?.bulkPromiseDateEdit) ||
                (bpSettings?.bulkPromiseDateEdit &&
                  permissions?.bulkPromiseDateEdit &&
                  role === "manager")) && (
                <li
                  type="button"
                  className="p-1"
                  onClick={() => {
                    setBulkStatus("bulkPromiseDateEdit");
                    setShow(true);
                  }}
                >
                  <div className="menu_icon2">
                    <button
                      className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-1 bg-success"
                      title={t("editPromiseDate")}
                    >
                      <i class="fas fa-calendar-week fa-xs"></i>
                      <span className="button_title">
                        {t("editPromiseDate")}
                      </span>
                    </button>
                  </div>
                  <div className="menu_label2">{t("editPromiseDate")}</div>
                </li>
              )}

              <hr className="mt-0 mb-0" />

              {((role === "ispOwner" && bpSettings?.bulkMessage) ||
                (bpSettings?.bulkMessage &&
                  permissions?.bulkMessage &&
                  role === "manager")) && (
                <li
                  type="button"
                  className="p-1"
                  onClick={() => {
                    setBulkStatus("bulkMessage");
                    setShow(true);
                  }}
                >
                  <div className="menu_icon2">
                    <button
                      className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-1 bg-success"
                      title={t("bulkMessage")}
                    >
                      <i class="fa-regular fa-envelope"></i>

                      <span className="button_title">{t("bulkMessage")}</span>
                    </button>
                  </div>
                  <div className="menu_label2">{t("bulkMessage")}</div>
                </li>
              )}

              <hr className="mt-0 mb-0" />
              {bpSettings?.hasMikrotik &&
                ((role === "ispOwner" && bpSettings?.bulkAutoDisableEdit) ||
                  (bpSettings?.bulkAutoDisableEdit &&
                    permissions?.bulkAutoDisableEdit &&
                    role === "manager")) && (
                  <li
                    type="button"
                    className="p-1"
                    onClick={() => {
                      setBulkStatus("autoDisableEditModal");
                      setShow(true);
                    }}
                  >
                    <div className="menu_icon2">
                      <button
                        className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-1 bg-secondary"
                        title={t("automaticConnectionOff")}
                      >
                        <i class="fas fa-power-off fa-xs"></i>
                        <span className="button_title">
                          {t("automaticConnectionOff")}
                        </span>
                      </button>
                    </div>
                    <div className="menu_label2">
                      {t("automaticConnectionOff")}
                    </div>
                  </li>
                )}

              <hr className="mt-0 mb-0" />
              {bpSettings.hasMikrotik &&
                ((role === "ispOwner" &&
                  bpSettings?.bulkCustomerMikrotikUpdate) ||
                  (bpSettings?.bulkCustomerMikrotikUpdate &&
                    permissions?.bulkCustomerMikrotikUpdate &&
                    role === "manager")) && (
                  <li
                    type="button"
                    className="p-1"
                    onClick={() => {
                      setBulkStatus("bulkMikrotikEdit");
                      setShow(true);
                    }}
                  >
                    <div className="menu_icon2">
                      <button
                        className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-1 bg-danger"
                        title={t("changeMikrotik")}
                      >
                        <i class="fas fa-server fa-xs"></i>
                        <span className="button_title">
                          {t("changeMikrotik")}
                        </span>
                      </button>
                    </div>
                    <div className="menu_label2">{t("changeMikrotik")}</div>
                  </li>
                )}

              <hr className="mt-0 mb-0" />
              {bpSettings.hasMikrotik &&
                ((role === "ispOwner" && bpSettings?.bulkPackageEdit) ||
                  (bpSettings?.bulkPackageEdit &&
                    permissions?.bulkPackageEdit &&
                    role === "manager")) && (
                  <li
                    type="button"
                    className="p-1"
                    onClick={() => {
                      setBulkStatus("bulkPackageEdit");
                      setShow(true);
                    }}
                  >
                    <div className="menu_icon2">
                      <button
                        className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-1 bg-primary"
                        title={t("updatePackage")}
                      >
                        <i class="fas fa-wifi fa-xs"></i>
                        <span className="button_title">
                          {t("updatePackage")}
                        </span>
                      </button>
                    </div>
                    <div className="menu_label2">{t("updatePackage")}</div>
                  </li>
                )}

              <hr className="mt-0 mb-0" />
              {bpSettings.hasMikrotik &&
                ((role === "ispOwner" && bpSettings?.bulkCustomerRecharge) ||
                  (bpSettings?.bulkCustomerRecharge &&
                    permissions?.bulkCustomerRecharge &&
                    role === "manager")) && (
                  <li
                    type="button"
                    className="p-1"
                    onClick={() => {
                      setBulkStatus("bulkRecharge");
                      setShow(true);
                    }}
                  >
                    <div className="menu_icon2">
                      <button
                        className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-2 bg-warning"
                        title={t("bulkRecharge")}
                      >
                        <i className="fas fa-dollar fa-xs "></i>
                        <span className="button_title">
                          {t("bulkRecharge")}
                        </span>
                      </button>
                    </div>
                    <div className="menu_label2">{t("bulkRecharge")}</div>
                  </li>
                )}

              <hr className="mt-0 mb-0" />
              {((role === "ispOwner" && bpSettings?.bulkTransferToReseller) ||
                (bpSettings?.bulkTransferToReseller &&
                  permissions?.bulkTransferToReseller &&
                  role === "manager")) && (
                <li
                  type="button"
                  className="p-1"
                  onClick={() => {
                    setBulkStatus("bulkTransferToReseller");
                    setShow(true);
                  }}
                >
                  <div className="menu_icon2">
                    <button
                      className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-1 bg-info"
                      title={t("transferReseller")}
                    >
                      <i className="fa-solid fa-right-left fa-xs "></i>
                      <span className="button_title">
                        {t("transferReseller")}
                      </span>
                    </button>
                  </div>
                  <div className="menu_label2">{t("transferReseller")}</div>
                </li>
              )}

              <hr className="mt-0 mb-0" />

              {((role === "ispOwner" && bpSettings?.bulkCustomerDelete) ||
                (bpSettings?.bulkCustomerDelete &&
                  permissions?.bulkCustomerDelete &&
                  role === "manager")) && (
                <li
                  type="button"
                  className="p-1"
                  onClick={() => {
                    setBulkStatus("bulkDeleteCustomer");
                    setShow(true);
                  }}
                >
                  <div className="menu_icon2">
                    <button
                      className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-1 bg-danger"
                      title={t("customerDelete")}
                    >
                      <i className="fas fa-trash-alt fa-xs "></i>
                      <span className="button_title">
                        {t("customerDelete")}
                      </span>
                    </button>
                  </div>
                  <div className="menu_label2">{t("customerDelete")}</div>
                </li>
              )}
            </ul>

            <div className="setting_icon_wraper2">
              <div
                onClick={() => setMenuOpen(!isMenuOpen)}
                className="client_setting_icon2"
              >
                <GearFill />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* print option modal */}
      <PrintOptions
        show={modalShow}
        setShow={setModalShow}
        filterData={filterData}
        tableData={tableData}
        page={"customer"}
      />
    </>
  );
};

export default React.memo(PPPOECustomer);
