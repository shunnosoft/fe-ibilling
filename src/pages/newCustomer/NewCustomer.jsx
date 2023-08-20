import React, { useMemo, useRef } from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { getNewCustomer } from "../../features/apiCalls";
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
import { Accordion, ToastContainer } from "react-bootstrap";
import ReactToPrint from "react-to-print";
import PPPoECustomerPrint from "./customerPrint/PPPoECustomerPrint";
import StaticCustomerPrint from "./customerPrint/StaticCustomerPrint";
import { CSVLink } from "react-csv";

const NewCustomer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const componentRef = useRef();

  // get Current date
  const today = new Date();

  // get first date of month
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  var lastDate = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // new customer state
  const [newCustomer, setNewCustomer] = useState([]);

  //customer type state
  const [customerType, setCustomerType] = useState("");

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
  const customer = useSelector((state) => state?.customer?.newCustomer);

  // get isp owner data
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth.userData
  );

  // get customer api call
  useEffect(() => {
    customer.length === 0 && getNewCustomer(dispatch, ispOwner, setIsLoading);
  }, []);

  useEffect(() => {
    setNewCustomer(customer);
  }, [customer]);

  // reload handler
  const reloadHandler = () => {
    getNewCustomer(dispatch, ispOwner, setIsLoading);
  };

  // filter function
  const onClickFilter = () => {
    let arr = [...customer];
    if (!customerType) {
      arr = customer;
    } else if (customerType && customerType === "pppoe") {
      arr = arr.filter((value) => value.userType === "pppoe");
    } else {
      arr = arr.filter((value) => value.userType !== "pppoe");
    }

    // date filter
    arr = arr.filter(
      (value) =>
        new Date(moment(value.createdAt).format("YYYY-MM-DD")).getTime() >=
          new Date(moment(startDate).format("YYYY-MM-DD")).getTime() &&
        new Date(moment(value.createdAt).format("YYYY-MM-DD")).getTime() <=
          new Date(moment(endDate).format("YYYY-MM-DD")).getTime()
    );

    setNewCustomer(arr);
  };

  const sortingCustomer = useMemo(() => {
    return [...newCustomer].sort((a, b) => {
      a = parseInt(a.customerId?.replace(/[^0-9]/g, ""));
      b = parseInt(b.customerId?.replace(/[^0-9]/g, ""));

      return a - b;
    });
  }, [newCustomer]);

  const tableData = useMemo(() => sortingCustomer, [newCustomer]);

  // pppoe customer csv table header
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

  //export pppoe customer data
  let PPPoECustomerForCsVTableInfo = tableData.map((customer) => {
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

  // static customer csv table header
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

  //export static customer data
  let staticCustomerForCsVTableInfo = tableData.map((customer) => {
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

  //total monthly fee collection in pppoe
  const customerBalance = useMemo(() => {
    let totalBalance = 0;
    let totalMonthlyFee = 0;

    newCustomer.map((item) => {
      totalBalance += item.balance;

      totalMonthlyFee += item.monthlyFee;
    });

    return { totalBalance, totalMonthlyFee };
  }, [newCustomer]);

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

  const filterData = {
    startDate,
    endDate,
  };

  // static column
  const columns = React.useMemo(
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
        width: "9%",
        Header: t("paymentStatus"),
        accessor: "paymentStatus",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "8%",
        Header: t("monthly"),
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
                  <div>{t("customer")}</div>

                  <div className="d-flex align-items-center">
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
                        ></ArrowClockwise>
                      )}
                    </div>

                    <div className="addAndSettingIcon">
                      <CSVLink
                        data={
                          customerType === "pppoe"
                            ? PPPoECustomerForCsVTableInfo
                            : staticCustomerForCsVTableInfo
                        }
                        filename={ispOwnerData.company}
                        headers={
                          customerType === "pppoe"
                            ? PPPoECustomerForCsVTableInfoHeader
                            : staticCustomerForCsVTableInfoHeader
                        }
                        title={
                          !customerType
                            ? t("report")
                            : customerType === "pppoe"
                            ? t("PPPoECustomerReport")
                            : t("staticCustomerReport")
                        }
                      >
                        <FiletypeCsv className="addcutmButton" />
                      </CSVLink>
                    </div>

                    <div className="addAndSettingIcon">
                      <ReactToPrint
                        documentTitle={
                          customerType === "pppoe"
                            ? t("PPPoECustomer")
                            : t("StaticCustomer")
                        }
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
                        <div className="displayGrid6">
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

                          <div>
                            <DatePicker
                              className="form-control mw-100"
                              selected={startDate}
                              onChange={(date) => setStartDate(date)}
                              dateFormat="MMM dd yyyy"
                              minDate={firstDay}
                              maxDate={
                                lastDate.getMonth() + 1 === today.getMonth() + 1
                                  ? today
                                  : lastDate
                              }
                              placeholderText={t("selectBillDate")}
                            />
                          </div>
                          <div>
                            <DatePicker
                              className="form-control mw-100"
                              selected={endDate}
                              onChange={(date) => setEndDate(date)}
                              dateFormat="MMM dd yyyy"
                              minDate={firstDay}
                              maxDate={
                                lastDate.getMonth() + 1 === today.getMonth() + 1
                                  ? today
                                  : lastDate
                              }
                              placeholderText={t("selectBillDate")}
                            />
                          </div>
                          <div>
                            <button
                              className="btn btn-outline-primary w-140 "
                              type="button"
                              onClick={onClickFilter}
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
                        <PPPoECustomerPrint
                          filterData={filterData}
                          currentCustomers={tableData}
                          ref={componentRef}
                        />
                      ) : (
                        <StaticCustomerPrint
                          filterData={filterData}
                          currentCustomers={tableData}
                          ref={componentRef}
                        />
                      )}
                    </div>
                    <div className="table-section">
                      <Table
                        customComponent={customComponent}
                        isLoading={isLoading}
                        columns={columns}
                        data={tableData}
                      ></Table>
                    </div>
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
