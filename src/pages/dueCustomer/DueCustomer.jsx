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
  PrinterFill,
} from "react-bootstrap-icons";
import { FontColor, FourGround } from "../../assets/js/theme";
import { Tab, Tabs } from "react-bootstrap";
import { CSVLink } from "react-csv";
import ReactToPrint from "react-to-print";
import PrintReport from "./print/ReportPDF";
import StaticPrintReport from "./print/StaticReportPDF";
import Footer from "../../components/admin/footer/Footer";

const DueCustomer = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const componentRef = useRef();
  const staticRef = useRef();

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // static Customr loading
  const [staticLoading, setStaticLoading] = useState(false);

  // pppoe payment status state
  const [paymentStatus, setPaymentStatus] = useState();

  // static payment status state
  const [staticPaymentStatus, setStaticPaymentStatus] = useState();

  // get current date
  const date = new Date();

  let month = date.getMonth();

  if (month === 0) {
    month = 12;
  }

  const year = date.getFullYear();

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

  // pppoe customer payment filter
  if (paymentStatus && paymentStatus !== "select") {
    dueCustomer = dueCustomer.filter(
      (value) => value.paymentStatus === paymentStatus
    );
  }

  // static customer payment filter
  if (staticPaymentStatus && staticPaymentStatus !== "select") {
    staticDueCustomer = staticDueCustomer.filter(
      (value) => value.paymentStatus === staticPaymentStatus
    );
  }

  // reload handler
  const reloadHandler = () => {
    getDueCustomer(dispatch, ispOwner, month, year, setIsLoading, "pppoe");
    getDueCustomer(dispatch, ispOwner, month, year, setIsLoading, "static");
  };

  // get customer api call
  useEffect(() => {
    if (dueCustomer.length === 0)
      getDueCustomer(dispatch, ispOwner, month, year, setIsLoading, "pppoe");
    if (staticDueCustomer.length === 0)
      getDueCustomer(
        dispatch,
        ispOwner,
        month,
        year,
        setStaticLoading,
        "static"
      );
  }, []);

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
      billingCycle: moment(customer.billingCycle).format("MMM-DD-YYYY"),
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
      createdAt: moment(customer.createdAt).format("MM/DD/YYYY"),
      package: customer?.queue?.package,
      mobile: customer?.mobile || "",
      status: customer.status,
      paymentStatus: customer.paymentStatus,
      email: customer.email || "",
      monthlyFee: customer.monthlyFee,
      balance: customer.balance,
      billingCycle: moment(customer.billingCycle).format("MMM-DD-YYYY"),
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
          return moment(value).format("MMM DD YYYY hh:mm A");
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
                <div className="collectorTitle d-flex justify-content-between px-5">
                  <div className="d-flex">
                    <h2>{t("dueCustomer")}</h2>
                    <div className="reloadBtn">
                      {isLoading ? (
                        <Loader></Loader>
                      ) : (
                        <ArrowClockwise
                          onClick={() => reloadHandler()}
                        ></ArrowClockwise>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <>
                      {/* for pppoe customer */}
                      <div className="addAndSettingIcon">
                        <CSVLink
                          data={customerForCsVTableInfo}
                          filename={ispOwnerData.company}
                          headers={customerForCsVTableInfoHeader}
                          title="PPPoE Cutomer CSV"
                        >
                          <FileExcelFill className="addcutmButton" />
                        </CSVLink>
                      </div>

                      <div
                        className="addAndSettingIcon"
                        title={t("PPPoE Cutomer Print")}
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
                      {/* end for pppoe customer */}

                      {/* for static customer */}
                      <div className="addAndSettingIcon">
                        <CSVLink
                          data={staticCustomerForCsVTableInfo}
                          filename={ispOwnerData.company}
                          headers={staticCustomerForCsVTableInfoHeader}
                          title="Static Cutomer CSV"
                        >
                          <FileExcelFill className="addcutmButton" />
                        </CSVLink>
                      </div>

                      <div
                        className="addAndSettingIcon"
                        title={t("Static Cutomer Print")}
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
                    <Tabs
                      defaultActiveKey={"pppoe"}
                      id="uncontrolled-tab-example"
                      className="mb-3"
                    >
                      <Tab eventKey="pppoe" title={t("PPPoE")}>
                        <div className="filter-section">
                          {/* filter selector */}
                          <select
                            className="form-select"
                            onChange={(e) => {
                              setPaymentStatus(e.target.value);
                            }}
                          >
                            <option value={"select"}>{t("select")}</option>
                            <option value={"paid"}>{t("paid")}</option>
                            <option value={"unpaid"}>{t("unpaid")}</option>
                          </select>
                        </div>

                        <div className="table-section">
                          <Table
                            isLoading={isLoading}
                            columns={pppoeColumns}
                            data={dueCustomer}
                          ></Table>
                        </div>
                      </Tab>
                      <Tab eventKey="static" title={t("static")}>
                        {/* filter selector */}
                        <select
                          className="form-select"
                          onChange={(e) => {
                            setStaticPaymentStatus(e.target.value);
                          }}
                        >
                          <option value={"select"}>{t("select")}</option>
                          <option value={"paid"}>{t("paid")}</option>
                          <option value={"unpaid"}>{t("unpaid")}</option>
                        </select>

                        <div className="table-section">
                          <Table
                            isLoading={staticLoading}
                            columns={staticColumns}
                            data={staticDueCustomer}
                          ></Table>
                        </div>
                      </Tab>
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
