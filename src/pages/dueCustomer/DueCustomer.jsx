import React, { useRef, useState } from "react";
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
  ArrowClockwise,
  FileExcelFill,
  FiletypeCsv,
  FilterCircle,
  PrinterFill,
} from "react-bootstrap-icons";
import { FontColor, FourGround } from "../../assets/js/theme";
import { Accordion, Tab, Tabs } from "react-bootstrap";
import { CSVLink } from "react-csv";
import ReactToPrint from "react-to-print";
import PrintReport from "./print/ReportPDF";
import StaticPrintReport from "./print/StaticReportPDF";
import Footer from "../../components/admin/footer/Footer";
import DatePicker from "react-datepicker";

const DueCustomer = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const componentRef = useRef();
  const staticRef = useRef();

  // get current date
  const date = new Date();

  var firstDate = new Date(date.getFullYear(), date.getMonth() - 1);
  var lastDate = new Date(date.getFullYear(), date.getMonth(), 0);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // static Customr loading
  const [staticLoading, setStaticLoading] = useState(false);

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

  //filter state
  const [filterDate, setFilterDate] = useState(firstDate);
  const [staticDate, setStaticDate] = useState(firstDate);

  // get isp owner id
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // get due customer
  let dueCustomer = useSelector((state) => state.customer.dueCustomer);

  // get due static customer
  let staticDueCustomer = useSelector(
    (state) => state.customer.staticDueCustomer
  );

  // get isp owner data
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth.userData
  );

  // get bpSettings
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData?.bpSettings
  );

  // get customer type
  const hasCustomerType = bpSettings?.customerType
    ? bpSettings.customerType
    : [];

  // // reload handler
  const reloadHandler = () => {
    getDueCustomer(
      dispatch,
      ispOwner,
      filterDate.getMonth() + 1,
      filterDate.getFullYear(),
      setIsLoading,
      "pppoe"
    );
    getDueCustomer(
      dispatch,
      ispOwner,
      filterDate.getMonth() + 1,
      filterDate.getFullYear(),
      setStaticLoading,
      "static"
    );
  };

  // get customer api call
  useEffect(() => {
    if (hasCustomerType.includes("pppoe"))
      getDueCustomer(
        dispatch,
        ispOwner,
        filterDate.getMonth() + 1,
        filterDate.getFullYear(),
        setIsLoading,
        "pppoe"
      );
    if (hasCustomerType.includes("static"))
      getDueCustomer(
        dispatch,
        ispOwner,
        filterDate.getMonth() + 1,
        filterDate.getFullYear(),
        setStaticLoading,
        "static"
      );
  }, []);

  const dueCustomerFilterHandler = () => {
    getDueCustomer(
      dispatch,
      ispOwner,
      filterDate.getMonth() + 1,
      filterDate.getFullYear(),
      setIsLoading,
      "pppoe"
    );
  };

  const staticCustomerFilterHandler = () => {
    getDueCustomer(
      dispatch,
      ispOwner,
      staticDate.getMonth() + 1,
      staticDate.getFullYear(),
      setStaticLoading,
      "static"
    );
  };

  //pppoe customer export customer data
  let customerForCsVTableInfo = dueCustomer.map((customer) => {
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

  // satic customer export customer data
  let staticCustomerForCsVTableInfo = staticDueCustomer.map((customer) => {
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

  // pppoe column
  const pppoeColumns = React.useMemo(
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
        Header: t("PPPoE"),
        accessor: "pppoe.name",
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
        Header: t("mountly"),
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

  // static column
  const staticColumns = React.useMemo(
    () => [
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
        width: "12%",
        Header: t("ip"),
        accessor: (field) =>
          field.userType === "firewall-queue"
            ? field.queue.address
            : field.queue.target,
      },

      {
        width: "12%",
        Header: t("mobile"),
        accessor: "mobile",
      },

      {
        width: "10%",
        Header: t("status"),
        accessor: "status",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "11%",
        Header: t("paymentStatus"),
        accessor: "paymentStatus",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "12%",
        Header: t("mountly"),
        accessor: "monthlyFee",
      },
      {
        width: "11%",
        Header: t("balance"),
        accessor: "balance",
      },
      {
        width: "12%",
        Header: t("bill"),
        accessor: "billingCycle",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm A");
        },
      },
    ],
    [t]
  );

  return (
    <>
      <Sidebar />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <div className="collectorTitle d-flex justify-content-between px-4">
                  <div className="d-flex">
                    <h2>{t("dueCustomer")}</h2>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <>
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

                      {/* for pppoe customer */}
                      {hasCustomerType.includes("pppoe") && (
                        <>
                          <div className="addAndSettingIcon">
                            <CSVLink
                              data={customerForCsVTableInfo}
                              filename={ispOwnerData.company}
                              headers={customerForCsVTableInfoHeader}
                              title="PPPoE Customer CSV"
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
                        </>
                      )}
                      {/* end for pppoe customer */}

                      {/* for static customer */}
                      {hasCustomerType.includes("static") && (
                        <>
                          <div className="addAndSettingIcon">
                            <CSVLink
                              data={staticCustomerForCsVTableInfo}
                              filename={ispOwnerData.company}
                              headers={staticCustomerForCsVTableInfoHeader}
                              title="Static Customer CSV"
                            >
                              <FiletypeCsv className="addcutmButton" />
                            </CSVLink>
                          </div>

                          <div
                            className="addAndSettingIcon"
                            title={t("Static Customer Print")}
                          >
                            <ReactToPrint
                              documentTitle={t("dueCustomer")}
                              trigger={() => (
                                <PrinterFill
                                  title={t("print")}
                                  className="addcutmButton"
                                />
                              )}
                              content={() => staticRef.current}
                            />
                          </div>
                        </>
                      )}
                      {/* end for static customer */}

                      {/* print report */}
                      <div style={{ display: "none" }}>
                        <PrintReport
                          currentCustomers={dueCustomer}
                          ref={componentRef}
                        />
                        <StaticPrintReport
                          currentCustomers={staticDueCustomer}
                          ref={staticRef}
                        />
                      </div>
                      {/* print report end*/}
                    </>
                  </div>
                </div>
              </FourGround>
              <FourGround>
                <div className="collectorWrapper mt-2 py-2">
                  <div className="addCollector">
                    <Tabs id="uncontrolled-tab-example">
                      {bpSettings?.customerType?.map(
                        (type) =>
                          (type === "pppoe" && (
                            <Tab eventKey="pppoe" title={t("PPPoE")}>
                              <Accordion alwaysOpen activeKey={activeKeys}>
                                <Accordion.Item
                                  eventKey="filter"
                                  className="accordionBorder"
                                >
                                  <Accordion.Body className="accordionPadding pt-2">
                                    <div
                                      className="displayGrid6"
                                      style={{
                                        columnGap: "5px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      <div>
                                        <DatePicker
                                          selected={filterDate}
                                          className="form-control"
                                          onChange={(date) =>
                                            setFilterDate(date)
                                          }
                                          dateFormat="MMM/yyyy"
                                          showMonthYearPicker
                                          showFullMonthYearPicker
                                          endDate={"2014/04/08"}
                                          maxDate={lastDate}
                                          minDate={
                                            new Date(ispOwnerData?.createdAt)
                                          }
                                        />
                                      </div>

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
                              {hasCustomerType.includes("pppoe") ? (
                                <>
                                  <div className="table-section">
                                    <Table
                                      isLoading={isLoading}
                                      columns={pppoeColumns}
                                      data={dueCustomer}
                                    ></Table>
                                  </div>
                                </>
                              ) : (
                                <h5 className="text-center">
                                  {t("youHaveNoPPPoECustomerType")}
                                </h5>
                              )}
                            </Tab>
                          )) ||
                          (type === "static" && (
                            <Tab eventKey="static" title={t("static")}>
                              <Accordion alwaysOpen activeKey={activeKeys}>
                                <Accordion.Item
                                  eventKey="filter"
                                  className="accordionBorder"
                                >
                                  <Accordion.Body className="accordionPadding pt-2">
                                    <div
                                      className="displayGrid6"
                                      style={{
                                        columnGap: "5px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      <div>
                                        <DatePicker
                                          selected={staticDate}
                                          className="form-control"
                                          onChange={(date) =>
                                            setStaticDate(date)
                                          }
                                          dateFormat="MMM/yyyy"
                                          showMonthYearPicker
                                          showFullMonthYearPicker
                                          endDate={"2014/04/08"}
                                          maxDate={lastDate}
                                          minDate={
                                            new Date(ispOwnerData?.createdAt)
                                          }
                                        />
                                      </div>

                                      <div className="gridButton">
                                        <button
                                          className="btn btn-outline-primary w-6rem"
                                          type="button"
                                          onClick={staticCustomerFilterHandler}
                                          id="filterBtn"
                                        >
                                          {t("filter")}
                                        </button>
                                      </div>
                                    </div>
                                  </Accordion.Body>
                                </Accordion.Item>
                              </Accordion>
                              {hasCustomerType.includes("static") ? (
                                <>
                                  <div className="table-section">
                                    <Table
                                      isLoading={staticLoading}
                                      columns={staticColumns}
                                      data={staticDueCustomer}
                                    ></Table>
                                  </div>
                                </>
                              ) : (
                                <h5 className="text-center">
                                  {t("youHaveNoStaticCustomerType")}
                                </h5>
                              )}
                            </Tab>
                          ))
                      )}
                    </Tabs>
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
