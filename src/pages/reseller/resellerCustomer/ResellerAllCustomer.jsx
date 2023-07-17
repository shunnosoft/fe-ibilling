import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArchiveFill,
  ArrowClockwise,
  ArrowLeft,
  CashStack,
  FileExcelFill,
  FiletypeCsv,
  FilterCircle,
  PenFill,
  PersonFill,
  PrinterFill,
  ThreeDots,
} from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { FontColor, FourGround } from "../../../assets/js/theme";
import useDash from "../../../assets/css/dash.module.css";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import Loader from "../../../components/common/Loader";
import { fetchReseller } from "../../../features/apiCalls";
import CustomerReport from "../../Customer/customerCRUD/showCustomerReport";
import ResellerCustomerEdit from "../resellerModals/ResellerCustomerEdit";
import ResellerCustomerDetails from "../resellerModals/resellerCustomerModal";
import { badge } from "../../../components/common/Utils";
import moment from "moment";
import { getAllResellerCustomer } from "../../../features/resellerCustomerAdminApi";
import Table from "../../../components/table/Table";
import { ToastContainer } from "react-toastify";
import CustomerDelete from "../resellerModals/CustomerDelete";
import BulkCustomerReturn from "../resellerModals/BulkCustomerReturn";
import IndeterminateCheckbox from "../../../components/table/bulkCheckbox";
import { CSVLink } from "react-csv";
import ReactToPrint from "react-to-print";
import PrintCustomer from "./customerPDF";
import FormatNumber from "../../../components/common/NumberFormat";
import { useNavigate } from "react-router-dom";
import BulkPromiseDateEdit from "../../Customer/customerCRUD/bulkOpration/BulkPromiseDateEdit";
import BulkBillingCycleEdit from "../../Customer/customerCRUD/bulkOpration/bulkBillingCycleEdit";
import BulkStatusEdit from "../../Customer/customerCRUD/bulkOpration/bulkStatusEdit";
import { Accordion } from "react-bootstrap";

