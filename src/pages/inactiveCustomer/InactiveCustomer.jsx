import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { CSVLink } from "react-csv";
import { Accordion, Badge } from "react-bootstrap";
import { GeoAlt, Person, Phone } from "react-bootstrap-icons";

// internal import
import { getInactiveCustomer } from "../../features/apiCalls";
import Table from "../../components/table/Table";
import { badge } from "../../components/common/Utils";
import PPPoECustomerDetails from "../Customer/customerCRUD/CustomerDetails";
import HotspotCustomerDetails from "../hotspot/customerOperation/CustomerDetails";
import StaticCustomerDetails from "../staticCustomer/customerCRUD/CustomerDetails";
import PrintOptions from "../../components/common/PrintOptions";
import useISPowner from "../../hooks/useISPOwner";
import { getResellerInactiveCustomer } from "../../features/resellerCustomerAdminApi";
import ResellerPPPoECustomerDetails from "../../reseller/Customer/customerCRUD/CustomerDetails";
import ResellerStaticCustomerDetails from "../../reseller/staticCustomer/staticCustomerCrud/CustomerDetails";
import {
  getCustomerDayLeft,
  getCustomerPromiseDate,
} from "../Customer/customerCRUD/customerBillDayPromiseDate";
import useDataState from "../../hooks/useDataState";
import DataFilter from "../common/DataFilter";

const InactiveCustomer = ({
  isInactiveLoading,
  setIsInactiveLoading,
  activeKeys,
  csvLinkDown,
  modal,
  setModal,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get Current date
  const today = new Date();
  var firstDate = new Date(today.getFullYear(), today.getMonth(), 1);

  firstDate.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);

  // get user & current user data form useISPOwner
  const { role, ispOwnerData, ispOwnerId, userData } = useISPowner();

  // get user data set from useDataState hooks
  const { filterOptions, setFilterOption } = useDataState();

  // user staff role
  const ispOwnerStaff =
    role === "ispOwner" ||
    role === "manager" ||
    (role === "collector" && !userData.reseller);

  // get ispOwner inactive customer
  let inactiveCustomer = useSelector(
    (state) => state.dashboardInformation.inactiveCustomer
  );

  // get reseller inactive customers form redux store
  const resellerCustomer = useSelector(
    (state) => state.resellerCustomer.inactiveCustomer
  );

  // get all packages
  const allPackages = useSelector((state) => state.package.allPackages);

  // get hotspot package
  const hotsPackage = useSelector((state) => state.hotspot?.package);

  // customer from role base
  const allCustomers = ispOwnerStaff ? inactiveCustomer : resellerCustomer;

  // inactive customer state
  const [inactiveCustomers, setInActiveCustomers] = useState([]);

  // view customer id
  const [customerId, setCustomerId] = useState("");

  // modal change state
  const [modalStatus, setModalStatus] = useState("");
  const [show, setShow] = useState(false);

  // reseller id from role base
  const resellerId = role === "collector" ? userData.reseller : userData.id;

  // set first date
  useEffect(() => {
    setFilterOption({
      ...filterOptions,
      month: firstDate,
    });
  }, []);

  // get customer api call
  useEffect(() => {
    if (filterOptions?.month !== undefined) {
      if (ispOwnerStaff) {
        filterOptions?.month.getMonth() + 1 &&
          getInactiveCustomer(
            dispatch,
            ispOwnerId,
            filterOptions?.month.getFullYear(),
            filterOptions?.month.getMonth() + 1,
            setIsInactiveLoading
          );
      } else {
        filterOptions?.month.getMonth() + 1 &&
          getResellerInactiveCustomer(
            dispatch,
            resellerId,
            filterOptions?.month.getFullYear(),
            filterOptions?.month.getMonth() + 1,
            setIsInactiveLoading
          );
      }
    }
  }, [filterOptions?.month]);

  // set all customers
  useEffect(() => {
    setInActiveCustomers(allCustomers);
  }, [allCustomers]);

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
  const customerForCsVTableInfo = inactiveCustomers.map((customer) => {
    return {
      customerId: customer.customerId,
      name: customer.name,
      pppoeIp:
        customer?.userType === "pppoe"
          ? customer?.pppoe?.name
          : customer?.userType === "static"
          ? customer?.queue?.target
          : customer?.hotspot?.name,
      mobile: customer?.mobile || "",
      status: customer.status,
      paymentStatus: customer.paymentStatus,
      package: customer && getCustomerPackage(customer)?.name,
      monthlyFee: customer.monthlyFee,
      balance: customer.balance,
      customerAddress: customer.address,
      email: customer.email || "",
      createdAt: moment(customer.createdAt).format("YYYY-MM-DD"),
      billingCycle: moment(customer.billingCycle).format("YYYY-MM-DD"),
    };
  });

  // inactive customer filter data
  const filterData = {
    startDate: filterOptions?.startCreateDate,
    endDate: filterOptions?.endCreateDate,
    customerType: filterOptions?.userType,
  };

  //customer print option
  const printData = {
    id: 1003,
    value: "PPIPHp",
    label: "PPIPHp",
    checked: true,
  };

  //inactive customer
  const columns = useMemo(
    () => [
      {
        width: "6%",
        Header: t("id"),
        accessor: "customerId",
        Cell: ({ row: { original } }) => (
          <div>
            <p className="text-center">{original?.customerId}</p>
            <Badge bg="primary">
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
                ? original?.pppoe?.name
                : original?.userType === "static"
                ? original?.queue?.target
                : original?.hotspot?.name}
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
      <Accordion alwaysOpen activeKey={activeKeys}>
        <Accordion.Item eventKey="filter" className="accordionBorder">
          <Accordion.Body className="accordionPadding pt-2">
            <DataFilter
              page="inactiveCustomer"
              customers={allCustomers}
              setCustomers={setInActiveCustomers}
              filterOptions={filterOptions}
              setFilterOption={setFilterOption}
            />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <div className="addCollector">
        <div className="d-none">
          <PrintOptions
            show={modal}
            setShow={setModal}
            filterData={filterData}
            tableData={inactiveCustomers}
            page={"customer"}
            printData={printData}
          />

          <div>
            <CSVLink
              data={customerForCsVTableInfo}
              filename={ispOwnerData.company}
              headers={customerForCsVTableInfoHeader}
              title={t("customerReport")}
              ref={csvLinkDown}
              target="_blank"
            ></CSVLink>
          </div>
        </div>

        <Table
          isLoading={isInactiveLoading}
          columns={columns}
          data={inactiveCustomers}
        ></Table>
      </div>

      {/* customer details modal by user type  */}

      {modalStatus === "pppoe" &&
        customerId &&
        (ispOwnerStaff ? (
          <PPPoECustomerDetails
            show={show}
            setShow={setShow}
            customerId={customerId}
          />
        ) : (
          <ResellerPPPoECustomerDetails
            show={show}
            setShow={setShow}
            customerId={customerId}
          />
        ))}

      {modalStatus === "hotspot" && customerId && ispOwnerStaff && (
        <HotspotCustomerDetails
          show={show}
          setShow={setShow}
          customerId={customerId}
        />
      )}

      {modalStatus === "static" &&
        customerId &&
        (ispOwnerStaff ? (
          <StaticCustomerDetails
            show={show}
            setShow={setShow}
            customerId={customerId}
          />
        ) : (
          <ResellerStaticCustomerDetails
            show={show}
            setShow={setShow}
            customerId={customerId}
          />
        ))}
    </>
  );
};

export default InactiveCustomer;
