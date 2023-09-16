import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import DatePicker from "react-datepicker";
import { Accordion } from "react-bootstrap";
import { CSVLink } from "react-csv";

// internal import
import { getNewCustomer } from "../../features/apiCalls";
import Table from "../../components/table/Table";
import { badge } from "../../components/common/Utils";
import OtherCustomerPrint from "./customerPrint/OtherCustomerPrint";

const NewCustomer = ({
  isNewLoading,
  setIsNewLoading,
  activeKeys,
  csvLinkDown,
  componentRef,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get Current date
  const today = new Date();
  var firstDate = new Date(today.getFullYear(), today.getMonth(), 1);

  firstDate.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);

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

  // get all packages
  const allPackages = useSelector((state) => state.package.allPackages);

  // get hotspot package
  const hotsPackage = useSelector((state) => state.hotspot?.package);

  // new customer state
  const [newCustomer, setNewCustomer] = useState([]);

  //customer type state
  const [customerType, setCustomerType] = useState("");

  //filter state
  const [filterDate, setFilterDate] = useState(firstDate);

  // current & priv date
  const [startDate, setStartDate] = useState(firstDate);
  const [endDate, setEndDate] = useState(new Date());

  // current start & end date
  var selectDate = new Date(filterDate.getFullYear(), filterDate.getMonth(), 1);
  var lastDate = new Date(
    filterDate.getFullYear(),
    filterDate.getMonth() + 1,
    0
  );

  // get customer api call
  useEffect(() => {
    setStartDate(selectDate);

    if (lastDate.getMonth() + 1 === today.getMonth() + 1) {
      setEndDate(today);
    } else {
      setEndDate(lastDate);
    }

    filterDate.getMonth() + 1 &&
      getNewCustomer(
        dispatch,
        ispOwner,
        filterDate.getFullYear(),
        filterDate.getMonth() + 1,
        setIsNewLoading
      );
  }, [filterDate]);

  useEffect(() => {
    setNewCustomer(customer);
  }, [customer]);

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

  // customer current package find
  const getCustomerPackage = (value) => {
    if (value?.userType === "hotspot") {
      const findPack = hotsPackage.find((item) =>
        item.id.includes(value?.hotspotPackage)
      );
      return findPack;
    } else {
      const findPack = allPackages.find((item) =>
        item.id.includes(value?.mikrotikPackage)
      );
      return findPack;
    }
  };

  const sortingCustomer = useMemo(() => {
    return [...newCustomer].sort((a, b) => {
      a = parseInt(a.customerId?.replace(/[^0-9]/g, ""));
      b = parseInt(b.customerId?.replace(/[^0-9]/g, ""));

      return a - b;
    });
  }, [newCustomer]);

  const tableData = useMemo(() => sortingCustomer, [newCustomer]);

  // new customer csv table header
  const newCustomerForCsVTableInfoHeader = [
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

  // new customer csv table data
  const newCustomerForCsVTableInfo = tableData.map((customer) => {
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
          : customer?.hotspot.name,
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
    customerType,
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
        width: "10%",
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
            : field?.hotspot.name,
      },
      {
        width: "9%",
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
        width: "9%",
        Header: t("package"),
        Cell: ({ row: { original } }) => (
          <div>{original && getCustomerPackage(original)?.name}</div>
        ),
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
    [t, allPackages, hotsPackage]
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

                <div>
                  <DatePicker
                    className="form-control mw-100"
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="MMM dd yyyy"
                    minDate={selectDate}
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
                    minDate={selectDate}
                    maxDate={
                      lastDate.getMonth() + 1 === today.getMonth() + 1
                        ? today
                        : lastDate
                    }
                    placeholderText={t("selectBillDate")}
                  />
                </div>
                <div className="gridButton">
                  <button
                    className="btn btn-outline-primary w-140"
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

        <div className="addCollector">
          <div style={{ display: "none" }}>
            <OtherCustomerPrint
              filterData={filterData}
              currentCustomers={tableData}
              ref={componentRef}
            />

            <div>
              <CSVLink
                data={newCustomerForCsVTableInfo}
                filename={ispOwnerData.company}
                headers={newCustomerForCsVTableInfoHeader}
                title={t("customerReport")}
                ref={csvLinkDown}
                target="_blank"
              ></CSVLink>
            </div>
          </div>

          <div className="table-section">
            <Table
              customComponent={customComponent}
              isLoading={isNewLoading}
              columns={columns}
              data={tableData}
            ></Table>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewCustomer;
