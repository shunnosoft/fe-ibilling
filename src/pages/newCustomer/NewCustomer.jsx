import React, { useMemo, useRef } from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { getCustomer, getStaticCustomer } from "../../features/apiCalls";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../components/table/Table";
import { badge } from "../../components/common/Utils";
import moment from "moment";
import DatePicker from "react-datepicker";
import Loader from "../../components/common/Loader";
import {
  ArrowClockwise,
  FiletypeCsv,
  FilterCircle,
  PrinterFill,
} from "react-bootstrap-icons";
import { Accordion, Tab, Tabs } from "react-bootstrap";
import ReactToPrint from "react-to-print";
import PPPoECustomerPrint from "./customerPrint/PPPoECustomerPrint";
import StaticCustomerPrint from "./customerPrint/StaticCustomerPrint";
import { CSVLink } from "react-csv";
import FormatNumber from "../../components/common/NumberFormat";

const NewCustomer = () => {
  const { t } = useTranslation();
  // import dispatch
  const dispatch = useDispatch();
  const PPPoEComponentRef = useRef(); //reference of pdf export component
  const staticComponentRef = useRef(); //reference of pdf export component

  // get Current date
  const today = new Date();

  // get first date of month
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  // main data state
  const [mainData, setMainData] = useState([]);

  // static customer state
  const [staticData, setStaticData] = useState([]);

  // loading state
  const [staticLoading, setStaticLoading] = useState(false);
  const [pppoeLoading, setPppoeLoading] = useState(false);

  // start date state
  const [startDate, setStartDate] = useState(firstDay);

  // end date state
  const [endDate, setEndDate] = useState(today);

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

  // get isp owner id
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // get all customer from redux
  const customer = useSelector((state) => state?.customer?.customer);

  // get all static customer from redux
  const staticCustomer = useSelector(
    (state) => state?.customer?.staticCustomer
  );

  // get isp owner data
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth.userData
  );
  console.log(ispOwnerData);

  // filter function
  const onClickFilter = (value) => {
    let filterData = [];
    if (value === "pppoe") {
      filterData = [...customer];
    }
    if (value === "static") {
      filterData = [...staticCustomer];
    }

    // date filter
    filterData = filterData.filter(
      (value) =>
        new Date(moment(value.createdAt).format("YYYY-MM-DD")).getTime() >=
          new Date(moment(startDate).format("YYYY-MM-DD")).getTime() &&
        new Date(moment(value.createdAt).format("YYYY-MM-DD")).getTime() <=
          new Date(moment(endDate).format("YYYY-MM-DD")).getTime()
    );

    if (value === "pppoe") {
      setMainData(filterData);
    }
    if (value === "static") {
      setStaticData(filterData);
    }
  };

  // reload handler
  const reloadHandler = () => {
    getCustomer(dispatch, ispOwner, setPppoeLoading);
    getStaticCustomer(dispatch, ispOwner, setStaticLoading);
  };

  // get customer api call
  useEffect(() => {
    if (mainData.length === 0) getCustomer(dispatch, ispOwner, setPppoeLoading);
    if (staticData.length === 0)
      getStaticCustomer(dispatch, ispOwner, setStaticLoading);
  }, []);

  // set customer data on maindata state
  useEffect(() => {
    setMainData(customer);
  }, [customer]);

  // initial filter
  useEffect(() => {
    let initialFilter = [...customer];

    // date filter
    initialFilter = initialFilter.filter(
      (value) =>
        new Date(moment(value.createdAt).format("YYYY-MM-DD")).getTime() >=
          new Date(moment(startDate).format("YYYY-MM-DD")).getTime() &&
        new Date(moment(value.createdAt).format("YYYY-MM-DD")).getTime() <=
          new Date(moment(endDate).format("YYYY-MM-DD")).getTime()
    );

    setMainData(initialFilter);
  }, [customer]);

  // set static customer in static state
  useEffect(() => {
    setStaticData(staticCustomer);
  }, [staticCustomer]);

  // initial filter for static customer
  useEffect(() => {
    let staticInitialFilter = [...staticCustomer];

    // date filter
    staticInitialFilter = staticInitialFilter.filter(
      (value) =>
        new Date(moment(value.createdAt).format("YYYY-MM-DD")).getTime() >=
          new Date(moment(startDate).format("YYYY-MM-DD")).getTime() &&
        new Date(moment(value.createdAt).format("YYYY-MM-DD")).getTime() <=
          new Date(moment(endDate).format("YYYY-MM-DD")).getTime()
    );

    setStaticData(staticInitialFilter);
  }, [staticCustomer]);

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
        accessor: "name",
      },
      {
        width: "9%",
        Header: t("PPPoE"),
        accessor: "pppoe.name",
      },
      {
        width: "10%",
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
        width: "10%",
        Header: t("bill"),
        accessor: "billingCycle",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("YYYY/MM/DD hh:mm A");
        },
      },
      {
        width: "10%",
        Header: t("createdAt"),
        accessor: "createdAt",
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
        width: "9%",
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
        width: "10%",
        Header: t("bill"),
        accessor: "billingCycle",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("YYYY/MM/DD hh:mm A");
        },
      },
      {
        width: "10%",
        Header: t("createdAt"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("YYYY/MM/DD hh:mm A");
        },
      },
    ],
    [t]
  );

  //total monthly fee collection in pppoe
  const customerBalance = useMemo(() => {
    let totalBalance = 0;

    let totalMonthlyFee = 0;

    mainData.map((item) => {
      // filter due ammount
      totalBalance += item.balance;

      // sum of all monthly fee
      totalMonthlyFee += item.monthlyFee;
    });

    return { totalBalance, totalMonthlyFee };
  }, [mainData]);

  //custom table header component
  const customComponent = (
    <div className="text-center" style={{ fontSize: "18px", display: "flex" }}>
      {customerBalance.totalMonthlyFee > 0 && (
        <div style={{ marginRight: "10px" }}>
          {t("monthlyFee")}:-৳{customerBalance.totalMonthlyFee}
        </div>
      )}
      {customerBalance.totalBalance > 0 && (
        <div style={{ marginRight: "10px" }}>
          {t("totalCollection")}:-৳{customerBalance.totalBalance}
        </div>
      )}
    </div>
  );

  //total monthly fee collection static
  const staticCustomerBalance = useMemo(() => {
    let totalBalance = 0;

    let totalMonthlyFee = 0;

    staticData.map((item) => {
      // filter due ammount
      totalBalance += item.balance;

      // sum of all monthly fee
      totalMonthlyFee += item.monthlyFee;
    });

    return { totalBalance, totalMonthlyFee };
  }, [staticData]);

  //custom table header component
  const customComponentStatic = (
    <div style={{ fontSize: "18px", display: "flex", alignItems: "center" }}>
      {staticCustomerBalance?.totalMonthlyFee > 0 && (
        <div style={{ marginRight: "10px" }}>
          {t("monthlyFee")}:-৳{staticCustomerBalance.totalMonthlyFee}
        </div>
      )}
      {staticCustomerBalance?.totalBalance > 0 && (
        <div style={{ marginRight: "10px" }}>
          {t("totalCollection")}:-৳{staticCustomerBalance.totalBalance}
        </div>
      )}
    </div>
  );

  // csv table header
  const PPPoECustomerForCsVTableInfoHeader = [
    { label: "name_of_client", key: "name" },
    { label: "PPPoE_Name", key: "pppoeName" },
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

  //export customer data
  let PPPoECustomerForCsVTableInfo = mainData.map((customer) => {
    return {
      name: customer.name,
      pppoeName: customer.pppoe.name,
      customerAddress: customer.address,
      createdAt: moment(customer.createdAt).format("YYYY-MM-DD"),
      package: customer?.pppoe?.profile,
      mobile: customer?.mobile || "",
      status: customer.status,
      paymentStatus: customer.paymentStatus,
      email: customer.email || "",
      monthlyFee: customer.monthlyFee,
      balance: customer.balance,
      billingCycle: moment(customer.billingCycle).format("YYYY-MM-DD"),
    };
  });

  const staticCustomerForCsVTableInfoHeader = [
    { label: "name_of_client", key: "name" },
    { label: "address_of_client", key: "customerAddress" },
    { label: "activation_date", key: "createdAt" },
    { label: "customer_ip", key: "ip" },
    { label: "client_phone", key: "mobile" },
    { label: "status", key: "status" },
    { label: "payment Status", key: "paymentStatus" },
    { label: "email", key: "email" },
    { label: "monthly_fee", key: "monthlyFee" },
    { label: "balance", key: "balance" },
    { label: "billing_cycle", key: "billingCycle" },
  ];

  //export customer data
  let staticCustomerForCsVTableInfo = staticData.map((customer) => {
    return {
      name: customer.name,
      ip:
        customer.userType === "firewall-queue"
          ? customer.queue.address
          : customer.queue.target,
      customerAddress: customer.address,
      createdAt: moment(customer.createdAt).format("YYYY-MM-DD"),
      mobile: customer?.mobile || "",
      status: customer.status,
      paymentStatus: customer.paymentStatus,
      email: customer.email || "",
      monthlyFee: customer.monthlyFee,
      balance: customer.balance,
      billingCycle: moment(customer.billingCycle).format("YYYY-MM-DD"),
    };
  });

  const filterData = {
    startDate,
    endDate,
  };

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
                    <h2>{t("customer")}</h2>
                  </div>
                  <div className="d-flex align-items-center justify-content-center">
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
                      {pppoeLoading && staticLoading ? (
                        <Loader></Loader>
                      ) : (
                        <ArrowClockwise
                          onClick={() => reloadHandler()}
                        ></ArrowClockwise>
                      )}
                    </div>

                    <div className="addAndSettingIcon">
                      <CSVLink
                        data={PPPoECustomerForCsVTableInfo}
                        filename={ispOwnerData.company}
                        headers={PPPoECustomerForCsVTableInfoHeader}
                        title={t("PPPoECustomerReport")}
                      >
                        <FiletypeCsv className="addcutmButton" />
                      </CSVLink>
                    </div>

                    <div className="addAndSettingIcon">
                      <ReactToPrint
                        documentTitle={t("PPPoE Customer")}
                        trigger={() => (
                          <PrinterFill
                            title={t("PPPoECustomerPrint")}
                            className="addcutmButton"
                          />
                        )}
                        content={() => PPPoEComponentRef.current}
                      />
                    </div>
                    <div style={{ display: "none" }}>
                      <PPPoECustomerPrint
                        filterData={filterData}
                        currentCustomers={mainData}
                        ref={PPPoEComponentRef}
                      />
                    </div>

                    <div className="addAndSettingIcon">
                      <CSVLink
                        data={staticCustomerForCsVTableInfo}
                        filename={ispOwnerData.company}
                        headers={staticCustomerForCsVTableInfoHeader}
                        title={t("staticCustomerReport")}
                      >
                        <FiletypeCsv className="addcutmButton" />
                      </CSVLink>
                    </div>

                    <div className="addAndSettingIcon">
                      <ReactToPrint
                        documentTitle={t("Static Customer")}
                        trigger={() => (
                          <PrinterFill
                            title={t("StaticCustomerPrint")}
                            className="addcutmButton"
                          />
                        )}
                        content={() => staticComponentRef.current}
                      />
                    </div>
                    <div style={{ display: "none" }}>
                      <StaticCustomerPrint
                        filterData={filterData}
                        currentCustomers={staticData}
                        ref={staticComponentRef}
                      />
                    </div>
                  </div>
                </div>
              </FourGround>
              <FourGround>
                <div className="collectorWrapper mt-2 py-2">
                  <div className="addCollector">
                    <Tabs id="uncontrolled-tab-example">
                      {ispOwnerData?.bpSettings.customerType.map(
                        (type) =>
                          (type === "pppoe" && (
                            <Tab eventKey="pppoe" title={t("PPPoE")}>
                              {/* filter selector */}
                              <Accordion alwaysOpen activeKey={activeKeys}>
                                <Accordion.Item
                                  eventKey="filter"
                                  className="accordionBorder"
                                >
                                  <Accordion.Body className="accordionPadding pt-2">
                                    <div className="selectFilteringg">
                                      <div>
                                        <DatePicker
                                          className="form-control mw-100"
                                          selected={startDate}
                                          onChange={(date) =>
                                            setStartDate(date)
                                          }
                                          dateFormat="MMM dd yyyy"
                                          placeholderText={t("selectBillDate")}
                                        />
                                      </div>
                                      <div className="mx-2">
                                        <DatePicker
                                          className="form-control mw-100"
                                          selected={endDate}
                                          onChange={(date) => setEndDate(date)}
                                          dateFormat="MMM dd yyyy"
                                          placeholderText={t("selectBillDate")}
                                        />
                                      </div>
                                      <div>
                                        <button
                                          className="btn btn-outline-primary w-140 "
                                          type="button"
                                          onClick={() => onClickFilter("pppoe")}
                                        >
                                          {t("filter")}
                                        </button>
                                      </div>
                                    </div>
                                  </Accordion.Body>
                                </Accordion.Item>
                              </Accordion>

                              <div className="table-section">
                                <Table
                                  customComponent={customComponent}
                                  isLoading={pppoeLoading}
                                  columns={pppoeColumns}
                                  data={mainData}
                                ></Table>
                              </div>
                            </Tab>
                          )) ||
                          (type === "static" && (
                            <Tab eventKey="static" title={t("static")}>
                              {/* filter selector */}
                              <Accordion alwaysOpen activeKey={activeKeys}>
                                <Accordion.Item
                                  eventKey="filter"
                                  className="accordionBorder"
                                >
                                  <Accordion.Body className="accordionPadding pt-2">
                                    <div className="selectFilteringg">
                                      <div>
                                        <DatePicker
                                          className="form-control mw-100"
                                          selected={startDate}
                                          onChange={(date) =>
                                            setStartDate(date)
                                          }
                                          dateFormat="MMM dd yyyy"
                                          placeholderText={t("selectBillDate")}
                                        />
                                      </div>
                                      <div className="mx-2">
                                        <DatePicker
                                          className="form-control mw-100"
                                          selected={endDate}
                                          onChange={(date) => setEndDate(date)}
                                          dateFormat="MMM dd yyyy"
                                          placeholderText={t("selectBillDate")}
                                        />
                                      </div>
                                      <div>
                                        <button
                                          className="btn btn-outline-primary w-140 "
                                          type="button"
                                          onClick={() =>
                                            onClickFilter("static")
                                          }
                                        >
                                          {t("filter")}
                                        </button>
                                      </div>
                                    </div>
                                  </Accordion.Body>
                                </Accordion.Item>
                              </Accordion>

                              <div className="table-section">
                                <Table
                                  customComponent={customComponentStatic}
                                  isLoading={staticLoading}
                                  columns={staticColumns}
                                  data={staticData}
                                ></Table>
                              </div>
                            </Tab>
                          ))
                      )}
                    </Tabs>
                  </div>
                </div>
              </FourGround>
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewCustomer;