const AllResellerCustomer = () => {
  const { t } = useTranslation();
  let navigate = useNavigate();

  // import dispatch
  const dispatch = useDispatch();

  // reference of pdf export component
  const componentRef = useRef();

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
    // reseller filter
    if (resellerId) {
      if (resellerId !== "all") {
        tempCustomer = tempCustomer.filter(
          (customer) => customer.reseller.id === resellerId
        );
      }
    }

    // user type filter
    if (filterUserType !== "all" && filterUserType == "pppoe") {
      tempCustomer = tempCustomer.filter((value) => value.userType === "pppoe");
    }

    if (filterUserType !== "all" && filterUserType == "static") {
      tempCustomer = tempCustomer.filter((value) => value.userType !== "pppoe");
    }

    // status filter
    if (filterStatus && filterStatus !== t("status")) {
      if (filterStatus !== "all") {
        tempCustomer = tempCustomer.filter(
          (value) => value.status === filterStatus
        );
      }
    }

    // payment status filter
    if (filterPayment && filterPayment !== t("payment")) {
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
        Header: t("id"),
        accessor: "customerId",
        width: "8%",
      },
      {
        Header: t("reseller"),
        accessor: "reseller.name",
        width: "9%",
      },
      {
        Header: t("name"),
        accessor: "name",
        width: "9%",
      },
      {
        width: "9%",
        Header: t("userType"),
        accessor: "userType",
      },
      {
        Header: t("mobile"),
        accessor: "mobile",
        width: "11%",
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
        accessor: (field) =>
          field.userType === "pppoe"
            ? field.pppoe.profile
            : field.queue.package,
      },
      {
        width: "9%",
        Header: t("month"),
        accessor: "monthlyFee",
      },
      {
        width: "9%",
        Header: t("balance"),
        accessor: "balance",
      },
      {
        width: "11%",
        Header: t("date"),
        accessor: "billingCycle",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("YYYY/MM/DD hh:mm a");
        },
      },

      {
        width: "6%",
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
                  data-bs-toggle="modal"
                  data-bs-target="#CustomerEditModal"
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

                  <div className="d-flex justify-content-center align-items-center">
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
                          onClick={() => reloadHandler()}
                        ></ArrowClockwise>
                      )}
                    </div>

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
                </div>
              </FourGround>
              <FourGround>
                <div className="mt-2">
                  <Accordion alwaysOpen activeKey={activeKeys}>
                    <Accordion.Item eventKey="filter">
                      <Accordion.Body>
                        <div className="d-flex flex-row justify-content-center">
                          {/* status filter */}
                          <select
                            className="form-select mt-0"
                            aria-label="Default select example"
                            onChange={(event) =>
                              setResellerId(event.target.value)
                            }
                          >
                            <option selected value="all">
                              {t("allReseller")}
                            </option>
                            {resellers.map((reseller, key) => (
                              <option key={key} value={reseller.id}>
                                {reseller.name}
                              </option>
                            ))}
                          </select>
                          {/* userType filter */}
                          <select
                            className="form-select ms-2 mt-0"
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
                          <select
                            className="form-select mx-2 mt-0"
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
                            className="form-select me-2 mt-0"
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
                              className="btn btn-outline-primary w-140"
                              onClick={filterClick}
                            >
                              {t("filter")}
                            </button>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
                <div className="collectorWrapper pb-2">
                  <div className="addCollector">
                    <div style={{ display: "none" }}>
                      <PrintCustomer
                        filterData={filterData}
                        currentCustomers={customer}
                        ref={componentRef}
                      />
                    </div>
                    {/* call table component */}
                    <div className="table-section">
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
                  </div>
                </div>
              </FourGround>
            </FontColor>
          </div>
        </div>
      </div>
      <ResellerCustomerDetails
        single={singleCustomer}
        resellerCount={"allReseller"}
      />
      <CustomerReport hideReportDelete={true} single={customerReportId} />
      <ResellerCustomerEdit allCustomer={true} customerId={singleCustomer} />
      <CustomerDelete
        customerId={customerId}
        mikrotikCheck={mikrotikCheck}
        setMikrotikCheck={setMikrotikCheck}
      />
      <BulkCustomerReturn
        modalId="returnCustomer"
        bulkCustomer={bulkCustomer}
        isAllCustomer={true}
      />
      <BulkPromiseDateEdit
        bulkCustomer={bulkCustomer}
        modalId="bulkPromiseDateEdit"
      />
      <BulkBillingCycleEdit
        bulkCustomer={bulkCustomer}
        modalId="customerBillingCycle"
      />
      <BulkStatusEdit bulkCustomer={bulkCustomer} modalId="bulkStatusEdit" />
      {bulkCustomer.length > 0 && (
        <>
          <div className="bulkActionButton">
            <button
              className="bulk_action_button"
              title={t("returnCustomer")}
              data-bs-toggle="modal"
              data-bs-target="#returnCustomer"
              type="button"
              class="btn btn-dark btn-floating btn-sm"
            >
              <i class="fa-solid fa-right-left"></i>
              <span className="button_title"> {t("returnCustomer")} </span>
            </button>

            {bpSettings.resellerCustomerBulkPromiseDateEdit && (
              <button
                className="bulk_action_button"
                title={t("editPromiseDate")}
                data-bs-toggle="modal"
                data-bs-target="#bulkPromiseDateEdit"
                type="button"
                class="btn btn-dark btn-floating btn-sm"
              >
                <i class="fas fa-calendar-week"></i>
                <span className="button_title"> {t("editPromiseDate")} </span>
              </button>
            )}

            {bpSettings.resellerCustomerBulkBillingCycleEdit && (
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

            {bpSettings.resellerCustomerBulkStatusEdit && (
              <button
                className="bulk_action_button btn btn-info btn-floating btn-sm"
                title={t("editStatus")}
                data-bs-toggle="modal"
                data-bs-target="#bulkStatusEdit"
                type="button"
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
