import React, { useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
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
  GeoAlt,
  PenFill,
  PersonFill,
  Phone,
  PrinterFill,
  ThreeDots,
} from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { CSVLink } from "react-csv";
import ReactToPrint from "react-to-print";
import { useNavigate } from "react-router-dom";
import { Accordion, Badge, Card, Collapse } from "react-bootstrap";

//internal import
import { FontColor, FourGround } from "../../../assets/js/theme";
import useDash from "../../../assets/css/dash.module.css";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import Loader from "../../../components/common/Loader";
import { fetchReseller } from "../../../features/apiCalls";
import CustomerReport from "../../Customer/customerCRUD/showCustomerReport";
import ResellerCustomerEdit from "../resellerModals/ResellerCustomerEdit";
import ResellerCustomerDetails from "../resellerModals/resellerCustomerModal";
import { badge } from "../../../components/common/Utils";
import { getAllResellerCustomer } from "../../../features/resellerCustomerAdminApi";
import Table from "../../../components/table/Table";
import CustomerDelete from "../resellerModals/CustomerDelete";
import BulkCustomerReturn from "../resellerModals/BulkCustomerReturn";
import IndeterminateCheckbox from "../../../components/table/bulkCheckbox";
import PrintCustomer from "./customerPDF";
import FormatNumber from "../../../components/common/NumberFormat";
import BulkPromiseDateEdit from "../../Customer/customerCRUD/bulkOpration/BulkPromiseDateEdit";
import BulkBillingCycleEdit from "../../Customer/customerCRUD/bulkOpration/bulkBillingCycleEdit";
import BulkStatusEdit from "../../Customer/customerCRUD/bulkOpration/bulkStatusEdit";
import { getMikrotikPackages } from "../../../features/apiCallReseller";
import {
  getCustomerDayLeft,
  getCustomerPromiseDate,
} from "../../Customer/customerCRUD/customerBillDayPromiseDate";
import DataFilter from "../../common/DataFilter";
import useDataState from "../../../hooks/useDataState";

