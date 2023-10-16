import React, { useEffect, useMemo, useState, useRef } from "react";
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
  Check2Circle,
  PencilSquare,
} from "react-bootstrap-icons";
import Table from "../../components/table/Table";

import { CSVLink } from "react-csv";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { badge } from "../../components/common/Utils";
import ReactToPrint from "react-to-print";
import IndeterminateCheckbox from "../../components/table/bulkCheckbox";
import {
  getPoleBoxApi,
  getSubAreasApi,
} from "../../features/actions/customerApiCall";
import {
  fetchMikrotik,
  getArea,
  getCollector,
  getCustomer,
  getManger,
  getPPPoEPackage,
  getPackagewithoutmikrotik,
} from "../../features/apiCalls";
import { ToastContainer } from "react-toastify";
import useDash from "../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import Loader from "../../components/common/Loader";
import CustomerPost from "./customerCRUD/CustomerPost";
import CustomerDetails from "./customerCRUD/CustomerDetails";
import CustomerBillCollect from "./customerCRUD/CustomerBillCollect";
import CustomerEdit from "./customerCRUD/CustomerEdit";
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
import {
  printOptionDataBangla,
  printOptionDataEng,
} from "./customerCRUD/printOptionData";
import DatePicker from "react-datepicker";
import PrintCustomer from "./customerPDF";
import { Accordion, Button, Card, Collapse, Modal } from "react-bootstrap";
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
import WithValue from "../../components/modals/passwordReset/WithValue";
import NetFeeBulletin from "../../components/bulletin/NetFeeBulletin";
import { getBulletinPermission } from "../../features/apiCallAdmin";
import BulkCustomerMessage from "./customerCRUD/bulkOpration/BulkCustomerMessage";

