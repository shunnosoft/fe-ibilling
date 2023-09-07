import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { PrinterFill } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import FormatNumber from "../../../components/common/NumberFormat";
import { badge } from "../../../components/common/Utils";
import Table from "../../../components/table/Table";
import { getExpiredCustomer } from "../../../features/apiCalls";
import CustomerPdf from "../homePdf/CustomerPdf";

const Expired = ({ ispOwnerId, year, month, status }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const componentRef = useRef();

  // get user role
  const role = useSelector((state) => state.persistedReducer.auth.role);

  // get user permission
  const permissions = useSelector(
    (state) => state.persistedReducer.auth.userData.permissions
  );

  // get all packages
  const allPackages = useSelector((state) => state.package.allPackages);

  // get expired customer data
  const customer = useSelector(
    (state) => state.dashboardInformation?.expiredCustomer
  );

  // is Loading state
  const [isLoading, setIsLoading] = useState(false);

  // customer current package find
  const getCustomerPackage = (pack) => {
    const findPack = allPackages.find((item) => item.id.includes(pack));
    return findPack;
  };

  const column = useMemo(
    () => [
      {
        width: "10%",
        Header: t("id"),
        accessor: "customerId",
      },
      {
        width: "10%",
        Header: t("name"),
        accessor: "name",
      },
      {
        width: "10%",
        Header: t("PPPoE"),
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
        width: "10%",
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
          <div>{customer && getCustomerPackage(value)?.name}</div>
        ),
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
        width: "10%",
        Header: t("bill"),
        accessor: "billingCycle",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("YYYY/MM/DD hh:mm A");
        },
      },
    ],
    [t, allPackages]
  );

  useEffect(() => {
    status === "expired" &&
      getExpiredCustomer(dispatch, ispOwnerId, year, month, setIsLoading);
  }, [month, status, year]);

  // all balance count
  const allBill = useMemo(() => {
    let count = 0;
    customer.forEach((item) => {
      count = count + item.monthlyFee;
    });
    return { count };
  }, [customer]);

  // custom component balance tk show
  const customComponent = (
    <div
      className="text-center"
      style={{ fontSize: "18px", fontWeight: "500", display: "flex" }}
    >
      {allBill.count > 0 && (
        <div>
          {t("totalBill")}-৳
          {FormatNumber(allBill.count)}
        </div>
      )}
    </div>
  );

  return (
    <div
      className="modal fade"
      id="expiredCustomer"
      tabIndex="-1"
      aria-labelledby="customerModalDetails"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-scrollable modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {t("expiredCustomer")}
            </h5>

            <div className="collectorWrapper pt-0">
              <div
                className="addAndSettingIcon"
                style={{
                  marginLeft: ".5rem",
                  textAlign: "end",
                }}
              >
                <ReactToPrint
                  documentTitle="Customer Overview"
                  trigger={() => (
                    <PrinterFill
                      // title={t("print")}
                      className="addcutmButton"
                      style={{ background: "#0EB96A", color: "white" }}
                    />
                  )}
                  content={() => componentRef.current}
                />
              </div>
            </div>

            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="table-section">
              <Table
                isLoading={isLoading}
                customComponent={
                  role === "ispOwner" || permissions?.dashboardCollectionData
                    ? customComponent
                    : ""
                }
                columns={column}
                data={customer}
              ></Table>
            </div>

            <div className="d-none">
              <CustomerPdf customerData={customer} ref={componentRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expired;
