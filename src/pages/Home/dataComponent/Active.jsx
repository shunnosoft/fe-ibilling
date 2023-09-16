import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { PrinterFill } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import FormatNumber from "../../../components/common/NumberFormat";
import { badge } from "../../../components/common/Utils";
import Table from "../../../components/table/Table";
import { getActiveCustomer } from "../../../features/apiCalls";
import CustomerPdf from "../homePdf/CustomerPdf";

const Active = ({ ispOwnerId, month, year, status }) => {
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

  // get hotspot package
  const hotsPackage = useSelector((state) => state.hotspot?.package);

  // get active customer data
  const customer = useSelector(
    (state) => state.dashboardInformation?.activeCustomer
  );

  // is Loading state
  const [isLoading, setIsLoading] = useState(false);

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
        Cell: ({ row: { original } }) => (
          <div>{original && getCustomerPackage(original)?.name}</div>
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
    [t, allPackages, hotsPackage]
  );

  useEffect(() => {
    status === "active" &&
      getActiveCustomer(dispatch, ispOwnerId, year, month, setIsLoading);
  }, [month, status, year]);

  // all monthlyFee count
  const allBill = useMemo(() => {
    let count = 0;
    let balance = 0;
    customer.forEach((item) => {
      count = count + item.monthlyFee;
      balance += item.balance;
    });
    return { count, balance };
  }, [customer]);

  // custom component monthlyFee tk show
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
      &nbsp;&nbsp;
      {allBill.balance > 0 && (
        <div>
          {t("totalBalance")}-৳
          {FormatNumber(allBill.balance)}
        </div>
      )}
    </div>
  );

  return (
    <div
      className="modal fade"
      id="activeCustomer"
      tabIndex="-1"
      aria-labelledby="customerModalDetails"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-scrollable modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {t("activeCustomer")}
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
                      title={t("print")}
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
            {customer && (
              <>
                <div className="table-section">
                  <Table
                    isLoading={isLoading}
                    customComponent={
                      role === "ispOwner" ||
                      permissions?.dashboardCollectionData
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Active;
