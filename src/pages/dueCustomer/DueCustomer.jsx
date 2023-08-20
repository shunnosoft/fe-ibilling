import React, { useMemo, useRef, useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDueCustomer } from "../../features/apiCalls";
import { useTranslation } from "react-i18next";
import Table from "../../components/table/Table";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { badge } from "../../components/common/Utils";
import moment from "moment";
import Loader from "../../components/common/Loader";
import useDash from "../../assets/css/dash.module.css";
import {
  ArrowBarLeft,
  ArrowBarRight,
  ArrowClockwise,
  FiletypeCsv,
  FilterCircle,
  PrinterFill,
} from "react-bootstrap-icons";
import { FontColor, FourGround } from "../../assets/js/theme";
import { Accordion, Card, Collapse, Tab, Tabs } from "react-bootstrap";
import { CSVLink } from "react-csv";
import ReactToPrint from "react-to-print";
import PrintReport from "./print/ReportPDF";
import StaticPrintReport from "./print/StaticReportPDF";
import Footer from "../../components/admin/footer/Footer";
import DatePicker from "react-datepicker";
import { ToastContainer } from "react-toastify";

const DueCustomer = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const componentRef = useRef();

  // get current date
  const date = new Date();
  var firstDate = new Date(date.getFullYear(), date.getMonth() - 1);

  // get isp owner id
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // get isp owner data
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth.userData
  );

  // get due customer
  let dueCustomer = useSelector((state) => state.customer.dueCustomer);

  // loading state
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // prev month due customer state
  const [customers, setCustomers] = useState([]);

  //customer type state
  const [customerType, setCustomerType] = useState("");

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

  //filter state
  const [filterDate, setFilterDate] = useState(firstDate);

  // get customer api call
  useEffect(() => {
    filterDate.getMonth() + 1 &&
      getDueCustomer(
        dispatch,
        ispOwner,
        filterDate.getMonth() + 1,
        filterDate.getFullYear(),
        setIsLoading
      );
  }, [filterDate]);

  useEffect(() => {
    setCustomers(dueCustomer);
  }, [dueCustomer]);

  // reload handler
  const reloadHandler = () => {
    getDueCustomer(
      dispatch,
      ispOwner,
      filterDate.getMonth() + 1,
      filterDate.getFullYear(),
      setIsLoading
    );
  };

  // filter function
  const dueCustomerFilterHandler = () => {
    let arr = [...dueCustomer];
    if (!customerType) {
      arr = dueCustomer;
    } else if (customerType && customerType === "pppoe") {
      arr = arr.filter((value) => value.userType === "pppoe");
    } else {
      arr = arr.filter((value) => value.userType !== "pppoe");
    }

    setCustomers(arr);
  };

  // pppoe customer csv table header
  const customerForCsVTableInfoHeader = [
    { label: "name_of_client", key: "name" },
    { label: "address_of_client", key: "customerAddress" },
    { label: "bandwidth_allocation MB", key: "package" },
    { label: "client_phone", key: "mobile" },
    { label: "status", key: "status" },
    { label: "payment Status", key: "paymentStatus" },
    { label: "monthly_fee", key: "monthlyFee" },
    { label: "balance", key: "balance" },
    { label: "billing_cycle", key: "billingCycle" },
  ];

  //pppoe customer export customer data
  let customerForCsVTableInfo = customers.map((customer) => {
    return {
      name: customer.name,
      customerAddress: customer.address,
      package: customer?.pppoe?.profile,
      mobile: customer?.mobile || "",
      status: customer.status,
      paymentStatus: customer.paymentStatus,
      monthlyFee: customer.monthlyFee,
      balance: customer.balance,
      billingCycle: moment(customer.billingCycle).format("YYYY/MM/DD"),
    };
  });

  // static customer csv table header
  const staticCustomerForCsVTableInfoHeader = [
    { label: "name_of_client", key: "name" },
    { label: "address_of_client", key: "customerAddress" },
    { label: "activation_date", key: "createdAt" },
    { label: "customer_ip", key: "ip" },
    { label: "package", key: "package" },
    { label: "client_phone", key: "mobile" },
    { label: "status", key: "status" },
    { label: "payment Status", key: "paymentStatus" },
    { label: "email", key: "email" },
    { label: "monthly_fee", key: "monthlyFee" },
    { label: "balance", key: "balance" },
    { label: "billing_cycle", key: "billingCycle" },
  ];

  // satic customer export customer data
  let staticCustomerForCsVTableInfo = customers.map((customer) => {
    return {
      name: customer.name,
      ip:
        customer.userType === "firewall-queue"
          ? customer.queue.address
          : customer.queue.target,
      customerAddress: customer.address,
      createdAt: moment(customer.createdAt).format("YYYY/MM/DD"),
      package: customer?.queue?.package,
      mobile: customer?.mobile || "",
      status: customer.status,
      paymentStatus: customer.paymentStatus,
      email: customer.email || "",
      monthlyFee: customer.monthlyFee,
      balance: customer.balance,
      billingCycle: moment(customer.billingCycle).format("YYYY/MM/DD"),
    };
  });

  // due-customer column
  const columns = useMemo(
    () => [
      {
        width: "8%",
        Header: t("id"),
        accessor: "customerId",
      },
      {
        width: "9%",
        Header: t("name"),
        Cell: ({ row: { original } }) => (
          <div
            style={{ cursor: "move" }}
            data-toggle="tooltip"
            data-placement="top"
            title={original.address}
          >
            {original.name}
          </div>
        ),
      },
      {
        width: "9%",
        Header: t("pppoeIp"),
        accessor: (field) =>
          field.userType === "pppoe"
            ? field.pppoe.name
            : field.userType === "firewall-queue"
            ? field.queue.address
            : field.queue.target,
      },
      {
        width: "12%",
        Header: t("mobile"),
        accessor: "mobile",
      },

      {
        width: "9%",
        Header: t("status"),
        accessor: "status",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "12%",
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
        width: "10%",
        Header: t("monthly"),
        accessor: "monthlyFee",
      },
      {
        width: "10%",
        Header: t("balance"),
        accessor: "balance",
      },
      {
        width: "11%",
        Header: t("date"),
        accessor: "billingCycle",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("YYYY/MM/DD hh:mm A");
        },
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
                  <h2>{t("dueCustomer")}</h2>

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
                                filename={ispOwnerData.company}
                                headers={
                                  customerType === "pppoe"
                                    ? customerForCsVTableInfoHeader
                                    : staticCustomerForCsVTableInfoHeader
                                }
                                data={
                                  customerType === "pppoe"
                                    ? customerForCsVTableInfo
                                    : staticCustomerForCsVTableInfo
                                }
                                title={t("customerReport")}
                              >
                                <FiletypeCsv className="addcutmButton" />
                              </CSVLink>
                            </div>

                            <div
                              className="addAndSettingIcon"
                              title={t("PPPoE Customer Print")}
                            >
                              <ReactToPrint
                                documentTitle={t("dueCustomer")}
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
                        <div className="displayGrid6">
                          <div>
                            <DatePicker
                              className="form-control mw-100 mt-0"
                              selected={filterDate}
                              onChange={(date) => setFilterDate(date)}
                              dateFormat="MMM-yyyy"
                              showMonthYearPicker
                              showFullMonthYearPicker
                              maxDate={firstDate}
                              minDate={new Date(ispOwnerData?.createdAt)}
                            />
                          </div>

                          <select
                            className="form-select mw-100 mt-0"
                            onChange={(e) => setCustomerType(e.target.value)}
                          >
                            <option selected value="">
                              {t("userType")}
                            </option>
                            {ispOwnerData?.bpSettings?.customerType.map(
                              (cType) => (
                                <option value={cType}>{t(`${cType}`)}</option>
                              )
                            )}
                          </select>

                          <div className="gridButton">
                            <button
                              className="btn btn-outline-primary w-6rem"
                              type="button"
                              onClick={dueCustomerFilterHandler}
                              id="filterBtn"
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
                      {customerType === "pppoe" ? (
                        <PrintReport
                          currentCustomers={customers}
                          ref={componentRef}
                        />
                      ) : (
                        <StaticPrintReport
                          currentCustomers={customers}
                          ref={componentRef}
                        />
                      )}
                    </div>

                    <div className="table-section">
                      <Table
                        isLoading={isLoading}
                        columns={columns}
                        data={customers}
                      ></Table>
                    </div>
                  </div>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
};

export default DueCustomer;
