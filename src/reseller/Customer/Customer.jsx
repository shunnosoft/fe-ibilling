import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import {
  PersonPlusFill,
  ThreeDots,
  PenFill,
  PersonFill,
  CashStack,
  PrinterFill,
  ArrowClockwise,
  ChatText,
  CurrencyDollar,
  Server,
  GearFill,
  FilterCircle,
  PencilSquare,
  FiletypeCsv,
  ArrowBarLeft,
  ArrowBarRight,
  ArchiveFill,
  Phone,
  GeoAlt,
  Cash,
} from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { CSVLink } from "react-csv";
import { Accordion, Card, Collapse } from "react-bootstrap";

// custom hooks import
import useISPowner from "../../hooks/useISPOwner";

// internal imports
import "../collector/collector.css";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import Footer from "../../components/admin/footer/Footer";
import { FontColor, FourGround } from "../../assets/js/theme";
import CustomerPost from "./customerCRUD/CustomerPost";
import CustomerDetails from "./customerCRUD/CustomerDetails";
import Loader from "../../components/common/Loader";
import {
  getCustomer,
  getMikrotik,
  getSubAreas,
  resellerInfo,
  withMtkPackage,
} from "../../features/apiCallReseller";
import CustomerReport from "./customerCRUD/showCustomerReport";
import { badge } from "../../components/common/Utils";
import Table from "../../components/table/Table";
import SingleMessage from "../../components/singleCustomerSms/SingleMessage";
import IndeterminateCheckbox from "../../components/table/bulkCheckbox";
import BulkBillingCycleEdit from "./bulkOpration/bulkBillingCycleEdit";
import BulkStatusEdit from "./bulkOpration/bulkStatusEdit";
import BulkSubAreaEdit from "./bulkOpration/bulkSubAreaEdit";
import FormatNumber from "../../components/common/NumberFormat";
import BandwidthModal from "../../pages/Customer/BandwidthModal";
import BulkResellerRecharge from "./bulkOpration/BulkResellerRecharge";
import ResellerBulkAutoConnectionEdit from "./bulkOpration/ResellerBulkAutoConnectionEdit";
import BulkPackageEdit from "./bulkOpration/bulkPackageEdit";
import CustomersNumber from "../../pages/Customer/CustomersNumber";
import NetFeeBulletin from "../../components/bulletin/NetFeeBulletin";
import { getBulletinPermission } from "../../features/apiCallAdmin";
import CustomerDelete from "../../pages/Customer/customerCRUD/CustomerDelete";
import {
  getCustomerDayLeft,
  getCustomerPromiseDate,
} from "../../pages/Customer/customerCRUD/customerBillDayPromiseDate";
import PPPoECustomerEdit from "./actionComponent/PPPoECustomerEdit";
import { getOwnerUsers } from "../../features/getIspOwnerUsersApi";
import RechargeCustomer from "./actionComponent/RechargeCustomer";
import PrintOptions from "../../components/common/PrintOptions";