const PPPOECustomer = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const componentRef = useRef();

  // get all customer
  const customers = useSelector((state) => state.customer.customer);

  // get all role
  const role = useSelector((state) => state.persistedReducer.auth.role);

  // get collector
  const collectors = useSelector((state) => state?.collector?.collector);

  // get manager
  const manager = useSelector((state) => state.manager?.manager);

  // get isp owner id
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // get isp owner data
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth.userData
  );

  // get user permission
  const permission = useSelector(
    (state) => state.persistedReducer.auth.userData.permissions
  );

  // get bp settings
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData?.bpSettings
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
      getPackagewithoutmikrotik(ispOwner, dispatch, setLoading);
    } else {
      if (mikrotiks.length === 0) fetchMikrotik(dispatch, ispOwner, setLoading);
    }

    // get area api
    if (areas.length === 0) getArea(dispatch, ispOwner, setLoading);

    // get sub area api
    if (subAreas.length === 0) getSubAreasApi(dispatch, ispOwner);

    // get customer api
    if (customers.length === 0)
      getCustomer(dispatch, ispOwner, setCustomerLoading);

    // get package list api
    if (packages.length === 0)
      getPPPoEPackage(dispatch, ispOwner, setIsLoadingPole);

    if (role !== "collector") {
      if (collectors.length === 0)
        getCollector(dispatch, ispOwner, setCollectorLoading);
      role === "ispOwner" && getManger(dispatch, ispOwner);
    }

    if (poleBox.length === 0)
      getPoleBoxApi(dispatch, ispOwner, setIsLoadingPole);

    // set initial state for print oprions
    const lang = localStorage.getItem("netFee:lang");
    if (lang === "en") {
      setPrintOptions(printOptionDataEng);
      return;
    }

    setPrintOptions(printOptionDataBangla);

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
    getCustomer(dispatch, ispOwner, setCustomerLoading);
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

  //print option controller
  const printOptionsController = ({ target }) => {
    if (target.value === "default" && target.checked) {
      setPrintOptions(
        printOption.map((item) => {
          return { ...item, checked: true };
        })
      );
    } else {
      const updatedState = printOption.map((item) => {
        if (item.value === target.value) {
          item.checked = target.checked;
        }
        return item;
      });
      setPrintOptions(updatedState);
    }
  };

  //print modal controller
  const printModalController = (customerID) => {
    setModalShow(true);
  };

  // atuomatic connection on off doble clicked handle
  // const autoDisableHandle = (event) => {
  //   if (event.detail == 2 && event.target.id) {
  //     const singleCustomer = customers.find(
  //       (val) => val.id === event.target.id
  //     );
  //     console.log(singleCustomer);
  //   }
  // };

  //column for table
  const columns = useMemo(
    () => [
      {
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
        width: "2%",
      },
      {
        width: "6%",
        Header: t("id"),
        accessor: "customerId",
      },
      {
        width: "8%",
        Header: t("Auto/C"),
        accessor: "autoDisable",
        Cell: ({ row: { original } }) => (
          <div>
            {original?.autoDisable ? (
              <Check2Circle className="text-success" />
            ) : (
              <Check2Circle className="text-danger" />
            )}
          </div>
        ),
      },
      {
        width: "8%",
        Header: t("name"),
        accessor: "name",
      },
      {
        width: "8%",
        Header: t("PPPoE"),
        accessor: "pppoe.name",
      },
      {
        width: "8%",
        Header: t("mobile"),
        accessor: "mobile",
      },

      {
        width: "8%",
        Header: t("status"),
        accessor: "status",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "9%",
        Header: t("paymentStatus"),
        accessor: "paymentStatus",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "10%",
        Header: t("package"),
        accessor: "pppoe.profile",
      },
      {
        width: "9%",
        Header: t("monthly"),
        accessor: "monthlyFee",
      },
      {
        width: "9%",
        Header: t("balance"),
        accessor: "balance",
      },
      {
        width: "8%",
        Header: t("bill"),
        accessor: "billingCycle",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("YYYY/MM/DD hh:mm A");
        },
      },

      {
        width: "6%",
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
                  data-bs-toggle="modal"
                  data-bs-target="#showCustomerDetails"
                  onClick={() => {
                    getSpecificCustomer(original.id);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <PersonFill />
                      <p className="actionP">{t("profile")}</p>
                    </div>
                  </div>
                </li>
                {(permission?.billPosting || role === "ispOwner") && (
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

                {(permission?.customerEdit || role === "ispOwner") && (
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

                {(permission?.customerDelete || role === "ispOwner") && (
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

                {permission?.sendSMS || role !== "collector" ? (
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
                (role === "manager" && permission?.customerInvoice) ? (
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
          // ip: "",
          // road: ispOwnerData.address,
          // area: ispOwnerData?.fullAddress?.area || "",
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
    // { label: "allowcated_ip", key: "ip" },
    { label: "division", key: "division" },
    { label: "district", key: "district" },
    { label: "thana", key: "thana" },
    { label: "address", key: "customerAddress" },
    { label: "client_mobile", key: "mobile" },
    { label: "client_email", key: "email" },
    { label: "selling_bandwidthBDT (Excluding VAT).", key: "monthlyFee" },
    // { label: "name_operator", key: "companyName" },
    // { label: "house_no", key: "address" },
    // { label: "area", key: "area" },
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
          createdAt: moment(customer.createdAt).format("MM/DD/YYYY"),
          package: customer?.pppoe?.profile,
          password: customer?.pppoe?.password,
          mobile: customer?.mobile || "",
          status: customer.status,
          paymentStatus: customer.paymentStatus,
          email: customer.email || "",
          monthlyFee: customer.monthlyFee,
          balance: customer.balance,
          billingCycle: moment(customer.billingCycle).format("MMM-DD-YYYY"),
          // ip: "",
          // division: customer.division || "",
          // district: customer.district || "",
          // thana: customer.thana || "",
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
    { label: "email", key: "email" },
    { label: "balance", key: "balance" },
    { label: "billing_cycle", key: "billingCycle" },
    // { label: "allowcated_ip", key: "ip" },
    // { label: "division", key: "division" },
    // { label: "district", key: "district" },
    // { label: "thana", key: "thana" },
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
                      {(permission?.customerAdd || role === "ispOwner") && (
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
                              permission?.customerEdit) ||
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

                            {((permission?.viewCustomerList &&
                              role === "manager") ||
                              role === "ispOwner") && (
                              <>
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
                                </>

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

                    {!open && role !== "collector" && (
                      <ArrowBarLeft
                        className="ms-1"
                        size={34}
                        style={{ cursor: "pointer" }}
                        onClick={() => setOpen(!open)}
                        aria-controls="example-collapse-text"
                        aria-expanded={open}
                      />
                    )}

                    {open && role !== "collector" && (
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
                {(permission?.viewCustomerList || role !== "collector") && (
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

                            <div className="displayGrid2 mt-0 ">
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
                      <div className="table-section">
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
                  </div>
                )}

                {/* print component table  */}
                {modalShow && (
                  <div style={{ display: "none" }}>
                    <PrintCustomer
                      filterData={filterData}
                      currentCustomers={tableData}
                      ref={componentRef}
                      printOptions={printOption}
                    />
                  </div>
                )}

                {(bulletinPagePermission?.customer ||
                  bulletinPagePermission?.allPage) && <NetFeeBulletin />}
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>

      {/* all modal */}

      {/* customer create modal  */}
      {modalStatus === "customerPost" && (
        <CustomerPost show={showModal} setShow={setShowModal} />
      )}

      {/* customer edit modal  */}
      {modalStatus === "customerEdit" && (
        <CustomerEdit
          show={showModal}
          setShow={setShowModal}
          single={customerId}
        />
      )}

      {/* bill collection modal  */}
      {modalStatus === "customerRecharge" && (
        <CustomerBillCollect
          show={showModal}
          setShow={setShowModal}
          single={customerId}
          customerData={customerData}
        />
      )}

      {/* customer details modal  */}
      <CustomerDetails single={customerId} />

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

      {/* <PasswordReset resetCustomerId={userId} /> */}
      {/* <WithValue resetCustomerId={userId} /> */}

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
        ispOwner={ispOwner}
        reseller=""
      />

      {/* customers number update or delete modal */}
      <CustomersNumber showModal={numberModalShow} />

      {/* bulk Modal */}
      {((role === "ispOwner" && bpSettings?.bulkAreaEdit) ||
        permission?.bulkAreaEdit) &&
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
                  permission?.bulkAreaEdit &&
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
                  permission?.updateCustomerBalance &&
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
                  permission?.bulkStatusEdit &&
                  role === "manager") ||
                (role === "collector" &&
                  bpSettings.bulkStatusEdit &&
                  permission.bulkStatusEdit)) && (
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
                  permission?.bulkPaymentStatusEdit &&
                  role === "manager") ||
                (role === "collector" &&
                  bpSettings.bulkPaymentStatusEdit &&
                  permission.bulkPaymentStatusEdit)) && (
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
                  permission?.bulkBillingCycleEdit &&
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
                  permission?.bulkPromiseDateEdit &&
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
                  permission?.bulkMessage &&
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
                    permission?.bulkAutoDisableEdit &&
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
                    permission?.bulkCustomerMikrotikUpdate &&
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
                    permission?.bulkPackageEdit &&
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
                    permission?.bulkCustomerRecharge &&
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
                  permission?.bulkTransferToReseller &&
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
                  permission?.bulkCustomerDelete &&
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
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        aria-labelledby="customerBandWidth"
      >
        <Modal.Header closeButton>
          <Modal.Title id="customerBandWidth"></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container d-flex align-items-center justify-content-between">
            <div className="select-options">
              {printOption.map((item) => (
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={item.id}
                    value={item.value}
                    checked={item.checked}
                    onChange={printOptionsController}
                  />
                  <label htmlFor={item.id} className="form-check-label">
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
            <div className="default-option">
              <div className="form-check d-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="default-print-option"
                  value="default"
                  onChange={printOptionsController}
                  checked={printOption.every((item) => item.checked)}
                />
                <label
                  htmlFor="default-print-option"
                  className="form-check-label"
                >
                  Set Default
                </label>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setModalShow(false)}>Close</Button>
          <ReactToPrint
            documentTitle="গ্রাহক লিস্ট"
            trigger={() => (
              <Button onClick={() => setModalShow(false)} variant="primary">
                Print
              </Button>
            )}
            content={() => componentRef.current}
          />
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default React.memo(PPPOECustomer);
