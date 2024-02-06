import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import {
  ArchiveFill,
  ArrowBarLeft,
  ArrowBarRight,
  ArrowClockwise,
  ArrowLeft,
  CashStack,
  FileExcelFill,
  FiletypeCsv,
  FilterCircle,
  GearFill,
  PenFill,
  PersonFill,
  PrinterFill,
  ThreeDots,
  Phone,
  GeoAlt,
} from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { CSVLink } from "react-csv";
import ReactToPrint from "react-to-print";
import { Accordion, Badge, Card, Collapse } from "react-bootstrap";

// internal import
import { FontColor, FourGround } from "../../../assets/js/theme";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import { getResellerCustomer } from "../../../features/resellerCustomerAdminApi";
import useDash from "../../../assets/css/dash.module.css";
import Table from "../../../components/table/Table";
import ResellerCustomerDetails from "../resellerModals/resellerCustomerModal";
import CustomerReport from "../../Customer/customerCRUD/showCustomerReport";
import Loader from "../../../components/common/Loader";
import ResellerCustomerEdit from "../resellerModals/ResellerCustomerEdit";
import CustomerDelete from "../resellerModals/CustomerDelete";
import IndeterminateCheckbox from "../../../components/table/bulkCheckbox";
import BulkCustomerReturn from "../resellerModals/BulkCustomerReturn";
import PrintCustomer from "./customerPDF";
import BulkBillingCycleEdit from "../resellerModals/bulkBillingCycleEdit";
import FormatNumber from "../../../components/common/NumberFormat";
import { getArea } from "../../../features/apiCalls";
import BulkStatusEdit from "../resellerModals/bulkStatusEdit";
import BulkCustomerTransfer from "../resellerModals/bulkCustomerTransfer";
import BulkPromiseDateEdit from "../../Customer/customerCRUD/bulkOpration/BulkPromiseDateEdit";
import BulkSubAreaEdit from "../../Customer/customerCRUD/bulkOpration/bulkSubAreaEdit";
import BulkPaymentStatusEdit from "../../Customer/customerCRUD/bulkOpration/BulkPaymentStatusEdit";
import BulkAutoConnectionEdit from "../../Customer/customerCRUD/bulkOpration/bulkAutoConnectionEdit";
import { getSubAreasApi } from "../../../features/actions/customerApiCall";
import BulkCustomerDelete from "../../Customer/customerCRUD/bulkOpration/BulkdeleteModal";
import {
  getCustomerDayLeft,
  getCustomerPromiseDate,
} from "../../Customer/customerCRUD/customerBillDayPromiseDate";
import { badge } from "../../../components/common/Utils";
import { getMikrotikPackages } from "../../../features/apiCallReseller";