const AllResellerCustomer = () => {
  const { t } = useTranslation();
  let navigate = useNavigate();

  // import dispatch
  const dispatch = useDispatch();

  // reference of pdf export component
  const componentRef = useRef();

  // get user data set from useDataState hooks
  const { filterOptions, setFilterOption } = useDataState();

  // get all data from redux state
  let resellerCustomer = useSelector(
    (state) => state?.resellerCustomer?.allResellerCustomer
  );

  // get isp owner id
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );
  // get reseller
  const resellers = useSelector((state) => state?.reseller.reseller);

  // get isp owner data
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth?.userData
  );

  // get bp settings
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData?.bpSettings
  );

  // get all packages
  const packages = useSelector(
    (state) => state.reseller.allMikrotikPakages?.packages
  );

  // customer state
  const [customer, setCustomer] = useState([]);

  // get single customer state
  const [singleCustomer, setSingleCustomer] = useState("");

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

  // get specific customer Report
  const [customerReportId, setcustomerReportId] = useState([]);

  // loading local state
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // status local state
  const [filterStatus, setFilterStatus] = useState(null);

  // customer id state
  const [customerId, setCustomerId] = useState();

  // mikrotik check state
  const [mikrotikCheck, setMikrotikCheck] = useState(false);

  // payment status state
  const [filterPayment, setFilterPayment] = useState(null);

  // user type state
  const [filterUserType, setFilterUserType] = useState(null);

  // reseller id state
  const [resellerId, setResellerId] = useState("");

  //bulk-operations state
  const [bulkCustomer, setBulkCustomer] = useState([]);

  // bulk modal handle state
  const [modalStatus, setModalStatus] = useState("");
  const [bulkStatus, setBulkStatus] = useState("");
  const [show, setShow] = useState(false);

  // reload handler method
  const reloadHandler = () => {
    getAllResellerCustomer(dispatch, ispOwner, setIsLoading);
    fetchReseller(dispatch, ispOwner, setIsLoading);
  };

  // get all reseller customer api call
  useEffect(() => {
    if (customer.length === 0)
      getAllResellerCustomer(dispatch, ispOwner, setIsLoading);
    if (resellers.length === 0) fetchReseller(dispatch, ispOwner, setIsLoading);

    // get ispOwner mikrotiks and packages in redux store
    getMikrotikPackages(dispatch, ispOwner);
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
    const findPack = packages?.find((item) =>
      item.id.includes(value?.mikrotikPackage)
    );
    return findPack;
  };

  //total monthly fee and due calculation
  const dueMonthlyFee = useMemo(() => {
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

  // find filter name
  const resellerName = resellers.find((reseller) => reseller.id === resellerId);

  // filter data for pdf
  const filterData = {
    reseller: resellerName?.name ? resellerName?.name : t("allReseller"),
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
          : customer.queue.packag,
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
        width: "5%",
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
        Header: t("reseller"),
        accessor: "reseller.name",
        width: "6%",
      },
      {
        width: "12%",
        Header: t("nameType"),
        accessor: (
          data
        ) => `${data?.name} ${data.pppoe?.name} ${data.queue?.address}
         ${data.queue?.srcAddress} ${data.queue?.target}`,
        Cell: ({ row: { original } }) => (
          <div>
            <p>{original?.name}</p>
            <Badge bg="info">
              {original?.userType === "pppoe"
                ? "PPPoE"
                : original?.userType === "hotspot"
                ? "Hotspot"
                : "Static"}
            </Badge>
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
    [t, packages]
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
                  <div className="d-flex">
                    <div
                      className="pe-2 text-black"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(-1)}
                    >
                      <ArrowLeft className="arrowLeftSize" />
                    </div>
                    <h2>{t("customer")}</h2>
                  </div>

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
                        <DataFilter
                          page="resellerCustomer"
                          customers={resellerCustomer}
                          setCustomers={setCustomer}
                          filterOptions={filterOptions}
                          setFilterOption={setFilterOption}
                        />
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
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
                    columns={columns}
                    customComponent={customComponent}
                    bulkLength={bulkCustomer?.length}
                    data={customer}
                    bulkState={{
                      setBulkCustomer,
                    }}
                  />
                </div>
              </FourGround>
            </FontColor>
          </div>
        </div>
      </div>
      {/* single modal state */}

      {/* customer details */}
      <ResellerCustomerDetails
        single={singleCustomer}
        resellerCount={"allReseller"}
      />

      {/* edit customer modal */}
      {modalStatus === "edit" && (
        <ResellerCustomerEdit
          show={show}
          setShow={setShow}
          allCustomer={true}
          customerId={singleCustomer}
        />
      )}

      {/* customer report modal */}
      {modalStatus === "report" && (
        <CustomerReport
          show={show}
          setShow={setShow}
          hideReportDelete={true}
          single={customerReportId}
        />
      )}

      {/* customer delete modal */}
      {modalStatus === "delete" && (
        <CustomerDelete
          show={show}
          setShow={setShow}
          customerId={customerId}
          mikrotikCheck={mikrotikCheck}
          setMikrotikCheck={setMikrotikCheck}
        />
      )}

      {/* single modal end */}

      {/* bulk modal start */}
      {bulkStatus === "returnCustomer" && (
        <BulkCustomerReturn
          bulkCustomer={bulkCustomer}
          isAllCustomer={true}
          show={show}
          setShow={setShow}
        />
      )}

      {bulkStatus === "bulkPromiseDateEdit" && (
        <BulkPromiseDateEdit
          bulkCustomer={bulkCustomer}
          show={show}
          setShow={setShow}
        />
      )}

      {bulkStatus === "customerBillingCycle" && (
        <BulkBillingCycleEdit
          bulkCustomer={bulkCustomer}
          show={show}
          setShow={setShow}
        />
      )}

      {bulkStatus === "bulkStatusEdit" && (
        <BulkStatusEdit
          bulkCustomer={bulkCustomer}
          show={show}
          setShow={setShow}
        />
      )}

      {/* bulk modal end */}

      {bulkCustomer.length > 0 && (
        <>
          <div className="bulkActionButton">
            <button
              className="bulk_action_button btn btn-dark btn-floating btn-sm"
              title={t("returnCustomer")}
              type="button"
              onClick={() => {
                setBulkStatus("returnCustomer");
                setShow(true);
              }}
            >
              <i class="fa-solid fa-right-left"></i>
              <span className="button_title"> {t("returnCustomer")} </span>
            </button>

            {bpSettings.resellerCustomerBulkPromiseDateEdit && (
              <button
                className="bulk_action_button btn btn-dark btn-floating btn-sm"
                title={t("editPromiseDate")}
                type="button"
                onClick={() => {
                  setBulkStatus("bulkPromiseDateEdit");
                  setShow(true);
                }}
              >
                <i class="fas fa-calendar-week"></i>
                <span className="button_title"> {t("editPromiseDate")} </span>
              </button>
            )}

            {bpSettings.resellerCustomerBulkBillingCycleEdit && (
              <button
                className="bulk_action_button btn btn-dark btn-floating btn-sm"
                title={t("editBillingCycle")}
                type="button"
                onClick={() => {
                  setBulkStatus("customerBillingCycle");
                  setShow(true);
                }}
              >
                <i class="fas fa-edit"></i>
                <span className="button_title"> {t("editBillingCycle")} </span>
              </button>
            )}

            {bpSettings.resellerCustomerBulkStatusEdit && (
              <button
                className="bulk_action_button btn btn-info btn-floating btn-sm"
                title={t("editStatus")}
                type="button"
                onClick={() => {
                  setBulkStatus("bulkStatusEdit");
                  setShow(true);
                }}
              >
                <i className="fas fa-edit"></i>
                <span className="button_title"> {t("editStatus")}</span>
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default AllResellerCustomer;
