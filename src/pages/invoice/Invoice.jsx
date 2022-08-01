import React, { useEffect, useRef, useState } from "react";
import "../Customer/customer.css";
import "./invoice.css";
import moment from "moment";
// import { Link } from "react-router-dom";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";

// internal imports
import Footer from "../../components/admin/footer/Footer";
import { FontColor, FourGround } from "../../assets/js/theme";

import { getInvoices } from "../../features/apiCalls";
import { showModal } from "../../features/uiSlice";
import Table from "../../components/table/Table";
import { badge } from "../../components/common/Utils";
import { useTranslation } from "react-i18next";
import ReactToPrint from "react-to-print";
import { PrinterFill } from "react-bootstrap-icons";
import PrintInvoice from "./invoicePDF";

function Invoice() {
  const { t } = useTranslation();
  const componentRef = useRef(); //reference of pdf export component
  const [isLoading, setIsloading] = useState(false);
  const dispatch = useDispatch();
  const ispOwnerId = useSelector(
    (state) => state?.persistedReducer?.auth?.ispOwnerId
  );

  const invoices = useSelector(
    (state) => state?.persistedReducer?.invoice?.invoices
  );

  console.log(invoices);

  useEffect(() => {
    if (invoices.length === 0) getInvoices(dispatch, ispOwnerId, setIsloading);
  }, [dispatch, ispOwnerId]);

  const columns2 = React.useMemo(
    () => [
      {
        width: "10%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "16%",
        Header: t("type"),
        accessor: "reseller.name",
        Cell: ({ row: { original } }) => (
          <td>
            {original.type === "registration"
              ? t("registration")
              : original.type === "migration"
              ? t("packageMigration")
              : original.type === "smsPurchase"
              ? t("message")
              : t("monthFee")}
          </td>
        ),
      },
      {
        width: "16%",
        Header: t("amount"),
        accessor: "amount",
        Cell: ({ row: { original } }) => <td>{original.amount} Tk</td>,
      },
      {
        width: "16%",
        Header: t("status"),
        accessor: "status",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },

      {
        width: "26%",
        Header: t("invoiceDate"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm a");
        },
      },
      {
        width: "15%",
        Header: () => <div className="text-center">{t("action")}</div>,
        id: "option",

        Cell: ({ row: { original } }) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {original.status === "unpaid" ? (
              <span
                style={{ cursor: "pointer" }}
                className="badge bg-warning text-dark shadow"
                onClick={() => {
                  dispatch(showModal(original));
                }}
              >
                Pay ৳
              </span>
            ) : (
              ""
            )}
          </div>
        ),
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
                <div className="collectorTitle d-flex justify-content-between px-5">
                  <h2> {t("invoice")} </h2>
                  <div className="addAndSettingIcon">
                    <ReactToPrint
                      documentTitle="গ্রাহক লিস্ট"
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
              </FourGround>

              <FourGround>
                <div style={{ display: "none" }}>
                  <PrintInvoice
                    currentCustomers={invoices}
                    ref={componentRef}
                  />
                </div>
                <div className="collectorWrapper">
                  {/* table */}
                  <div className="table-section">
                    <Table
                      isLoading={isLoading}
                      data={invoices}
                      columns={columns2}
                    ></Table>
                  </div>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
}

export default Invoice;
