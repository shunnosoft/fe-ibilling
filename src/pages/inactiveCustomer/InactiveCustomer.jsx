import React, { useEffect, useRef, useState } from "react";
import {
  ArrowClockwise,
  FileExcelFill,
  PrinterFill,
} from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { FontColor, FourGround } from "../../assets/js/theme";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import Loader from "../../components/common/Loader";
import useDash from "../../assets/css/dash.module.css";
import { getInactiveCustomer } from "../../features/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../components/table/Table";
import { badge } from "../../components/common/Utils";
import moment from "moment";
import ReactToPrint from "react-to-print";
import CustomerPdf from "../Home/homePdf/CustomerPdf";
import { CSVLink } from "react-csv";

const InactiveCustomer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const componentRef = useRef();

  //Loading state
  const [isLoading, setIsLoading] = useState(false);

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
  const inactiveCustomer = useSelector(
    (state) => state.dashboardInformation.inactiveCustomer
  );

  // reload handler
  const reloadHandler = () => {
    getInactiveCustomer(dispatch, ispOwnerId, year, month, setIsLoading);
  };

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
  const inactive = React.useMemo(
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

  useEffect(() => {
    getInactiveCustomer(dispatch, ispOwnerId, year, month, setIsLoading);
  }, [month]);

  return (
    <>
      <Sidebar />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <div className="collectorTitle d-flex justify-content-between px-5">
              <div className="d-flex">
                <h2>{t("inactiveCustomer")}</h2>
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
                <div className="addAndSettingIcon">
                  <CSVLink
                    data={customerForCsVTableInfo}
                    filename={ispOwnerData.company}
                    headers={customerForCsVTableInfoHeader}
                    title="inactive Customer CSV"
                  >
                    <FileExcelFill className="addcutmButton" />
                  </CSVLink>
                </div>

                <div
                  className="addAndSettingIcon"
                  title={t("inactiveCustomer")}
                >
                  <ReactToPrint
                    documentTitle={t("inactiveCustomer")}
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

            <FourGround>
              <div className="collectorWrapper mt-2 py-2">
                <Table
                  isLoading={isLoading}
                  columns={inactive}
                  data={inactiveCustomer}
                ></Table>
              </div>

              <div className="d-none">
                <CustomerPdf
                  customerData={inactiveCustomer}
                  ref={componentRef}
                />
              </div>
            </FourGround>
          </div>
        </div>
      </div>
    </>
  );
};

export default InactiveCustomer;
