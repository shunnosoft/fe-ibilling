import React, { useMemo, useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { Accordion } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { CSVLink } from "react-csv";

// internal import
import { getDueCustomer } from "../../features/apiCalls";
import Table from "../../components/table/Table";
import { badge } from "../../components/common/Utils";
import OtherCustomerPrint from "../newCustomer/customerPrint/OtherCustomerPrint";

const DueCustomer = ({
  isDueLoading,
  setIsDueLoading,
  activeKeys,
  csvLinkDown,
  componentRef,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // get current date
  const date = new Date();
  var currentMonth = new Date(date.getFullYear(), date.getMonth(), 1);
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

  // get all packages
  const allPackages = useSelector((state) => state.package.allPackages);

  // prev month due customer state
  const [customers, setCustomers] = useState([]);

  //customer type state
  const [customerType, setCustomerType] = useState("");

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
        setIsDueLoading
      );
  }, [filterDate]);

  useEffect(() => {
    setCustomers(dueCustomer);
  }, [dueCustomer]);

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

  // customer current package find
  const getCustomerPackage = (pack) => {
    const findPack = allPackages.find((item) => item.id.includes(pack));
    return findPack;
  };

  // inactive customer csv table header
  const customerForCsVTableInfoHeader = [
    { label: "customer_id", key: "customerId" },
    { label: "name_of_client", key: "name" },
    { label: "PPPoEName/IP", key: "pppoeIp" },
    { label: "client_phone", key: "mobile" },
    { label: "status", key: "status" },
    { label: "payment Status", key: "paymentStatus" },
    { label: "bandwidth_allocation MB", key: "package" },
    { label: "monthly_fee", key: "monthlyFee" },
    { label: "balance", key: "balance" },
    { label: "address_of_client", key: "customerAddress" },
    { label: "email", key: "email" },
    { label: "activation_date", key: "createdAt" },
    { label: "billing_cycle", key: "billingCycle" },
  ];

  //inactive customer export customer data
  const customerForCsVTableInfo = customers.map((customer) => {
    return {
      customerId: customer.customerId,
      name: customer.name,
      pppoeIp:
        customer?.userType === "pppoe"
          ? customer?.pppoe.name
          : customer?.userType === "firewall-queue"
          ? customer?.queue.address
          : customer?.userType === "core-queue"
          ? customer?.queue.srcAddress
          : customer?.userType === "simple-queue"
          ? customer?.queue.target
          : "",
      mobile: customer?.mobile || "",
      status: customer.status,
      paymentStatus: customer.paymentStatus,
      package:
        customer?.mikrotikPackage &&
        getCustomerPackage(customer?.mikrotikPackage)?.name,
      monthlyFee: customer.monthlyFee,
      balance: customer.balance,
      customerAddress: customer.address,
      email: customer.email || "",
      createdAt: moment(customer.createdAt).format("YYYY-MM-DD"),
      billingCycle: moment(customer.billingCycle).format("YYYY-MM-DD"),
    };
  });

  const filterData = {
    startDate: currentMonth,
    endDate: date,
    customerType,
  };

  // due-customer column
  const columns = useMemo(
    () => [
      {
        width: "7%",
        Header: t("id"),
        accessor: "customerId",
      },
      {
        width: "8%",
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
          field?.userType === "pppoe"
            ? field?.pppoe.name
            : field?.userType === "firewall-queue"
            ? field?.queue.address
            : field?.userType === "core-queue"
            ? field?.queue.srcAddress
            : field?.userType === "simple-queue"
            ? field?.queue.target
            : "",
      },
      {
        width: "10%",
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
        width: "10%",
        Header: t("paymentStatus"),
        accessor: "paymentStatus",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "10%",
        Header: t("package"),
        accessor: "mikrotikPackage",
        Cell: ({ cell: { value } }) => (
          <div>{customers && getCustomerPackage(value)?.name}</div>
        ),
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
        width: "8%",
        Header: t("bill"),
        accessor: "billingCycle",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("YYYY/MM/DD hh:mm A");
        },
      },
      {
        width: "8%",
        Header: t("createdAt"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("YYYY/MM/DD hh:mm A");
        },
      },
    ],
    [t, customers, allPackages]
  );

  return (
    <>
      <div className="collectorWrapper pb-2">
        <Accordion alwaysOpen activeKey={activeKeys}>
          <Accordion.Item eventKey="filter" className="accordionBorder">
            <Accordion.Body className="accordionPadding pt-2">
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
                  {ispOwnerData?.bpSettings?.customerType.map((cType) => (
                    <option value={cType}>{t(`${cType}`)}</option>
                  ))}
                </select>

                <div className="gridButton">
                  <button
                    className="btn btn-outline-primary w-140 "
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

        <div className="addCollector">
          <div style={{ display: "none" }}>
            <OtherCustomerPrint
              filterData={filterData}
              currentCustomers={customers}
              ref={componentRef}
            />
          </div>
          <div style={{ display: "none" }}>
            <CSVLink
              filename={ispOwnerData.company}
              headers={customerForCsVTableInfoHeader}
              data={customerForCsVTableInfo}
              title={t("customerReport")}
              ref={csvLinkDown}
              target="_blank"
            ></CSVLink>
          </div>

          <div className="table-section">
            <Table
              isLoading={isDueLoading}
              columns={columns}
              data={customers}
            ></Table>
          </div>
        </div>
      </div>
    </>
  );
};

export default DueCustomer;
