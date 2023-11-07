import React, { useMemo, useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { Accordion } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { CSVLink } from "react-csv";
import { GeoAlt, Person, Phone } from "react-bootstrap-icons";

// internal import
import { getDueCustomer } from "../../features/apiCalls";
import Table from "../../components/table/Table";
import { badge } from "../../components/common/Utils";
import PPPoECustomerDetails from "../Customer/customerCRUD/CustomerDetails";
import HotspotCustomerDetails from "../hotspot/customerOperation/CustomerDetails";
import StaticCustomerDetails from "../staticCustomer/customerCRUD/CustomerDetails";
import PrintOptions from "../../components/common/PrintOptions";

const DueCustomer = ({
  isDueLoading,
  setIsDueLoading,
  activeKeys,
  csvLinkDown,
  modal,
  setModal,
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

  // get hotspot package
  const hotsPackage = useSelector((state) => state.hotspot?.package);

  // prev month due customer state
  const [customers, setCustomers] = useState([]);

  // view customer id
  const [customerId, setCustomerId] = useState("");

  // modal change state
  const [modalStatus, setModalStatus] = useState("");
  const [show, setShow] = useState(false);

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

  //find customer billing date before and after promise date
  const getCustomerPromiseDate = (data) => {
    const billDate = moment(data?.billingCycle).format("YYYY/MM/DD hh:mm A");

    const promiseDate = moment(data?.promiseDate).format("YYYY/MM/DD hh:mm A");

    var promiseDateChange;

    if (billDate < promiseDate) {
      promiseDateChange = "danger";
    } else if (billDate > promiseDate) {
      promiseDateChange = "warning";
    }

    return { billDate, promiseDate, promiseDateChange };
  };

  // customer day left filtering in current date
  const getCustomerDayLeft = (billDate) => {
    //current day
    const currentDay = new Date(
      new Date(moment(date).format("YYYY-MM-DD"))
    ).getTime();

    // // billing day
    const billDay = new Date(
      new Date(moment(billDate).format("YYYY-MM-DD"))
    ).getTime();

    const diffInMs = billDay - currentDay;

    // // bill day left
    const dayLeft = Math.round(diffInMs / (1000 * 60 * 60 * 24));

    return dayLeft;
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

  const filterData = {
    startDate: currentMonth,
    endDate: date,
    customerType,
  };

  // due-customer column
  const columns = React.useMemo(
    () => [
      {
        width: "6%",
        Header: t("id"),
        accessor: "customerId",
      },
      {
        width: "5%",
        Header: t("type"),
        accessor: "userType",
        Cell: ({ row: { original } }) => (
          <div>
            {original?.userType === "pppoe"
              ? "PPPoE"
              : original?.userType === "hotspot"
              ? "Hotspot"
              : "Static"}
          </div>
        ),
      },
      {
        width: "14%",
        Header: t("pppoeIp"),
        accessor: (data) =>
          `${data?.name} ${data.pppoe?.name} ${data.queue?.address}
           ${data.queue?.srcAddress} ${data.queue?.target} ${data.hotspot?.name}`,
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
                : original?.userType === "simple-queue"
                ? original?.queue.target
                : original?.hotspot.name}
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
        Header: t("action"),
        id: "option",
        Cell: ({ row: { original } }) => (
          <div className="d-flex justify-content-center align-items-center">
            {/* customer profile details by user type */}
            <button
              className="btn btn-sm btn-outline-primary p-1"
              title={t("profile")}
              onClick={() => {
                setModalStatus(original?.userType);
                setCustomerId(original?.id);
                setShow(true);
              }}
            >
              <Person size={19} />
            </button>
          </div>
        ),
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
            <PrintOptions
              show={modal}
              setShow={setModal}
              filterData={filterData}
              tableData={customers}
              page={"customer"}
            />

            <div>
              <CSVLink
                filename={ispOwnerData.company}
                headers={customerForCsVTableInfoHeader}
                data={customerForCsVTableInfo}
                title={t("customerReport")}
                ref={csvLinkDown}
                target="_blank"
              ></CSVLink>
            </div>
          </div>

          <Table
            isLoading={isDueLoading}
            columns={columns}
            data={customers}
          ></Table>
        </div>
      </div>

      {/* customer details modal by user type  */}

      {modalStatus === "pppoe" ? (
        <PPPoECustomerDetails
          show={show}
          setShow={setShow}
          customerId={customerId}
        />
      ) : modalStatus === "hotspot" ? (
        <HotspotCustomerDetails
          show={show}
          setShow={setShow}
          customerId={customerId}
        />
      ) : (
        <StaticCustomerDetails
          show={show}
          setShow={setShow}
          customerId={customerId}
        />
      )}
    </>
  );
};

export default DueCustomer;
