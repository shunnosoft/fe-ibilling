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
  KeyFill,
  Newspaper,
  PenFill,
  PersonFill,
  PersonPlusFill,
  PrinterFill,
  Server,
  ThreeDots,
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
import { getSubAreasApi } from "../../features/actions/customerApiCall";
import {
  fetchMikrotik,
  getArea,
  getCollector,
  getCustomer,
  getManger,
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
import apiLink from "../../api/apiLink";
import DatePicker from "react-datepicker";
import PrintCustomer from "./customerPDF";
import { Button, Modal } from "react-bootstrap";
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

  //component states
  const [loading, setLoading] = useState(false);

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

  // sub area state
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
    package: "",
    mikrotik: "",
    freeUser: "",
    filterDate: null,
    dayFilter: "",
  });

  // customers number update or delete modal show state
  const [numberModalShow, setNumberModalShow] = useState(false);

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

    if (role !== "collector") {
      if (collectors.length === 0)
        getCollector(dispatch, ispOwner, setCollectorLoading);
      getManger(dispatch, ispOwner);
    }

    // set initial state for print oprions
    const lang = localStorage.getItem("netFee:lang");
    if (lang === "en") {
      setPrintOptions(printOptionDataEng);
      return;
    }

    setPrintOptions(printOptionDataBangla);
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
          return item.subAreas.some((s) => s.id === subArea.id);
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
      try {
        const res = await apiLink.get(`/mikrotik/ppp/package/${id}`);
        setMikrotikPackages(res.data);
      } catch (error) {
        console.log(error);
      }
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
        status,
        mikrotik,
        paymentStatus,
        freeUser,
        filterDate,
        dayFilter,
      } = filterOptions;

      const billingCycle = new Date(
        moment(c.billingCycle).format("YYYY-MM-DD")
      ).getTime();

      const filterDateData = new Date(
        moment(filterOptions.filterDate).format("YYYY-MM-DD")
      ).getTime();

      let getArea = [];
      if (area) {
        getArea = areas.find((item) => item.id === area);
      }

      // make possible conditions objects if the filter value not selected thats return true
      //if filter value exist then compare
      const conditions = {
        area: area
          ? getArea.subAreas.some((item) => item.id === c.subArea)
          : true,
        subArea: subArea ? c.subArea === subArea : true,
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
        filterDate: filterDate ? billingCycle == filterDateData : true,
        dayFilter: dayFilter
          ? moment(c.billingCycle).diff(moment(), "days") ===
            Number(filterOptions.dayFilter)
          : true,
      };

      //check if condition pass got for next step or is fail stop operation
      //if specific filter option value not exist it will return true

      let isPass = false;
      isPass = conditions["area"];
      if (!isPass) return acc;
      isPass = conditions["subArea"];
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
      package: "",
      isFree: "",
      filterDate: null,
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
    <div className="text-center" style={{ fontSize: "18px", display: "flex" }}>
      {t("monthlyFee")}&nbsp; {FormatNumber(dueMonthlyFee.totalMonthlyFee)}
      &nbsp;
      {t("tk")} &nbsp;&nbsp; {t("due")}&nbsp;
      {FormatNumber(dueMonthlyFee.totalSumDue)} &nbsp;{t("tk")} &nbsp;
      {/* {t("collection")}&nbsp;{" "} */}
      {/* {FormatNumber(Number(sumMonthlyFee()) - Number(dueMonthlyFee()))} &nbsp;
      {t("tk")} */}
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
        width: "8%",
        Header: t("id"),
        accessor: "customerId",
      },
      {
        width: "9%",
        Header: t("name"),
        accessor: "name",
      },
      {
        width: "9%",
        Header: t("PPPoE"),
        accessor: "pppoe.name",
      },
      {
        width: "12%",
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
        width: "9%",
        Header: t("package"),
        accessor: "pppoe.profile",
      },
      {
        width: "8%",
        Header: t("mountly"),
        accessor: "monthlyFee",
      },
      {
        width: "9%",
        Header: t("balance"),
        accessor: "balance",
      },
      {
        width: "11%",
        Header: t("bill"),
        accessor: "billingCycle",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm A");
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
                    data-bs-toggle="modal"
                    data-bs-target="#collectCustomerBillModal"
                    onClick={() => {
                      getSpecificCustomer(original.id);
                      setCustomerData(original);
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
                    data-bs-toggle="modal"
                    data-bs-target="#customerEditModal"
                    onClick={() => {
                      getSpecificCustomer(original.id);
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

                {original.mobile &&
                  (permission?.sendSMS || role !== "collector" ? (
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
                  ))}
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
                {(role === "ispOwner" || role === "manager") &&
                  ispOwnerData.bpSettings?.hasMikrotik && (
                    <li onClick={() => bandwidthModalController(original.id)}>
                      <div className="dropdown-item">
                        <div className="customerAction">
                          <Server />
                          <p className="actionP">{t("bandwidth")}</p>
                        </div>
                      </div>
                    </li>
                  )}

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
                    data-bs-toggle="modal"
                    data-bs-target="#resetPassword"
                    onClick={() => {
                      setUserId(original.user);
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
          ip: "",
          road: ispOwnerData.address,
          address: ispOwnerData.address,
          area: ispOwnerData?.fullAddress?.area || "",
          district: ispOwnerData?.fullAddress?.district || "",
          thana: ispOwnerData?.fullAddress?.thana || "",
          mobile: customer?.mobile?.slice(1) || "",
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
    { label: "allowcated_ip", key: "ip" },
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
    { label: "monthly_fee", key: "monthlyFee" },
    { label: "balance", key: "balance" },
    { label: "billing_cycle", key: "billingCycle" },
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
        setFilterOption({
          ...filterOptions,
          subArea: e.target.value,
        });
      },
      options: subAreas.filter((item) => item.area?.id === areaId),
      firstOptions: t("subArea"),
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
                <div className="collectorTitle d-flex justify-content-between px-5">
                  <div className="d-flex">
                    <h2>{t("customer")}</h2>
                    <div className="reloadBtn">
                      {customerLoading ? (
                        <Loader />
                      ) : (
                        <ArrowClockwise onClick={reloadHandler} />
                      )}
                    </div>
                  </div>
                  {/* customer page header area  */}

                  <div className="d-flex align-items-center justify-content-center">
                    <div
                      className="addAndSettingIcon"
                      title={t("customerNumberUpdateOrDelete")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        className="bi bi-pencil-square addcutmButton"
                        viewBox="0 0 16 16"
                        onClick={() =>
                          setNumberModalShow({
                            ...numberModalShow,
                            [false]: true,
                          })
                        }
                      >
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                        <path
                          fill-rule="evenodd"
                          d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                        />
                      </svg>
                    </div>

                    {((permission?.viewCustomerList && role === "manager") ||
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
                              <FileExcelFill className="addcutmButton" />
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

                    {(permission?.customerAdd || role === "ispOwner") && (
                      <div className="addAndSettingIcon">
                        <PersonPlusFill
                          className="addcutmButton"
                          data-bs-toggle="modal"
                          data-bs-target="#customerModal"
                          title={t("newCustomer")}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </FourGround>
              <FourGround>
                {(permission?.viewCustomerList || role !== "collector") && (
                  <div className="collectorWrapper mt-2 py-2">
                    <div className="addCollector">
                      <div className="displexFlexSys">
                        <div
                          id="custom-form-select"
                          className="d-flex flex-wrap"
                          style={{ columnGap: "5px" }}
                        >
                          {filterInputs.map(
                            (item) =>
                              item.isVisible && (
                                <select
                                  className="form-select shadow-none"
                                  onChange={item.onChange}
                                  value={item.value}
                                >
                                  <option value="">{item.firstOptions}</option>
                                  {item.options?.map((opt) => (
                                    <option value={opt[item.valueAccessor]}>
                                      {opt[item.textAccessor]}
                                    </option>
                                  ))}
                                </select>
                              )
                          )}

                          {/* date picker for filter billing cycle */}
                          <div className="mt-3" style={{ width: "200px" }}>
                            <DatePicker
                              className="form-control"
                              selected={filterOptions.filterDate}
                              onChange={(date) =>
                                setFilterOption({
                                  ...filterOptions,
                                  filterDate: date,
                                })
                              }
                              dateFormat="dd/MM/yyyy"
                              placeholderText={t("selectDate")}
                            />
                          </div>
                          <div>
                            <button
                              className="btn btn-outline-primary mt-3 w-6rem ms-2"
                              type="button"
                              onClick={handleActiveFilter}
                              id="filterBtn"
                            >
                              {t("filter")}
                            </button>
                            <button
                              className="btn btn-outline-secondary ms-1 w-6rem mt-3"
                              type="button"
                              onClick={handleFilterReset}
                            >
                              {t("reset")}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="table-section">
                        <Table
                          customComponent={customComponent}
                          isLoading={customerLoading}
                          columns={columns}
                          data={tableData}
                          bulkState={{
                            setBulkCustomer,
                          }}
                        ></Table>
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
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
      {/* all modal */}
      {/* customer create modal  */}
      <CustomerPost />
      {/* customer edit modal  */}
      <CustomerEdit single={customerId} />
      {/* bill collection modal  */}
      <CustomerBillCollect single={customerId} customerData={customerData} />
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
      <PasswordReset resetCustomerId={userId} />
      {/* bulk Modal */}
      {((role === "ispOwner" && bpSettings?.bulkAreaEdit) ||
        permission?.bulkAreaEdit) && (
        <BulkSubAreaEdit
          bulkCustomer={bulkCustomers}
          modalId="customerBulkEdit"
        />
      )}
      <BulkBalanceEdit
        bulkCustomer={bulkCustomers}
        modalId="customerBalanceEdit"
      />
      <BulkBillingCycleEdit
        bulkCustomer={bulkCustomers}
        modalId="customerBillingCycle"
      />
      <BulkPromiseDateEdit
        bulkCustomer={bulkCustomers}
        modalId="bulkPromiseDateEdit"
      />
      {bpSettings.hasMikrotik && (
        <>
          <BulkStatusEdit
            bulkCustomer={bulkCustomers}
            modalId="bulkStatusEdit"
          />
          <BulkMikrotikEdit
            bulkCustomer={bulkCustomers}
            modalId="bulkMikrotikEdit"
          />
        </>
      )}
      <BulkCustomerDelete
        bulkCustomer={bulkCustomers}
        modalId="bulkDeleteCustomer"
      />
      <BulkAutoConnectionEdit
        bulkCustomer={bulkCustomers}
        modalId="autoDisableEditModal"
      />
      <BulkPackageEdit bulkCustomer={bulkCustomers} modalId="bulkPackageEdit" />
      <BulkRecharge bulkCustomer={bulkCustomers} modalId="bulkRecharge" />
      <BulkCustomerTransfer
        bulkCustomer={bulkCustomers}
        modalId="bulkTransferToReseller"
      />
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

      {bulkCustomers.length > 0 && (
        <div className="bulkActionButton">
          {((role === "ispOwner" && bpSettings?.bulkAreaEdit) ||
            (bpSettings?.bulkAreaEdit &&
              permission?.bulkAreaEdit &&
              role !== "collector")) && (
            <button
              className="bulk_action_button btn btn-primary btn-floating btn-sm"
              title={t("editArea")}
              data-bs-toggle="modal"
              data-bs-target="#customerBulkEdit"
              type="button"
            >
              <i className="fas fa-edit"></i>
              <span className="button_title">{t("editArea")}</span>
            </button>
          )}

          {((role === "ispOwner" && bpSettings?.updateCustomerBalance) ||
            (bpSettings?.updateCustomerBalance &&
              permission?.updateCustomerBalance &&
              role === "manager")) && (
            <button
              className="bulk_action_button btn btn-info btn-floating btn-sm"
              title={t("editBalance")}
              data-bs-toggle="modal"
              data-bs-target="#customerBalanceEdit"
              type="button"
            >
              <i className="fas fa-dollar"></i>
              <span className="button_title">{t("editBalance")}</span>
            </button>
          )}

          {((role === "ispOwner" && bpSettings?.bulkStatusEdit) ||
            (bpSettings?.bulkStatusEdit &&
              permission?.bulkStatusEdit &&
              role === "manager") ||
            (role === "collector" &&
              bpSettings.bulkStatusEdit &&
              permission.bulkStatusEdit)) && (
            <button
              className="bulk_action_button btn btn-dark btn-floating btn-sm"
              title={t("editStatus")}
              data-bs-toggle="modal"
              data-bs-target="#bulkStatusEdit"
              type="button"
            >
              <i className="fas fa-edit"></i>
              <span className="button_title"> {t("editStatus")}</span>
            </button>
          )}

          {((role === "ispOwner" && bpSettings?.bulkBillingCycleEdit) ||
            (bpSettings?.bulkBillingCycleEdit &&
              permission?.bulkBillingCycleEdit &&
              role === "manager")) && (
            <button
              className="bulk_action_button btn btn-warning btn-floating btn-sm"
              title={t("editBillingCycle")}
              data-bs-toggle="modal"
              data-bs-target="#customerBillingCycle"
              type="button"
            >
              <i className="fas fa-edit"></i>
              <span className="button_title"> {t("editBillingCycle")} </span>
            </button>
          )}

          {((role === "ispOwner" && bpSettings?.bulkPromiseDateEdit) ||
            (bpSettings?.bulkPromiseDateEdit &&
              permission?.bulkPromiseDateEdit &&
              role === "manager")) && (
            <button
              className="bulk_action_button btn btn-secondary btn-floating btn-sm"
              title={t("editPromiseDate")}
              data-bs-toggle="modal"
              data-bs-target="#bulkPromiseDateEdit"
              type="button"
            >
              <i className="fas fa-edit"></i>
              <span className="button_title"> {t("editPromiseDate")} </span>
            </button>
          )}

          {((role === "ispOwner" && bpSettings?.bulkAutoDisableEdit) ||
            (bpSettings?.bulkAutoDisableEdit &&
              permission?.bulkAutoDisableEdit &&
              role === "manager")) && (
            <button
              className="bulk_action_button btn btn-primary btn-floating btn-sm"
              title={t("autoConnectOnOff")}
              data-bs-toggle="modal"
              data-bs-target="#autoDisableEditModal"
              type="button"
            >
              <i className="fas fa-edit"></i>
              <span className="button_title">
                {t("automaticConnectionOff")}
              </span>
            </button>
          )}

          {bpSettings.hasMikrotik &&
            ((role === "ispOwner" && bpSettings?.bulkCustomerMikrotikUpdate) ||
              (bpSettings?.bulkCustomerMikrotikUpdate &&
                permission?.bulkCustomerMikrotikUpdate &&
                role === "manager")) && (
              <button
                className="bulk_action_button btn btn-dark btn-floating btn-sm"
                title={t("package")}
                data-bs-toggle="modal"
                data-bs-target="#bulkMikrotikEdit"
                type="button"
              >
                <i className="fas fa-edit"></i>
                <span className="button_title">{t("changeMikrotik")}</span>
              </button>
            )}
          {bpSettings.hasMikrotik &&
            ((role === "ispOwner" && bpSettings?.bulkPackageEdit) ||
              (bpSettings?.bulkPackageEdit &&
                permission?.bulkPackageEdit &&
                role === "manager")) && (
              <button
                className="bulk_action_button btn btn-warning btn-floating btn-sm"
                title={t("package")}
                data-bs-toggle="modal"
                data-bs-target="#bulkPackageEdit"
                type="button"
              >
                <i className="fas fa-edit"></i>
                <span className="button_title">{t("updatePackage")}</span>
              </button>
            )}

          {bpSettings.hasMikrotik &&
            ((role === "ispOwner" && bpSettings?.bulkCustomerRecharge) ||
              (bpSettings?.bulkCustomerRecharge &&
                permission?.bulkCustomerRecharge &&
                role === "manager")) && (
              <button
                className="bulk_action_button btn btn-warning btn-floating btn-sm"
                title={t("package")}
                data-bs-toggle="modal"
                data-bs-target="#bulkRecharge"
                type="button"
              >
                <i className="fas fa-dollar"></i>
                <span className="button_title">{t("bulkRecharge")}</span>
              </button>
            )}

          {((role === "ispOwner" && bpSettings?.bulkTransferToReseller) ||
            (bpSettings?.bulkTransferToReseller &&
              permission?.bulkTransferToReseller &&
              role === "manager")) && (
            <button
              className="bulk_action_button btn btn-info btn-floating btn-sm"
              title={t("transferReseller")}
              data-bs-toggle="modal"
              data-bs-target="#bulkTransferToReseller"
              type="button"
            >
              <i className="fa-solid fa-right-left"></i>
              <span className="button_title"> {t("transferReseller")} </span>
            </button>
          )}

          {((role === "ispOwner" && bpSettings?.bulkCustomerDelete) ||
            (bpSettings?.bulkCustomerDelete &&
              permission?.bulkCustomerDelete &&
              role === "manager")) && (
            <button
              className="bulk_action_button btn btn-danger btn-floating btn-sm"
              title={t("customerDelete")}
              data-bs-toggle="modal"
              data-bs-target="#bulkDeleteCustomer"
              type="button"
            >
              <i className="fas fa-trash-alt"></i>
              <span className="button_title"> {t("customerDelete")} </span>
            </button>
          )}
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