const Customer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // current Date
  let today = new Date();
  let firstDate = new Date(today.getFullYear(), today.getMonth(), 1);
  let lastDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  firstDate.setHours(0, 0, 0, 0);
  lastDate.setHours(23, 59, 59, 999);

  // get user & current user data form useISPOwner
  const { role, ispOwnerData, ispOwnerId, userData, permission, permissions } =
    useISPowner();

  // customer get form redux
  const allCustomer = useSelector((state) => state?.customer?.customer);

  // get reseller subAreas form reseller data
  const subAreas = useSelector((state) => state?.area?.area);

  // get ispOwner mikrotik form redux
  const mikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  // get mikrotik package form redux
  const ppPackage = useSelector((state) => state?.mikrotik?.pppoePackage);

  // get bulletin permission
  const butPermission = useSelector(
    (state) => state.adminNetFeeSupport?.bulletinPermission
  );

  // reseller id from role base
  const resellerId = role === "collector" ? userData.reseller : userData.id;

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // check uncheck mikrotik state when delete customer
  const [checkMikrotik, setMikrotikCheck] = useState(false);

  // customers number update or delete modal show state
  const [numberModalShow, setNumberModalShow] = useState(false);
  const [open, setOpen] = useState(false);

  //bandwidth modal state
  const [bandWidthModal, setBandWidthModal] = useState(false);

  //bulk menu show and hide
  const [isMenuOpen, setMenuOpen] = useState(false);

  // bulk modal handle state
  const [modalStatus, setModalStatus] = useState("");
  const [show, setShow] = useState(false);

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

  const [Customers, setCustomers] = useState([]);

  // get specific customer Report
  const [customerReportData, setId] = useState([]);

  //bulk-operations
  const [bulkCustomer, setBulkCustomer] = useState([]);

  // get specific customer
  const [singleCustomer, setSingleCustomer] = useState("");

  // customer id state
  const [customerId, setCustomerId] = useState("");

  // filter mikrotik package state
  const [mikrotikPackage, setMikrotikPackage] = useState([]);

  // customer info filter options state
  const [filterOptions, setFilterOptions] = useState({
    subArea: "",
    status: "",
    paymentStatus: "",
    mikrotik: "",
    package: "",
  });

  // get api calls
  useEffect(() => {
    // get reseller customers from ispOwner
    if (allCustomer.length === 0)
      getCustomer(dispatch, resellerId, setIsLoading);

    // get reseller mikrotiks from provider
    getMikrotik(dispatch, resellerId);

    // withMikrotik & withOutMikrotik package get api
    if (ppPackage.length === 0) withMtkPackage(dispatch, resellerId);

    // reseller subarea get api
    getSubAreas(dispatch, resellerId);

    if (role === "collector") {
      resellerInfo(resellerId, dispatch);
    }

    // get ispOwner & staffs
    getOwnerUsers(dispatch, ispOwnerId);

    // bulletin permission get api
    Object.keys(butPermission)?.length === 0 && getBulletinPermission(dispatch);
  }, [role]);

  // set state api call data
  useEffect(() => {
    setCustomers(allCustomer);

    Object.values(filterOptions) && cusInfoFilterHandler();
  }, [allCustomer]);

  // reload handler
  const reloadHandler = () => {
    if (role === "reseller") {
      getCustomer(dispatch, userData?.id, setIsLoading);
    } else if (role === "collector") {
      getCustomer(dispatch, userData?.reseller, setIsLoading);
    }
  };

  // get specific customer
  const getSpecificCustomer = (id) => {
    setSingleCustomer(id);
  };

  // customer delete controller
  const customerDelete = (customerID) => {
    setMikrotikCheck(false);
    setCustomerId(customerID);
  };

  const getSpecificCustomerReport = (reportData) => {
    setId(reportData);
  };

  const bandwidthModalController = (customerID) => {
    setCustomerId(customerID);
    setBandWidthModal(true);
  };

  // mikrotik package find handler
  const mikrotikPackageFind = (id) => {
    setFilterOptions({
      ...filterOptions,
      mikrotik: id,
    });

    // package find
    const temp = ppPackage.filter((val) => val.mikrotik === id);
    setMikrotikPackage(temp);
  };

  // customer information filter handler
  const cusInfoFilterHandler = () => {
    let temporaryCustomer = allCustomer.reduce((acc, c) => {
      const { subArea, status, paymentStatus, mikrotik } = filterOptions;

      // make possible conditions objects if the filter value not selected thats return true
      //if filter value exist then compare
      const conditions = {
        subArea: subArea ? subArea === c.subArea : true,
        status: status ? status === c.status : true,
        paymentStatus: paymentStatus ? paymentStatus === c.paymentStatus : true,
        mikrotik: mikrotik ? mikrotik === c.mikrotik : true,
        package: filterOptions.package
          ? filterOptions.package === c.mikrotikPackage
          : true,
      };

      //check if condition pass got for next step or is fail stop operation
      //if specific filter option value not exist it will return true
      let isPass = false;

      isPass = conditions["subArea"];
      if (!isPass) return acc;

      isPass = conditions["status"];
      if (!isPass) return acc;

      isPass = conditions["paymentStatus"];
      if (!isPass) return acc;

      isPass = conditions["mikrotik"];
      if (!isPass) return acc;

      isPass = conditions["package"];
      if (!isPass) return acc;

      if (isPass) acc.push(c);
      return acc;
    }, []);

    // set filter customer in customer state
    setCustomers(temporaryCustomer);
  };

  // filter reset controller
  const handleFilterReset = () => {
    setMikrotikPackage([]);
    setFilterOptions({
      subArea: "",
      status: "",
      paymentStatus: "",
      mikrotik: "",
      package: "",
    });
    setCustomers(allCustomer);
  };

  // custom filter inputs customer info
  const filterInputs = [
    {
      type: "select",
      name: "mikrotik",
      id: "mikrotik",
      value: filterOptions.mikrotik,
      disable: false,
      isVisible: true,
      options: mikrotik,
      onChange: (e) => {
        mikrotikPackageFind(e.target.value);
      },
      firstOption: t("mikrotik"),
      textAccessor: "name",
      valueAccessor: "id",
    },
    {
      type: "select",
      name: "package",
      id: "package",
      value: filterOptions.package,
      disable: false,
      isVisible: true,
      options: mikrotikPackage,
      onChange: (e) => {
        setFilterOptions({
          ...filterOptions,
          package: e.target.value,
        });
      },
      firstOption: t("package"),
      textAccessor: "name",
      valueAccessor: "id",
    },
    {
      type: "select",
      name: "subArea",
      id: "subArea",
      value: filterOptions.subArea,
      disable: false,
      isVisible: true,
      options: subAreas,
      onChange: (e) => {
        setFilterOptions({
          ...filterOptions,
          subArea: e.target.value,
        });
      },
      firstOption: t("subArea"),
      textAccessor: "name",
      valueAccessor: "id",
    },
    {
      type: "select",
      name: "status",
      id: "status",
      value: filterOptions.status,
      disable: false,
      isVisible: true,
      options: [
        { text: t("active"), value: "active" },
        { text: t("in active"), value: "inactive" },
        { text: t("expired"), value: "expired" },
      ],
      onChange: (e) => {
        setFilterOptions({
          ...filterOptions,
          status: e.target.value,
        });
      },
      firstOption: t("status"),
      textAccessor: "text",
      valueAccessor: "value",
    },
    {
      type: "select",
      name: "paymentStatus",
      id: "paymentStatus",
      value: filterOptions.paymentStatus,
      disable: false,
      isVisible: true,
      options: [
        { text: t("free"), value: "free" },
        { text: t("paid"), value: "paid" },
        { text: t("unpaid"), value: "unpaid" },
        { text: t("partial"), value: "partial" },
        { text: t("advance"), value: "advance" },
        { text: t("overdue"), value: "overdue" },
      ],
      onChange: (e) => {
        setFilterOptions({
          ...filterOptions,
          paymentStatus: e.target.value,
        });
      },
      firstOption: t("paymentStatus"),
      textAccessor: "text",
      valueAccessor: "value",
    },
  ];

  // export customer header
  const customerForCsVTableInfoHeader = [
    { label: "id", key: "customerId" },
    { label: "name_of_client", key: "name" },
    { label: "PPPoE_name", key: "pppoeName" },
    { label: "client_phone", key: "mobile" },
    { label: "bandwidth_allocation MB", key: "package" },
    { label: "status", key: "status" },
    { label: "payment Status", key: "paymentStatus" },
    { label: "email", key: "email" },
    { label: "monthly_fee", key: "monthlyFee" },
    { label: "balance", key: "balance" },
    { label: "address_of_client", key: "customerAddress" },
    { label: "activation_date", key: "createdAt" },
    { label: "billing_cycle", key: "billingCycle" },
  ];

  //export customer data
  let customerForCsVTableInfo = Customers?.map((customer) => {
    return {
      customerId: customer.customerId,
      name: customer.name,
      pppoeName: customer.pppoe.name,
      mobile: customer?.mobile || "",
      package: customer?.pppoe?.profile,
      status: customer.status,
      paymentStatus: customer.paymentStatus,
      email: customer.email || "",
      monthlyFee: customer.monthlyFee,
      balance: customer.balance,
      customerAddress: customer.address,
      createdAt: moment(customer.createdAt).format("MM/DD/YYYY"),
      billingCycle: moment(customer.billingCycle).format("MMM-DD-YYYY"),
    };
  });

  //total monthly fee and due calculation
  const dueMonthlyFee = useMemo(() => {
    let dueAmount = 0;
    let totalSumDue = 0;
    let totalMonthlyFee = 0;

    Customers?.map((item) => {
      if (item.paymentStatus === "unpaid") {
        // filter due amount
        dueAmount = item.monthlyFee - item.balance;

        // total sum due
        totalSumDue += dueAmount;
      }

      // sum of all monthly fee
      totalMonthlyFee += item.monthlyFee;
    });

    return { totalSumDue, totalMonthlyFee };
  }, [Customers]);

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

  // find area name
  const areaName = subAreas.find((item) => item.id === filterOptions.subArea);

  // send filter data to print
  const filterData = {
    area: areaName?.name ? areaName.name : t("allArea"),
    status: filterOptions.status ? filterOptions.status : t("allCustomer"),
    payment: filterOptions.paymentStatus
      ? filterOptions.paymentStatus
      : t("allCustomer"),
  };

  // pppoe customer print option
  const printData = {
    id: 1003,
    value: "pppoe",
    label: "pppoe",
    checked: true,
  };

  const columns = React.useMemo(
    () => [
      {
        id: "selection",
        width: "2%",
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
            // onClick={(e) => autoDisableHandle(original, e)}
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
                      <p className="actionP"> {t("profile")}</p>
                    </div>
                  </div>
                </li>
                {((role === "reseller" && permission?.customerRecharge) ||
                  (role === "collector" && permissions?.billPosting)) && (
                  <li
                    onClick={() => {
                      getSpecificCustomer(original.id);
                      getSpecificCustomerReport(original);
                      setModalStatus("billCollect");
                      setShow(true);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <Cash />
                        <p className="actionP">{t("recharge")}</p>
                      </div>
                    </div>
                  </li>
                )}
                {(permission?.customerEdit || permissions?.customerEdit) && (
                  <li
                    onClick={() => {
                      getSpecificCustomer(original.id);
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
                {role !== "collector" && (
                  <li
                    data-bs-toggle="modal"
                    data-bs-target="#showCustomerReport"
                    onClick={() => {
                      getSpecificCustomerReport(original);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <CashStack />
                        <p className="actionP">{t("report")}</p>
                      </div>
                    </div>
                  </li>
                )}
                {permission?.customerDelete && (
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
                {original.mobile &&
                  (permissions?.sendSMS || role !== "collector") && (
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
                  )}
                {role === "reseller" &&
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
              </ul>
            </div>
          </div>
        ),
      },
    ],
    [t]
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
                  <h2> {t("customer")}</h2>

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

                    {(permission?.customerAdd || permissions?.customerAdd) && (
                      <div>
                        <PersonPlusFill
                          className="addcutmButton"
                          onClick={() => {
                            setModalStatus("customerPost");
                            setShow(true);
                          }}
                          title={t("newCustomer")}
                        />
                      </div>
                    )}

                    <Collapse in={open} dimension="width">
                      <div id="example-collapse-text">
                        <Card className="cardCollapse border-0">
                          <div className="d-flex align-items-center">
                            {permission &&
                            permission?.singleCustomerNumberEdit ? (
                              <div
                                className="addAndSettingIcon"
                                onClick={() =>
                                  setNumberModalShow({
                                    ...numberModalShow,
                                    [false]: true,
                                  })
                                }
                                title={t("customerNumberUpdateOrDelete")}
                              >
                                <PencilSquare className="addcutmButton" />
                              </div>
                            ) : (
                              ""
                            )}

                            <CSVLink
                              data={customerForCsVTableInfo}
                              filename={ispOwnerData.company}
                              headers={customerForCsVTableInfoHeader}
                              title="Customer Report"
                            >
                              <FiletypeCsv className="addcutmButton" />
                            </CSVLink>

                            <div className="addAndSettingIcon">
                              <PrinterFill
                                title={t("customerData")}
                                className="addcutmButton"
                                onClick={() => {
                                  setModalStatus("printOptions");
                                  setShow(true);
                                }}
                              />
                            </div>
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

              {role === "reseller" || permissions?.viewCustomerList ? (
                <FourGround>
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
                                    value={item.value}
                                    onChange={item.onChange}
                                  >
                                    <option value="">{item.firstOption}</option>
                                    {item.options?.map((val) => (
                                      <option value={val[item.valueAccessor]}>
                                        {val[item.textAccessor]}
                                      </option>
                                    ))}
                                  </select>
                                )
                            )}

                            <div className="displayGrid1 mt-0 ">
                              <button
                                className="btn btn-outline-primary "
                                type="button"
                                onClick={cusInfoFilterHandler}
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
                        bulkLength={bulkCustomer?.length}
                        isLoading={isLoading}
                        columns={columns}
                        data={Customers}
                        bulkState={{
                          setBulkCustomer,
                        }}
                      ></Table>
                    </div>
                  </div>

                  {(butPermission?.customer || butPermission?.allPage) && (
                    <NetFeeBulletin />
                  )}
                </FourGround>
              ) : (
                ""
              )}
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

      {/* new customer create */}
      {modalStatus === "customerPost" && (
        <CustomerPost show={show} setShow={setShow} />
      )}

      {/* create customer information update */}
      {modalStatus === "customerEdit" && (
        <PPPoECustomerEdit
          show={show}
          setShow={setShow}
          single={singleCustomer}
        />
      )}

      {/* customer bill collection */}
      {modalStatus === "billCollect" && (
        <RechargeCustomer
          show={show}
          setShow={setShow}
          single={singleCustomer}
          customerData={customerReportData}
        />
      )}

      <CustomerReport single={customerReportData} />
      <SingleMessage single={singleCustomer} sendCustomer="customer" />

      {/* customers number update or delete modal */}
      <CustomersNumber showModal={numberModalShow} />

      {/* customer delete modal  */}
      {modalStatus === "delete" && (
        <CustomerDelete
          show={show}
          setShow={setShow}
          single={customerId}
          mikrotikCheck={checkMikrotik}
          setMikrotikCheck={setMikrotikCheck}
          status="pppoe"
          page="reseller"
        />
      )}

      {/* customers data table print option modal */}
      {modalStatus === "printOptions" && (
        <PrintOptions
          show={show}
          setShow={setShow}
          filterData={filterData}
          tableData={Customers}
          page={"customer"}
          printData={printData}
        />
      )}

      {/* Model finish */}

      {/* bulk operation modal section */}
      {modalStatus === "customerBulkEdit" && (
        <BulkSubAreaEdit
          bulkCustomer={bulkCustomer}
          show={show}
          setShow={setShow}
        />
      )}

      {modalStatus === "bulkResellerRecharge" && (
        <BulkResellerRecharge
          bulkCustomer={bulkCustomer}
          show={show}
          setShow={setShow}
        />
      )}

      {modalStatus === "customerBillingCycle" && (
        <BulkBillingCycleEdit
          bulkCustomer={bulkCustomer}
          show={show}
          setShow={setShow}
        />
      )}

      {modalStatus === "editStatus" && (
        <BulkStatusEdit
          bulkCustomer={bulkCustomer}
          show={show}
          setShow={setShow}
        />
      )}

      {modalStatus === "autoDisableEditModal" && (
        <ResellerBulkAutoConnectionEdit
          bulkCustomer={bulkCustomer}
          show={show}
          setShow={setShow}
        />
      )}

      {modalStatus === "bulkPackageEdit" && (
        <BulkPackageEdit
          bulkCustomer={bulkCustomer}
          show={show}
          setShow={setShow}
        />
      )}
      {/*  bulk operation modal section */}

      {bulkCustomer.length > 0 && (
        <div className="client_wraper2">
          <div
            className={`settings_wraper2 ${
              isMenuOpen ? "show-menu2" : "hide-menu2"
            }`}
          >
            <ul className="client_service_list2 ps-0">
              {permission?.bulkAreaEdit && (
                <li
                  type="button"
                  className="p-1"
                  onClick={() => {
                    setModalStatus("customerBulkEdit");
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

              {permission?.bulkCustomerRecharge && (
                <li
                  type="button"
                  className="p-1"
                  onClick={() => {
                    setModalStatus("bulkResellerRecharge");
                    setShow(true);
                  }}
                >
                  <div className="menu_icon2">
                    <button
                      className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-2 bg-warning"
                      title={t("package")}
                    >
                      <i className="fas fa-dollar fa-xs "></i>
                      <span className="button_title">{t("bulkRecharge")}</span>
                    </button>
                  </div>
                  <div className="menu_label2">{t("bulkRecharge")}</div>
                </li>
              )}

              <hr className="mt-0 mb-0" />

              {(permission?.bulkCustomerStatusEdit ||
                permissions?.bulkStatusEdit) && (
                <li
                  type="button"
                  className="p-1"
                  onClick={() => {
                    setModalStatus("editStatus");
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

              {permission?.bulkCustomerBillingCycleEdit && (
                <li
                  type="button"
                  className="p-1"
                  onClick={() => {
                    setModalStatus("customerBillingCycle");
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
                        {t("editBillingCycle")}{" "}
                      </span>
                    </button>
                  </div>
                  <div className="menu_label2">{t("editBillingCycle")}</div>
                </li>
              )}

              <hr className="mt-0 mb-0" />

              {ispOwnerData?.bpSettings?.hasMikrotik &&
                permission?.customerAutoDisableEdit && (
                  <li
                    type="button"
                    className="p-1"
                    onClick={() => {
                      setModalStatus("autoDisableEditModal");
                      setShow(true);
                    }}
                  >
                    <div className="menu_icon2">
                      <button
                        className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-1 bg-secondary"
                        title={t("autoConnectOnOff")}
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

              {permission?.customerMikrotikPackageEdit && (
                <li
                  type="button"
                  className="p-1"
                  onClick={() => {
                    setModalStatus("bulkPackageEdit");
                    setShow(true);
                  }}
                >
                  <div className="menu_icon2">
                    <button
                      className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-1 bg-primary"
                      title={t("package")}
                    >
                      <i class="fas fa-wifi fa-xs"></i>
                      <span className="button_title">{t("updatePackage")}</span>
                    </button>
                  </div>
                  <div className="menu_label2">{t("updatePackage")}</div>
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
      {/* {bulkCustomer.length > 0 && (
        <div className="bulkActionButton">
          {permission?.bulkAreaEdit && (
            <button
              className="bulk_action_button"
              title={t("editArea")}
              data-bs-toggle="modal"
              data-bs-target="#customerBulkEdit"
              type="button"
              class="btn btn-primary btn-floating btn-sm"
            >
              <i class="fas fa-edit"></i>
              <span className="button_title">{t("editArea")}</span>
            </button>
          )}
          {permission?.bulkCustomerRecharge && (
            <button
              className="bulk_action_button btn btn-warning btn-floating btn-sm"
              title={t("package")}
              data-bs-toggle="modal"
              data-bs-target="#bulkResellerRecharge"
              type="button"
              class="btn btn-primary btn-floating btn-sm"
            >
              <i className="fas fa-dollar"></i>
              <span className="button_title">{t("bulkRecharge")}</span>
            </button>
          )}
          {permission?.bulkCustomerStatusEdit && (
            <button
              className="bulk_action_button"
              title={t("editStatus")}
              data-bs-toggle="modal"
              data-bs-target="#modalStatusEdit"
              type="button"
              class="btn btn-dark btn-floating btn-sm"
            >
              <i class="fas fa-edit"></i>
              <span className="button_title"> {t("editStatus")}</span>
            </button>
          )}
          {permission?.bulkCustomerBillingCycleEdit && (
            <button
              className="bulk_action_button"
              title={t("editBillingCycle")}
              data-bs-toggle="modal"
              data-bs-target="#customerBillingCycle"
              type="button"
              class="btn btn-warning btn-floating btn-sm"
            >
              <i class="fas fa-edit"></i>
              <span className="button_title"> {t("editBillingCycle")} </span>
            </button>
          )}

          {permission?.customerAutoDisableEdit && (
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

          {permission?.customerMikrotikPackageEdit && (
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
        </div>
      )} */}

      <BandwidthModal
        setModalShow={setBandWidthModal}
        modalShow={bandWidthModal}
        customerId={customerId}
      />
    </>
  );
};

export default Customer;
