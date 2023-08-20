import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getInactiveCustomer } from "../../features/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../components/table/Table";
import { badge } from "../../components/common/Utils";
import moment from "moment";
import CustomerPdf from "../Home/homePdf/CustomerPdf";
import { CSVLink } from "react-csv";
import { Accordion } from "react-bootstrap";

const InactiveCustomer = ({
  isInactiveLoading,
  setIsInactiveLoading,
  activeKeys,
  csvLinkDown,
  componentRef,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  //get current date
  const date = new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  //get ispOwner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // get isp owner data
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth.userData
  );

  // get ispOwner inactive customer
  let inactiveCustomer = useSelector(
    (state) => state.dashboardInformation.inactiveCustomer
  );

  //customer type state
  const [customerType, setCustomerType] = useState("");

  useEffect(() => {
    inactiveCustomer.length === 0 &&
      getInactiveCustomer(
        dispatch,
        ispOwnerId,
        year,
        month,
        setIsInactiveLoading
      );
  }, []);

  // reload handler
  // const reloadHandler = () => {
  //   getInactiveCustomer(
  //     dispatch,
  //     ispOwnerId,
  //     year,
  //     month,
  //     setIsInactiveLoading
  //   );
  // };

  //customer type filter
  if (customerType && customerType !== "all") {
    if (customerType === "pppoe") {
      inactiveCustomer = inactiveCustomer.filter(
        (value) => value.userType === "pppoe"
      );
    } else if (customerType === "static") {
      inactiveCustomer = inactiveCustomer.filter(
        (value) => value.userType !== "pppoe"
      );
    }
  }

  // inactive customer csv table header
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

  //inactive customer export customer data
  const customerForCsVTableInfo = inactiveCustomer.map((customer) => {
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

  //inactive customer
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

  return (
    <>
      <div className="collectorWrapper pb-2">
        <Accordion alwaysOpen activeKey={activeKeys}>
          <Accordion.Item eventKey="filter" className="accordionBorder">
            <Accordion.Body className="accordionPadding pt-2">
              <div className="displayGrid6">
                <select
                  className="form-select mw-100 mt-0"
                  onChange={(event) => setCustomerType(event.target.value)}
                >
                  <option selected value="all">
                    {t("userType")}
                  </option>
                  {ispOwnerData?.bpSettings?.customerType.map((cType) => (
                    <option value={cType}>{t(`${cType}`)}</option>
                  ))}
                </select>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <div className="addCollector">
          <div className="d-none">
            <CustomerPdf customerData={inactiveCustomer} ref={componentRef} />
          </div>
          <div>
            <CSVLink
              data={customerForCsVTableInfo}
              filename={ispOwnerData.company}
              headers={customerForCsVTableInfoHeader}
              title="inactive Customer CSV"
              ref={csvLinkDown}
              target="_blank"
            ></CSVLink>
          </div>

          <div className="table-section">
            <Table
              isLoading={isInactiveLoading}
              columns={columns}
              data={inactiveCustomer}
            ></Table>
          </div>
        </div>
      </div>
    </>
  );
};

export default InactiveCustomer;