const ResellerCustomer = () => {
  const { t } = useTranslation();
  let navigate = useNavigate();

  // reference of pdf export component
  const componentRef = useRef();

  // import dispatch
  const dispatch = useDispatch();

  // get id from route
  const { resellerId } = useParams();

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // get isp owner data
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth?.userData
  );

  // // get reseller data
  const reseller = useSelector((state) => state.reseller?.reseller);

  // get all data from redux state
  let resellerCustomer = useSelector(
    (state) => state?.resellerCustomer?.resellerCustomer
  );

  // get bp settings
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData?.bpSettings
  );

  const packages = useSelector(
    (state) => state.reseller.allMikrotikPakages?.packages
  );

  // customer state
  const [customer, setCustomer] = useState([]);

  // get single customer id
  const [singleCustomer, setSingleCustomer] = useState("");

  // get specific customer Report
  const [customerReportId, setcustomerReportId] = useState([]);

  // loading local state
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [areaLoading, setAreaLoading] = useState(false);
  // status local state
  const [filterStatus, setFilterStatus] = useState(null);

  // payment status state
  const [filterPayment, setFilterPayment] = useState(null);

  // user type state
  const [filterUserType, setFilterUserType] = useState(null);

  // customer id state
  const [customerId, setCustomerId] = useState();

  // check mikrotik checkbox
  const [mikrotikCheck, setMikrotikCheck] = useState(false);

  //bulk menu show and hide
  const [isMenuOpen, setMenuOpen] = useState(false);

  //bulk-operations
  const [bulkCustomer, setBulkCustomer] = useState([]);

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

  // bulk modal handle state
  const [bulkStatus, setBulkStatus] = useState("");
  const [modalStatus, setModalStatus] = useState("");
  const [show, setShow] = useState(false);

  const resellerInfo = reseller.find((res) => res.id === resellerId);

  // reload handler method
  const reloadHandler = () => {
    getResellerCustomer(dispatch, resellerId, setIsLoading);
  };

  // get all reseller customer api call
  useEffect(() => {
    if (customer.length === 0)
      getResellerCustomer(dispatch, resellerId, setIsLoading);
    // fetchMikrotik(dispatch, ispOwnerId, setIsLoading);

    getArea(dispatch, ispOwnerId, setAreaLoading);
    getSubAreasApi(dispatch, ispOwnerId);

    // get ispOwner mikrotiks and packages in redux store
    getMikrotikPackages(dispatch, ispOwnerId);
  }, []);

  // set customer at state
  useEffect(() => {
    if (resellerCustomer.length > 0) setCustomer(resellerCustomer);
  }, [resellerCustomer]);

  // cutomer delete
  const customerDelete = (customerId) => {
    setMikrotikCheck(false);

    setCustomerId(customerId);
  };

  let tempCustomer = [...resellerCustomer];

  const filterClick = () => {
    // user type filter
    if (filterUserType !== "all" && filterUserType == "pppoe") {
      tempCustomer = tempCustomer.filter((value) => value.userType === "pppoe");
    }

    if (filterUserType !== "all" && filterUserType == "static") {
      tempCustomer = tempCustomer.filter((value) => value.userType !== "pppoe");
    }

    // status filter
    if (filterStatus) {
      if (filterStatus !== "all") {
        tempCustomer = tempCustomer.filter(
          (value) => value.status === filterStatus
        );
      }
    }

    // payment status filter
    if (filterPayment) {
      if (filterPayment !== "all") {
        tempCustomer = tempCustomer.filter(
          (value) => value.paymentStatus === filterPayment
        );
      }
    }
    setCustomer(tempCustomer);
  };

  // get specific customer
  const getSpecificCustomer = (id) => {
    setSingleCustomer(id);
  };

  // get specific customer Report
  const getSpecificCustomerReport = (reportData) => {
    setcustomerReportId(reportData);
  };

  // customer current package find
  const getCustomerPackage = (value) => {
    const findPack = packages.find((item) =>
      item.id.includes(value?.mikrotikPackage)
    );
    return findPack;
  };

  //export customer data
  let customerForCsV = customer.map((customer) => {
    return {
      companyName: ispOwnerData.company,
      home: "Home",
      companyAddress: ispOwnerData.address,
      name: customer.name,
      customerAddress: customer.address,
      connectionType: "Wired",
      connectivity: "Dedicated",
      createdAt: moment(customer.createdAt).format("MM/DD/YYYY"),
      package:
        customer.userType === "pppoe"
          ? customer?.pppoe?.profile
          : customer.queue.package,
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

  const filterData = {
    status: filterStatus ? filterStatus : t("sokolCustomer"),
    payment: filterPayment ? filterPayment : t("sokolCustomer"),
    userType: filterUserType ? filterUserType : t("sokolCustomer"),
  };

  //export customer data
  let customerForCsVTableInfo = customer.map((customer) => {
    return {
      name: customer.name,
      customerAddress: customer.address,
      createdAt: moment(customer.createdAt).format("MM/DD/YYYY"),
      package:
        customer.userType === "pppoe"
          ? customer?.pppoe?.profile
          : customer.queue.package,
      mobile: customer?.mobile || "",
      status: customer.status,
      paymentStatus: customer.paymentStatus,
      email: customer.email || "",
      monthlyFee: customer.monthlyFee,
      balance: customer.balance,
      billingCycle: moment(customer.billingCycle).format("MMM-DD-YYYY"),
    };
  });

  const customerForCsVTableInfoHeader = [
    { label: "name_of_client", key: "name" },
    { label: "address_of_client", key: "customerAddress" },
    { label: "activation_date", key: "createdAt" },
    { label: "bandwidth_allocation MB", key: "package" },
    { label: "client_phone", key: "mobile" },
    { label: "status", key: "status" },
    { label: "payment Status", key: "paymentStatus" },
    { label: "email", key: "email" },
    { label: "monthly_fee", key: "monthlyFee" },
    { label: "balance", key: "balance" },
    { label: "billing_cycle", key: "billingCycle" },
  ];

  // table column
  const columns = React.useMemo(
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
        Cell: ({ row: { original } }) => (
          <div>
            {original?.autoDisable ? (
              <p className="text-success">{original?.customerId}</p>
            ) : (
              <p className="text-danger">{original?.customerId}</p>
            )}
          </div>
        ),
      },
      {
        width: "5%",
        Header: t("type"),
        accessor: "userType",
        Cell: ({ row: { original } }) => (
          <Badge bg="info">
            {original?.userType === "pppoe"
              ? "PPPoE"
              : original?.userType === "hotspot"
              ? "Hotspot"
              : "Static"}
          </Badge>
        ),
      },
      {
        width: "12%",
        Header: t("namePPPoE"),
        accessor: (
          data
        ) => `${data?.name} ${data.pppoe?.name} ${data.queue?.address}
         ${data.queue?.srcAddress} ${data.queue?.target}`,
        Cell: ({ row: { original } }) => (
          <div>
            <p>{original?.name}</p>
            <p>
              {original?.userType === "pppoe"
                ? original?.pppoe.name
                : original?.userType === "firewall-queue"
                ? original?.queue.address
                : original?.userType === "core-queue"
                ? original?.queue.srcAddress
                : original?.queue.target}
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
        width: "10%",
        Header: t("package"),
        Cell: ({ row: { original } }) => (
          <div>{original && getCustomerPackage(original)?.name}</div>
        ),
      },
      {
        width: "10%",
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
                {original?.userType !== "hotspot" &&
                  getCustomerPromiseDate(original)?.promiseDate}
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
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
                  data-bs-target="#resellerCustomerModalDetails"
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

                <li
                  onClick={() => {
                    getSpecificCustomer(original.id);
                    setModalStatus("edit");
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

                <li
                  onClick={() => {
                    getSpecificCustomerReport(original);
                    setModalStatus("report");
                    setShow(true);
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
              </ul>
            </div>
          </div>
        ),
      },
    ],
    [t, customer, packages]
  );

  //total monthly fee and due calculation
  const dueMonthlyFee = useCallback(() => {
    let dueAmount = 0;
    let totalSumDue = 0;
    let totalMonthlyFee = 0;

    customer.map((item) => {
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
  }, [customer]);

  //custom table header component
  const customComponent = (
    <div className="text-center" style={{ fontSize: "18px", display: "flex" }}>
      {t("monthlyFee")}&nbsp; {FormatNumber(dueMonthlyFee().totalMonthlyFee)}
      &nbsp;
      {t("tk")} &nbsp;&nbsp; {t("due")}&nbsp;
      {FormatNumber(dueMonthlyFee().totalSumDue)} &nbsp;{t("tk")} &nbsp;
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
                  <div className="d-flex col-md-4">
                    <div
                      className="pe-2 text-black"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(-1)}
                    >
                      <ArrowLeft className="arrowLeftSize" />
                    </div>
                    <h2>{t("customer")}</h2>
                  </div>

                  <h3 className="fs-2 col-md-4">{resellerInfo?.name}</h3>

                  <div
                    style={{ height: "45px" }}
                    className="d-flex justify-content-end align-items-center col-md-4"
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
                        <Loader></Loader>
                      ) : (
                        <ArrowClockwise
                          className="arrowClock"
                          title={t("refresh")}
                          onClick={() => reloadHandler()}
                        ></ArrowClockwise>
                      )}
                    </div>

                    <Collapse in={open} dimension="width">
                      <div id="example-collapse-text">
                        <Card className="cardCollapse border-0">
                          <div className="d-flex align-items-center">
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
                              <ReactToPrint
                                documentTitle="গ্রাহক লিস্ট"
                                trigger={() => (
                                  <PrinterFill
                                    title={t("print")}
                                    className="addcutmButton"
                                  />
                                )}
                                content={() => componentRef.current}
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
              <FourGround>
                <div className="mt-2">
                  <Accordion alwaysOpen activeKey={activeKeys}>
                    <Accordion.Item eventKey="filter">
                      <Accordion.Body>
                        <div className="d-flex flex-row justify-content-center">
                          {/* userType filter */}
                          <select
                            className="form-select me-2 mt-0"
                            aria-label="Default select example"
                            onChange={(event) =>
                              setFilterUserType(event.target.value)
                            }
                          >
                            <option selected value="all">
                              {t("userType")}
                            </option>
                            <option value="pppoe"> {t("pppoe")} </option>
                            <option value="static"> {t("static")} </option>
                          </select>
                          {/* end userType filter */}
                          {/* status filter */}
                          <select
                            className="form-select mt-0"
                            aria-label="Default select example"
                            onChange={(event) =>
                              setFilterStatus(event.target.value)
                            }
                          >
                            <option selected value="all">
                              {t("status")}
                            </option>
                            <option value="active"> {t("active")} </option>
                            <option value="inactive"> {t("in active")} </option>
                            <option value="expired"> {t("expired")} </option>
                          </select>
                          {/* end status filter */}

                          {/* payment status filter */}
                          <select
                            className="form-select ms-2 mt-0"
                            aria-label="Default select example"
                            onChange={(event) =>
                              setFilterPayment(event.target.value)
                            }
                          >
                            <option selected value="all">
                              {t("paymentStatus")}
                            </option>
                            <option value="paid"> {t("paid")} </option>
                            <option value="unpaid"> {t("unpaid")} </option>
                          </select>
                          {/* end payment status filter */}

                          <div>
                            <button
                              className="btn btn-outline-primary w-140 chartFilteritem ms-2"
                              onClick={filterClick}
                            >
                              {t("filter")}
                            </button>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                  <div className="collectorWrapper pb-2">
                    <div style={{ display: "none" }}>
                      <PrintCustomer
                        filterData={filterData}
                        currentCustomers={customer}
                        ref={componentRef}
                      />
                    </div>

                    <Table
                      isLoading={isLoading}
                      bulkLength={bulkCustomer?.length}
                      customComponent={customComponent}
                      columns={columns}
                      data={customer}
                      bulkState={{
                        setBulkCustomer,
                      }}
                    />
                  </div>
                </div>
              </FourGround>
            </FontColor>
          </div>
        </div>
      </div>

      {/* customer details modal */}
      <ResellerCustomerDetails
        single={singleCustomer}
        resellerCount={"singleReseller"}
      />

      {/* customer report modal */}
      {modalStatus === "report" && (
        <CustomerReport
          show={show}
          setShow={setShow}
          single={customerReportId}
        />
      )}

      {/* edit customer mdoal */}
      {modalStatus === "edit" && (
        <ResellerCustomerEdit
          show={show}
          setShow={setShow}
          allCustomer={false}
          customerId={singleCustomer}
        />
      )}

      {/* delete customer modal */}
      <CustomerDelete
        show={show}
        setShow={setShow}
        customerId={customerId}
        mikrotikCheck={mikrotikCheck}
        setMikrotikCheck={setMikrotikCheck}
      />

      {bulkStatus === "returnCustomer" && (
        <BulkCustomerReturn
          show={show}
          setShow={setShow}
          bulkCustomer={bulkCustomer}
          isAllCustomer={false}
        />
      )}

      {bulkStatus === "customerBillingCycle" && (
        <BulkBillingCycleEdit
          show={show}
          setShow={setShow}
          bulkCustomer={bulkCustomer}
        />
      )}

      {bulkStatus === "bulkStatusEdit" && (
        <BulkStatusEdit
          show={show}
          setShow={setShow}
          bulkCustomer={bulkCustomer}
        />
      )}

      {bulkStatus === "bulkPromiseDateEdit" && (
        <BulkPromiseDateEdit
          show={show}
          setShow={setShow}
          bulkCustomer={bulkCustomer}
        />
      )}

      {bulkStatus === "bulkTransferToReseller" && (
        <BulkCustomerTransfer
          show={show}
          setShow={setShow}
          bulkCustomer={bulkCustomer}
        />
      )}

      {bulkStatus === "customerBulkEdit" && (
        <BulkSubAreaEdit
          show={show}
          setShow={setShow}
          bulkCustomer={bulkCustomer}
        />
      )}

      {bulkStatus === "bulkPaymentStatusEdit" && (
        <BulkPaymentStatusEdit
          show={show}
          setShow={setShow}
          bulkCustomer={bulkCustomer}
        />
      )}

      {bulkStatus === "autoDisableEditModal" && (
        <BulkAutoConnectionEdit
          show={show}
          setShow={setShow}
          bulkCustomer={bulkCustomer}
        />
      )}

      {bulkStatus === "bulkDeleteCustomer" && (
        <BulkCustomerDelete
          show={show}
          setShow={setShow}
          bulkCustomer={bulkCustomer}
        />
      )}

      {bulkCustomer.length > 0 && (
        <div className="client_wraper2">
          <div
            className={`settings_wraper2 ${
              isMenuOpen ? "show-menu2" : "hide-menu2"
            }`}
          >
            <ul className="client_service_list2 ps-0">
              <li
                type="button"
                className="p-1"
                onClick={() => {
                  setBulkStatus("returnCustomer");
                  setShow(true);
                }}
              >
                <div className="menu_icon2">
                  <button
                    className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-1 bg-secondary"
                    title={t("returnCustomer")}
                  >
                    <i class="fa-solid fa-right-left"></i>
                    <span className="button_title">{t("returnCustomer")}</span>
                  </button>
                </div>
                <div className="menu_label2">{t("returnCustomer")}</div>
              </li>

              <hr className="mt-0 mb-0" />

              {bpSettings.resellerCustomerBulkBillingCycleEdit && (
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
                      className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-1 bg-primary"
                      title={t("editBillingCycle")}
                    >
                      <i class="fas fa-edit"></i>
                      <span className="button_title">
                        {t("editBillingCycle")}
                      </span>
                    </button>
                  </div>
                  <div className="menu_label2">{t("editBillingCycle")}</div>
                </li>
              )}

              <hr className="mt-0 mb-0" />

              {bpSettings.resellerCustomerBulkStatusEdit && (
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
                      className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-1 bg-warning"
                      title={t("editStatus")}
                    >
                      <i className="fas fa-edit"></i>
                      <span className="button_title">{t("editStatus")}</span>
                    </button>
                  </div>
                  <div className="menu_label2">{t("editStatus")}</div>
                </li>
              )}

              <hr className="mt-0 mb-0" />

              {bpSettings.resellerCustomerBulkPromiseDateEdit && (
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
                      className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-1 bg-primary"
                      title={t("editPromiseDate")}
                    >
                      <i className="fas fa-edit"></i>
                      <span className="button_title">
                        {t("editPromiseDate")}
                      </span>
                    </button>
                  </div>
                  <div className="menu_label2">{t("editPromiseDate")}</div>
                </li>
              )}

              <hr className="mt-0 mb-0" />

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
                    className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-1 bg-warning"
                    title={t("transferResellerToReseller")}
                  >
                    <i className="fa-solid fa-right-left"></i>
                    <span className="button_title">
                      {t("transferResellerToReseller")}
                    </span>
                  </button>
                </div>
                <div className="menu_label2">
                  {t("transferResellerToReseller")}
                </div>
              </li>

              <hr className="mt-0 mb-0" />

              {bpSettings.resellerCustomerBulkAreaEdit && (
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
                      className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-1 bg-success"
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

              {bpSettings.resellerCustomerBulkPaymentStatusEdit && (
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

              {bpSettings.resellerCustomerBulkAutoConnectionEdit && (
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
                      className="bulk_action_button btn btn-primary btn-floating btn-sm py-0 px-1 bg-danger"
                      title={t("autoConnectOnOff")}
                    >
                      <i class="fas fa-power-off fa-xs"></i>
                      <span className="button_title">
                        {t("autoConnectOnOff")}
                      </span>
                    </button>
                  </div>
                  <div className="menu_label2">{t("autoConnectOnOff")}</div>
                </li>
              )}

              <hr className="mt-0 mb-0" />

              {bpSettings?.bulkCustomerDelete && (
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
    </>
  );
};

export default ResellerCustomer;
